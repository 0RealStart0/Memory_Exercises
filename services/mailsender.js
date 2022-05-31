const nodemailer = require('nodemailer');
//const senderInfo = require('../config/senderInfo.json');
// 메일발송 객체
const mailSender = function (param) {

    // 전송하기
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com', // gmail server 사용
        port: 587,
        secure: false,
        auth: {
            user: process.env.GOOGLE_EMAIL,  // 보내는 메일의 주소
            pass: process.env.GOOGLE_PASSWORD,  // 보내는 메일의 비밀번호    
        }
    });

    // 보낼 메세지
    let message = {
        from: process.env.GOOGLE_MAIL, // 보내는 사람
        to: param.toEmail, // 수신할 이메일
        subject: param.subject, // 메일 제목
        html: param.html // 메일 내용
    };

    // 메일이 보내진 후의 콜백 함수
    transporter.sendMail(message, (err, data) => {
        if (err) throw err;
        else console.log(data);
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