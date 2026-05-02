import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer/index.js";
import { BadRequestException } from "../../exception/domain.exception.js";
import { configService } from "../../services/config.service.js";

export const sendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = []
}:Mail.Options):Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: configService.get('EMAIL_APP'),
      pass: configService.get('EMAIL_APP_PASSWORD'),
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  });

  if(!to && !bcc){
    throw new BadRequestException("invalid recipient")
  }

  if(!(html as string)?.length && attachments?.length){
    throw new BadRequestException("invalid mail content")
  }

  // Send an email using async/await
  try {
    console.log(`[EmailService] Sending email to: ${to}`);
    const info = await transporter.sendMail({
      from: `"Captain Amr Gym" <${configService.get('EMAIL_APP')}>`,
      to,
      cc,
      bcc,
      subject,
      html,
      attachments
    });
    console.log(`[EmailService] ✅ Sent: ${info.messageId}`);
  } catch (error) {
    console.error("[EmailService] ❌ Error:", error);
    throw new BadRequestException("Failed to send email");
  }
}