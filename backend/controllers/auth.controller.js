const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        
        if (!existingUser) {
            return res.render('login', { error: "Incorrect username" });
        }
        
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.render('login', { error: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: existingUser._id, username: existingUser.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
        
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.redirect("/api/user");

    } catch (error) {
        console.error(error);
        res.render('login', { error: "An error occurred during login" });
    }
}

function logout(req, res) {
    res.clearCookie('token');
    res.redirect("/api/auth/login");
}

async function signup(req, res) {
    try {
        const { username, password, confirmPassword, email, isTeacher } = req.body;
        
        if (password.length <= 5) {
            return res.render('signup', { error: "Password should be at least 6 characters" });
        }

        if (confirmPassword !== password) {
            return res.render('signup', { error: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup', { error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            isTeacher: isTeacher === "true"
        });

        await newUser.save();
        res.redirect("/api/auth/login");

    } catch (error) {
        console.error(error);
        res.render('signup', { error: "An error occurred during signup" });
    }
}

async function forgotpassword(req, res) {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('forgotpassword', { error: "No user found with this username" });
        }

        // Generate the reset token
        const resetSecret = user._id + JWT_SECRET;
        const resetToken = jwt.sign({ id: user._id }, resetSecret, { expiresIn: "5m" });
        const resetLink = `http://localhost:8080/api/auth/reset/${user._id}/${resetToken}`;

        // Configure the nodemailer transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // use TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Hi ${user.username},</p>
                   <p>You requested to reset your password. Click the link below to reset it:</p>
                   <a href="${resetLink}">Reset Password</a>
                   <p>This link will expire in 5 minutes.</p>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.send(`A reset link has been sent to ${user.email}`);

    } catch (error) {
        console.error(error);
        res.render('forgotpassword', { error: "An error occurred during password reset" });
    }
}

async function resetpassword(req, res) {
    const { password, confirmpassword } = req.body;
    const { id, resettoken } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.render('resetpassword', { error: "Invalid user" });
        }

        const resetSecret = user._id + JWT_SECRET;
        jwt.verify(resettoken, resetSecret);

        if (!password || !confirmpassword) {
            return res.render('resetpassword', { error: "All fields are required" });
        }

        if (password !== confirmpassword) {
            return res.render('resetpassword', { error: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        console.log("updated");
        res.redirect("/api/auth/login");

    } catch (error) {
        console.error(error);
        res.render('resetpassword', { error: "Invalid or expired token" });
    }
}

module.exports = { signup, login, logout, forgotpassword, resetpassword };
