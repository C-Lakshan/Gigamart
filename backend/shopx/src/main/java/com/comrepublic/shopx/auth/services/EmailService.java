package com.comrepublic.shopx.auth.services;

import com.comrepublic.shopx.auth.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public String sendMail(User user) {
        String subject = "Verify your Email Address";
        String senderName = "GigaMart";

        // Construct the HTML email content.
        // Adjust the styling and layout as needed to match your desired design.
        String mailContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "  <meta charset='UTF-8'>"
                + "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "  <title>Email Verification</title>"
                + "  <style>"
                + "    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }"
                + "    .container { background-color: #ffffff; padding: 20px; margin: 30px auto; max-width: 600px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }"
                + "    .header { text-align: left; padding-bottom: 20px; }"
                + "    .content { font-size: 16px; line-height: 1.6; }"
                + "    .verification-code { display: inline-block; background-color: #e0e0e0; padding: 10px 20px; font-size: 20px; margin: 20px 0; border-radius: 4px; }"
                + "    .footer { margin-top: 30px; font-size: 14px; color: #777777; text-align: left; }"
                + "  </style>"
                + "</head>"
                + "<body>"
                + "  <div class='container'>"
                + "    <div class='header'>"
                + "      <h2>Email Verification</h2>"
                + "    </div>"
                + "    <div class='content'>"
                + "      <p>Hello " + user.getUsername() + ",</p>"
                + "      <p>Thank you for registering with us. Please use the following verification code to verify your email address:</p>"
                + "      <div class='verification-code'>" + user.getVerificationCode() + "</div>"
                + "      <p>If you didn't make this request, just ignore this email.</p>"
                + "    </div>"
                + "    <hr>"     
                + "    <div class='footer'>"
                + "      <p>Copyright &copy; 2025 Gigamart (Private) Limited. </p>"
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";

        try {
            // Create a MimeMessage
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            // Pass 'true' to the constructor to indicate you need a multipart message
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            // Set email parameters
            helper.setFrom(sender, senderName);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);

            // Set the HTML content; the second parameter 'true' indicates that the text is HTML.
            helper.setText(mailContent, true);

            // Send the email
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while sending email";
        }
        return "Email sent";
    }
}
