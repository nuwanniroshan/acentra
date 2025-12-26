import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { EmailService } from "@/service/EmailService";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcryptjs";

export class ResetPasswordController {
  
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: "If your email is registered, you will receive a reset link." });
    }

    // Generate token
    const token = uuidv4();
    user.reset_token = token;
    user.reset_token_expires = new Date(Date.now() + 3600000); // 1 hour expiration

    await userRepository.save(user);

    // Send email
    await EmailService.sendPasswordResetEmail(user.email, token);

    return res.json({ success: true, message: "If your email is registered, you will receive a reset link." });
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { reset_token: token } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    if (user.reset_token_expires < new Date()) {
        return res.status(400).json({ success: false, message: "Token has expired" });
    }

    // Hash new password
    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.reset_token = null; // Clear token
    user.reset_token_expires = null;

    await userRepository.save(user);

    return res.json({ success: true, message: "Password reset successfully" });
  }
}
