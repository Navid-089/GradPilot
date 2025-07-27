package com.gradpilot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            System.out.println("Attempting to send password reset email to: " + toEmail);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("GradPilot - Password Reset Request");

            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            System.out.println("Reset URL: " + resetUrl);

            String emailContent = "Dear GradPilot User,\n\n"
                    + "We received a request to reset your password. If you made this request, please click the link below to reset your password:\n\n"
                    + resetUrl + "\n\n"
                    + "This link will expire in 1 hour for security reasons.\n\n"
                    + "If you didn't request a password reset, please ignore this email. Your password will remain unchanged.\n\n"
                    + "Best regards,\n"
                    + "The GradPilot Team\n\n"
                    + "Note: This is an automated email. Please do not reply to this message.";

            message.setText(emailContent);

            mailSender.send(message);
            System.out.println("Password reset email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to GradPilot!");

            String emailContent = "Dear " + userName + ",\n\n"
                    + "Welcome to GradPilot! We're excited to have you on board.\n\n"
                    + "GradPilot is your comprehensive platform for graduate school applications, offering:\n"
                    + "• University recommendations based on your profile\n"
                    + "• SOP (Statement of Purpose) review and assistance\n"
                    + "• Scholarship opportunities\n"
                    + "• Research guidance and more\n\n"
                    + "You can start exploring your dashboard at: " + frontendUrl + "/dashboard\n\n"
                    + "If you have any questions or need assistance, feel free to reach out to our support team.\n\n"
                    + "Best of luck with your graduate school journey!\n\n"
                    + "Best regards,\n"
                    + "The GradPilot Team";

            message.setText(emailContent);

            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't throw exception for welcome email
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    public void sendPasswordResetSuccessEmail(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("GradPilot - Password Reset Successful");

            String emailContent = "Dear GradPilot User,\n\n"
                    + "Your password has been successfully reset.\n\n"
                    + "If you didn't make this change, please contact our support team immediately.\n\n"
                    + "For your security, we recommend:\n"
                    + "• Using a strong, unique password\n"
                    + "• Not sharing your password with others\n"
                    + "• Logging out from shared devices\n\n"
                    + "You can now log in with your new password at: " + frontendUrl + "/login\n\n"
                    + "Best regards,\n"
                    + "The GradPilot Team";

            message.setText(emailContent);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset success email: " + e.getMessage());
        }
    }
}
