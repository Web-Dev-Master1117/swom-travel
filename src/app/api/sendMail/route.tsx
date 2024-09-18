// pages/api/sendEmail.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const { email, language } = body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 's.cuevas14@gmail.com', // Your Gmail address
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: 'ana@swom.travel',
    subject: `New help request from ${email}`,
    text: language,
    html: `
      <h2>New help request from ${email}</h2>
      <p>Language: ${language}</p>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return NextResponse.json({ response, message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    // Handle any errors and return an error response
    return NextResponse.json({ res, error: error });
  }
}
