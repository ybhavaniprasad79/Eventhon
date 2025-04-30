import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendMail from '../util/mail.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer'

const otpStore = new Map();
const generateToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in memory (expires in 10 minutes)
    otpStore.set(email, {
      otp,
      name,
      expiresAt: Date.now() + 3 * 60 * 1000,
    });

    // Send OTP to email
    try {
      await sendOTP(email, otp);
    } catch (e) {
      return res.status(500).json({ message: 'Failed to send OTP', error: e.message });
    }

    // Save user in DB
      await user.save();

      // After saving, set a timeout to delete if not activated
      setTimeout(async () => {
        try {
          const existingUser = await User.findOne({ email });
          if (existingUser && !existingUser.isActivated) {
            await User.deleteOne({ email });
            otpStore.delete(email); // <--- ADD THIS
            console.log(`Deleted unverified user and OTP: ${email}`);
          }
        } catch (err) {
          console.error(`Error deleting unverified user ${email}:`, err.message);
        }
      }, 3 * 60 * 1000);  //<--- 3Minutes
      
    
    
    return res.status(200).json({ success: true, message: 'OTP sent to your email' });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      message: 'Error registering user',
      error: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if(!user.isActivated){
      return res.status(404).json({ message: 'Please Signup' });
    }

    const token = generateToken(user._id, user.role, user.name, user.email);

    res.cookie('accesstoken', token, {
      httpOnly: true,
      secure: true,             //  true because Netlify is HTTPS
      sameSite: 'None',          //  allow cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
    res.status(200).json({ user: { name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

export const otpverify = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(404).json({ message: 'OTP is required' });
  }

  // Assuming the email is available on the session, local storage, or any other temporary storage.
  // This example assumes that email is being passed from the front-end with the OTP.
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: 'Email is required' });
  }

  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(404).json({ message: 'OTP expired or not requested' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return res.status(404).json({ message: 'OTP has expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(404).json({ message: 'Invalid OTP' });
  }

  otpStore.delete(email);
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Please start signup from beggining' });
  }

  await User.findByIdAndUpdate(user._id, { isActivated: true });

  res.status(200).json({ success: true, message: "Signup successful" });
};




async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ADMIN_NAME,
      pass: process.env.ADMIN_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Eventhon <${process.env.ADMIN_NAME}>`,
    to: email,
    subject: "Your OTP for Signup in Eventhon",
    text: `Your OTP is: ${otp}. It is valid for 3 minutes.`,
  });
}



export const googleAuthCallback = async (req, res) => {
  try {
    const { profile, user } = req.user;

    const { displayName, emails } = profile;
    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: 'Email is required for authentication' });
    }

    const email = emails[0].value;
    const name = displayName;

    // If for any reason the user isn’t saved yet (extra safety check)
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      existingUser = new User({
        name,
        email,
        password: null,
        role: [ 'Organizer','user'],
        isActivated: true,
      });
      await existingUser.save();
    }

    const token = generateToken(existingUser._id, existingUser.role, existingUser.name, existingUser.email);

    res.cookie('accesstoken', token, {
      httpOnly: true,
      secure: true,             //  true because Netlify is HTTPS
      sameSite: 'None',          //  allow cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
    res.redirect(`https://eventhon.netlify.app/google-success?token=${token}`);

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Failed to authenticate with Google", error: err.message });
  }
};

