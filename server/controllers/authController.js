const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user.id);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

// Get user details
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpire'] }
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await user.update({ resetToken: hashedToken, resetTokenExpire: tokenExpire });

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `<p>Reset your password <a href="${resetURL}">here</a>. Link valid for 5 minutes.</p>`;

        await sendEmail(user.email, 'Password Reset', message);
        res.json({ message: 'Reset link sent to your email' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            where: {
                resetToken: hashedToken,
                resetTokenExpire: { [require('sequelize').Op.gt]: new Date() }
            }
        });

        if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

        const hashedPassword = await bcrypt.hash(password, 12);
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpire: null });

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};
