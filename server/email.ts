import * as nodemailer from 'nodemailer';

// Gmail SMTP configuration
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

// Create reusable transporter object using Gmail SMTP
let transporter: nodemailer.Transporter | null = null;

if (gmailUser && gmailPass) {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  });
}

interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  if (!transporter) {
    console.error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.');
    return false;
  }

  try {
    const mailOptions = {
      from: `OAuth 3 Contact Form <${gmailUser}>`,
      to: 'support@oauth3.io',
      subject: `New Contact Form Submission from ${data.firstName} ${data.lastName}`,
      text: `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company || 'Not provided'}

Message:
${data.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #B454FF;">New Contact Form Submission</h2>
  
  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
  </div>
  
  <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #B454FF;">
    <h3 style="margin-top: 0;">Message:</h3>
    <p style="white-space: pre-wrap;">${data.message}</p>
  </div>
  
  <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
  <p style="font-size: 12px; color: #666;">This email was sent from the OAuth 3 contact form.</p>
</div>
      `,
      replyTo: data.email
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully to support@oauth3.io');
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}