const crypto = require('crypto');
// console.log(crypto.randomBytes(3).toString('hex'));
// const Crypto = require()
// console.log(crypto.get);
console.log(crypto.randomInt(111111,999999));

// const nunjucks = require('nunjucks');
// nunjucks.render('test.html', { text: '테스트' }, (err, data) => {
//     console.log(data);
// });

// function test(){
//     nunjucks.render('./vies/mail_temp.html', { email: 'da@naver.com', code: '1234' }, (err, data) => {

//         console.log(err);
//         console.log('---------')
//         throw new Error(err);
//         //console.log(data);
//     });

// }
// // hnsxkuffjdclbkwj
// try {
//     test();
// } catch (e) {
//     console.log('얍')
//     console.log(e);
//     console.log('얍')
// }

const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');


// console.log('템플릿', temp);
// try {
//     // 전송하기
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host: 'smtp.gmail.com', // gmail server 사용
//         port: 587,
//         secure: false,
//         auth: {
//             user: , // 보내는 사람의 구글계정 메일 
//             pass: , // 보내는 사람의 구글계정 비밀번호 (또는 생성한 앱 비밀번호)
//         },
//     });
//     let temp;
//   await  nunjucks.render('./views/mail_temp.html', { email: 'k@naver.com', code: '1234' }, (err, data) => {
//         if (err) {
//             next(err);
//         }
//         temp = data;
//         console.log(data);
//     });

//     // 보낼 메세지
//     let message = {
//         from: process.env.GOOGLE_MAIL, // 보내는 사람
//         to: `, // 받는 사람 이름과 이메일 주소
//         subject: '테스트메일', // 메일 제목
//         html: temp,
//     };

//     // 메일이 보내진 후의 콜백 함수
//     transporter.sendMail(message, (err, data) => {
//         if (err) console.log(err);
//         else console.log(data);
//     });
// } catch (err) {
//     console.log(err);
// }
