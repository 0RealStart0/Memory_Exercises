const nodemailer = require('nodemailer');
//const senderInfo = require('../config/senderInfo.json');
// 메일발송 객체
const mailSender = function (param) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',   // 메일 보내는 곳
        prot: 587,
        host: 'smtp.gmail.com',
        secure: false,  
        //   requireTLS: true ,
        auth: {
            user: process.env.MAIL_EMAIL,  // 보내는 메일의 주소
            pass: process.env.MAIL_PASSWORD,  // 보내는 메일의 비밀번호    
        }
    });
    // 메일 옵션
    let mailOptions = {
        from: process.env.MAIL_EMAIL, // 보내는 메일의 주소
        to: param.toEmail, // 수신할 이메일
        subject: param.subject, // 메일 제목
        html: param.html // 메일 내용
    };

    // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            param.next(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = mailSender;

// async function sendMail(email) {
//     try {
//         const mailConfig = {
//             service: 'Naver',
//             host: 'smtp.naver.com',
//             port: 587,
//             auth: {
//                 user: process.env.MAIL_EMAIL,
//                 pass: process.env.MAIL_PASSWORD
//             }
//         }
//         let message = {
//             from: process.env.MAIL_EMAIL,
//             to: email,
//             subject: '이메일 인증 요청 메일입니다.',
//             html: '<p> 여기에 인증번호나 token 검증 URL 붙이시면 됩니다! </p>'
//         }
//         let transporter = nodemailer.createTransport(mailConfig)
//         transporter.sendMail(message)
//     } catch (error) {
//         console.log(error)
//     }
// }