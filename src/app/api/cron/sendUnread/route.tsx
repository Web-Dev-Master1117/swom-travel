import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import nodemailer, { Transporter } from 'nodemailer';
import { emailTemplate } from './emailTemplate';

// Initialize Supabase client
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceRoleKey: string = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create a Nodemailer transporter
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email using Nodemailer
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.response);
        resolve(info);
      }
    });
  });
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Fetch distinct user_id with unread messages from Supabase
    const { data: receipts, error: receiptsError } = await supabase
      .from('read_receipts')
      .select('user_id, notified')
      .eq('notified', false);

    if (receiptsError) {
      throw new Error(`Error fetching unread messages: ${receiptsError.message}`);
    }

    // Group unread messages by user_id
    const userIds = new Set(receipts.map((receipt) => receipt.user_id));
    console.log(userIds);

    // Send email to each user with unread messages
    for (const user_id of userIds) {
      const { data: userData, error: userError } = await supabase
        .from('appUsers')
        .select('email')
        .eq('id', user_id)
        .single();

      if (userError) {
        console.error(`Error fetching user email for user_id ${user_id}:`, userError);
        continue;
      }

      // const htmlContent = `
      //   <h1>You have unread messages on SWOM</h1>
      //   <p>Please check your inbox to read them.</p>
      // `;

      await sendEmail(
        userData.email,
        'You have unread messages',
        emailTemplate
      );

      // Update notified to true
      const { error: updateError } = await supabase
        .from('read_receipts')
        .update({ notified: true })
        .eq('user_id', user_id);

      if (updateError) {
        console.error(`Error updating notified for user_id ${user_id}:`, updateError);
      }
    }

    return NextResponse.json({ message: 'Emails sent and notifications updated successfully' });
  } catch (error: unknown) {
    console.error('Unhandled error in main handler:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error has occurred." }, { status: 500 });
    }
  }
}
