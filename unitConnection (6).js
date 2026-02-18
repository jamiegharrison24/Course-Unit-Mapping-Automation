import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import User from "../models/UserSchema.js";

// Constants
const ACCESS_TOKEN_AGE = 15 * 60 * 1000;    // 15mins
const REFRESH_TOKEN_AGE = 60 * 60 * 1000;   // 1hr
// // For testing purposes
// // const DB_NAME = 'CUMA';
// // const DB_COLLECTION_NAME = 'users';
// const DB_NAME = 'CUMA_TEST';
// const DB_COLLECTION_NAME = 'users';

// Token access generation
export function generateAccessToken(email, role) {
    return jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(email, role) {
    return jwt.sign({ email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Cookie deletion
export function clearTokenCookies(res, isProduction) {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
    });
}

// Random token generation
export function generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Password encryption
export function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

// Password comparison
export function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

// Cookie creation
export function createAccessTokenCookie(res, cookieToken, isProduction) {
    res.cookie('accessToken', cookieToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: ACCESS_TOKEN_AGE
    });
}

export function createRefreshTokenCookie(res, cookieToken, isProduction) {
    res.cookie('refreshToken', cookieToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: REFRESH_TOKEN_AGE
    });
}

// Database operations
export async function fetchExistingUserFromDB(email) {
    return await User.findOne({ email });
}

export async function fetchExistingGoogleUserFromDB(userGoogleID) {
    return await User.findOne({ userGoogleId: userGoogleID });
}

export async function fetchExistingUserWithPwResetTokenFromDB(email, token) {
    return await User.findOne({ 
        email,
        'passwordReset.resetToken': token 
    });
}

export async function fetchExistingUserWithRefreshTokenFromDB(email, refreshToken) {
    return await User.findOne({ 
        email,
        'refreshToken.token': refreshToken 
    });
}

// Token processing
export async function processLoginAccessToken(res, user, isProduction) {
    const accessToken = generateAccessToken(user.email, user.role);
    const refreshToken = generateRefreshToken(user.email, user.role);
    
    user.lastLogin = new Date();
    user.refreshToken = { token: refreshToken, expiry: Date.now() + REFRESH_TOKEN_AGE };
    await user.save();

    createAccessTokenCookie(res, accessToken, isProduction);
    createRefreshTokenCookie(res, refreshToken, isProduction);
}

// Process Google login
export async function processGoogleLogin(res, user, userData, isProduction) {
    const refreshToken = generateRefreshToken(userData.email, user.role);

    if (!user) {
        user = new User({
            userGoogleId: userData.id,
            email: userData.email,
            emailVerified: userData.verified_email,
            emailHD: userData.hd,
            firstName: userData.given_name,
            lastName: userData.family_name,
            roles: ['general_user'],
            status: 'active',
            lastLogin: new Date(),
            refreshToken: { token: refreshToken, expiry: Date.now() + REFRESH_TOKEN_AGE }
        });
        await user.save();
    } else {
        user.lastLogin = new Date();
        user.refreshToken = { token: refreshToken, expiry: Date.now() + REFRESH_TOKEN_AGE };
        await user.save();
    }

    const accessToken = generateAccessToken(userData.email, user.role);

    createAccessTokenCookie(res, accessToken, isProduction);
    createRefreshTokenCookie(res, refreshToken, isProduction);
}

// Password reset
export async function processResetPasswordLink(user, serverPath) {
    const token = generateRandomToken();
    const expiration = Date.now() + 1 * 60 * 60 * 1000; // Token valid for 1 hour

    user.passwordReset = {
        resetToken: token,
        resetTokenExpiry: expiration
    };

    await user.save();

    const resetLink = `${serverPath}/reset-password?token=${token}&email=${user.email}`;
    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Reset your CUMA account password',
        text: `Hi ${user.firstName},\n\nWe got your request to reset your CUMA account password.\nClick the link to reset your password: ${resetLink}.\nYour password reset link is valid for 1 hour.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log("Error sending email: ", error);
        return false;
    }
}

// MFA
export async function setupMFA(user) {
    const secret = authenticator.generateSecret();
    user.mfaSecret = secret;
    await user.save();

    const otpauth = authenticator.keyuri(user.email, 'Cuma', secret);
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) {
                reject(err);
            } else {
                resolve({ secret, imageUrl });
            }
        });
    });
}


export function verifyMFA(token, secret) {
    return authenticator.verify({ token, secret });
}

// Send approval email
export const sendApprovalEmail = async (email, firstName, lastName, role) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'CUMA: Manual Verification Approved',
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for signing up to CUMA. After manually verifying your information, we are pleased to inform you that your application to join as a ${role} has been approved.</p>
        <p>You can now log in to your account and start using our services.</p>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Welcome to the CUMA community!</p>
        <p>Best regards,<br>The CUMA Team</p>
      `
    };

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Approval email sent to ${email}`);
    } catch (error) {
      console.error(`Error sending approval email to ${email}:`, error);
    }
  };

// Send rejection email
export const sendRejectionEmail = async (email, firstName, lastName, role) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'CUMA: Manual Verification Unsuccessful',
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for signing up to CUMA. After manually verifying your information, we regret to inform you that we are unable to approve your application to join as a ${role} at this time.</p>
        <p>If you believe this decision was made in error or if you have any questions, please don't hesitate to contact our support team for more information or clarification.</p>
        <p>We appreciate your interest in CUMA and thank you for your understanding.</p>
        <p>Best regards,<br>The CUMA Team</p>
      `
    };

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Rejection email sent to ${email}`);
    } catch (error) {
      console.error(`Error sending rejection email to ${email}:`, error);
    }
  };