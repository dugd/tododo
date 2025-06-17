const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendTestEmail = async (toEmail) => {
    try {
        const res = await transport.sendMail({
            from: '"Tododo" <no-reply@tododo.com>',
            to: toEmail,
            subject: 'Hello world!',
            text: 'This is a test message sent via Mailtrap!',
            html: '<br>This is a test message sent via Mailtrap!</br>',
        });

        console.log(`message send: ${res.messageId}`);
    } catch (e) {
        console.error('Error sending email:', e);
    }
};

const sendActivateEmail = async (toEmail, token) => {
    try {
        const actionLink = `${process.env.ACTIVATION_URL}?token=${token}`;
        const res = await transport.sendMail({
            from: '"Tododo" <no-reply@tododo.com>',
            to: toEmail,
            subject: 'Activate your account on Tododo',
            text: `Welcome and thanks for signing up.:
            To activate your account, please use the following link: 
            ${actionLink}`,
            html: `Welcome and thanks for signing up.:
            To activate your account, please use the following link: 
            ${actionLink}`,
        });

        console.log(`message send: ${res.messageId}`);
    } catch (e) {
        console.error('Error sending email:', e);
    }
};

const sendResetPasswordEmail = async (toEmail, token) => {
    try {
        const actionLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
        const res = await transport.sendMail({
            from: '"Tododo" <no-reply@tododo.com>',
            to: toEmail,
            subject: 'Reset password request on Tododo',
            text: `If your would like to reset your password, please go this link:
            ${actionLink}`,
            html: `If your would like to reset your password, please go this link:
            ${actionLink}`,
        });

        console.log(`message send: ${res.messageId}`);
    } catch (e) {
        console.error('Error sending email:', e);
    }
};

module.exports = { sendTestEmail, sendActivateEmail, sendResetPasswordEmail };
