import nodemailer from 'nodemailer';
import config from '../../config/config.json';

type MailOptions = {
  email: string;
  origin: string;
  resetToken: string;
};

export const sendEmail = async ({ email, origin, resetToken }: MailOptions): Promise<void> => {
  try {
    const resetLink = `${origin}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: config.smtpConfig.host,
      port: config.smtpConfig.port,
      secure: config.smtpConfig.secure,
      auth: {
        user: config.smtpConfig.auth.user,
        pass: config.smtpConfig.auth.pass,
      },
    });

    const mailOptions = {
      from: config.smtpConfig.auth.user,
      to: email,
      subject: 'Reset Your Password',
      text: `
    Hello,
    
    We received a request to reset your password. Click the link below to reset your password:
    
    ${resetLink}
    
    Best regards,  
    The Support Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <p>We received a request to reset your password. Click the link below to proceed:</p>
          <p>
            <a href="${resetLink}" target="_blank" style="background-color: #0056b3;
             color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p style="color: #555; font-size: 12px;">
          Note: This link is valid for a limited time. Do not share it with anyone.</p>
          <p>Best regards,<br>The Support Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email.');
  }
};
