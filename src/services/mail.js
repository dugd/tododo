const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function generateTestMail() {
    return {
        subject: 'Hello world!',
        text: 'This is a test message sent via Mailtrap!',
        html: '<br>This is a test message sent via Mailtrap!</br>',
    };
}

function generateActivateMail(token) {
    const actionLink = `${process.env.ACTIVATION_URL}?token=${token}`;
    return {
        subject: 'Activate your account on Tododo',
        text: `Welcome and thanks for signing up.
            To activate your account, please use the following link: 
            ${actionLink}`,
        html: `Welcome and thanks for signing up.
            To activate your account, please use the following link: 
            ${actionLink}`,
    };
}

function generateResetPasswordMail(token) {
    const actionLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
    return {
        subject: 'Reset password request on Tododo',
        text: `If your would like to reset your password, please go this link:
        ${actionLink}`,
        html: `If your would like to reset your password, please go this link:
        ${actionLink}`,
    };
}

const sendMail = async (toEmail, sendData) => {
    try {
        const res = await transport.sendMail({
            from: '"Tododo" <no-reply@tododo.com>',
            to: toEmail,
            subject: sendData.subject,
            text: sendData.text,
            html: sendData.html,
        });

        console.log('Email sent:', res.messageId);
        return res.messageId;
    } catch (e) {
        console.error('Error sending email:', e.message);
        throw e;
    }
};

module.exports = {
    sendMail,
    generateTestMail,
    generateActivateMail,
    generateResetPasswordMail,
};
