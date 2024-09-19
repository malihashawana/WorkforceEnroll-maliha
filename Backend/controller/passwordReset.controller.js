

import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendResetLink = async (req, res) => {
  const { email } = req.body;


  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Generate a token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });


    // Create a reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;


    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
    });


    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset link', error });
  }
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email: decoded.email }, { password: hashedPassword });


    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};
