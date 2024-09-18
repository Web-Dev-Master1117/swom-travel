export const emailTemplate = `
<!-- emailTemplate.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unread Message Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
        }
        .banner {
            width: 100%;
            height: auto;
        }
        .headline {
            padding: 20px;
            text-align: center;
            background-color: #f8f8f8;
        }
        .separator {
            width: 100%;
            height: 2px;
            background-color: #000000;
        }
        .message {
            padding: 20px;
        }
        .button-container {
            text-align: center;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background-color: #f8f8f8;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://libg.s3.us-east-2.amazonaws.com/download/San-Francisco.jpg" alt="Banner" class="banner">
        <div class="headline">
            <h1>You have unread messages on SWOM</h1>
        </div>
        <div class="separator"></div>
        <div class="message">
            <!-- Insert your message data here -->
            <p>Hello, you have an unread message from our service. Please check your inbox for more details.</p>
        </div>
        <div class="button-container">
            <a href="swom.travel" class="button">Go to SWOM</a>
        </div>
        <div class="separator"></div>
        <div class="footer">
            <p>Thank you for using SWOM. If you have any questions or need assistance, please contact our support team.</p>
            <p>
                <strong>SWOM Support</strong><br>
                Email: support@swom.com<br>
                Phone: +1 (800) 123-4567
            </p>
            <p>Follow us on social media:</p>
            <p>
                <a href="https://www.facebook.com/swomtravel" target="_blank">Facebook</a> |
                <a href="https://www.twitter.com/swomtravel" target="_blank">Twitter</a> |
                <a href="https://www.instagram.com/swomtravel" target="_blank">Instagram</a>
            </p>
            <p>&copy; 2024 SWOM. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
