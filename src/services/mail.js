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

module.exports = { sendTestEmail };
