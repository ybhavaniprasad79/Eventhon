import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateToken = (id,role) => {
  return jwt.sign({ id ,role}, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password,role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = generateToken(user._id,role);
    
    res.status(201).json({ user: { name: user.name, email: user.email, role:user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id,user.role);

    res.cookie("accesstoken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });      

    res.status(200).json({ user: { name: user.name, email: user.email,role:user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
