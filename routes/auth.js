const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const mailSender = require('../services/mailsender');
const User = require('../models/user');
const nunjucks = require('nunjucks');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    // console.log(req.body);
    // console.log(email,nick,password);
    try {
        const { email, nick, password } = req.body;
        const exUser = await User.findOne({ where: { email } });
        console.log(exUser,'검색된 exUser');
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        // const authCode = crypto.randomBytes(2).toString('hex');
        const auth_code = crypto.randomInt(100000, 999999);

        // 삭제된 날짜 비교해서 일정 기간 이후에 가입되는 기능 추가할것 
        await User.destroy({
            where : {email},
            force : true,
        })
        //
        
        await User.create({
            email,
            nick,
            password: hash,
            auth_code,
            auth_use: false,
        });
        let temp = await nunjucks.render('../views/mail_temp.html', { email, code: auth_code });
        const param = {
            toEmail: email,
            subject: '가입 인증 번호 입니다.',
            html: temp,
        }
        mailSender(param);
        console.log(auth_code);
        // const msg = encodeURIComponent('인증번호가 이메일로 전송 되었습니다.');
        req.session.msg = '인증번호가 이메일로 전송 되었습니다.';
        req.session.auth_email = email;
        // return res.redirect(`/auth/join_auth?auth_email=${encodeURIComponent(email)}&msg=${msg}`);
        return res.redirect(`/auth/join_auth`);
        // return res.render('join_auth', { title: '가입 인증 - Memory Exercises', auth_email: email,msg:'인증번호가 이메일로 전송 되었습니다' });

    } catch (error) {
        console.error(error);
        next(error);
    }
    // return res.redirect('/join_auth',{auth_email:email});
});

router.post('/join_auth', isNotLoggedIn, async (req, res, next) => {
    try {
        const { auth_email, auth_code } = req.body;
        console.log(auth_email, auth_code);
        const exUser = await User.findOne({
            attributes: ['auth_code'],
            where: {
                email: auth_email,
                auth_use: false,
            }
        });
        console.log(exUser, "exUser");
        if (!exUser) {
            return res.status(403).send('이미 인증완료 되었거나 가입되지 않은 이메일 입니다.');
        }
        console.log(auth_code, exUser.auth_code);

        if (auth_code == exUser.auth_code) {
            await User.update({
                auth_use: true,
            }, {
                where: {
                    email: auth_email,
                    auth_code,
                },
            });
            // const msg = encodeURIComponent('가입완료');
            return res.send('회원가입이 완료 되었습니다.');
        } else {
            return res.status(403).send('인증 번호가 틀렸습니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/email_send', isNotLoggedIn, async (req, res, next) => {
    try {
        const { auth_email } = req.body;
        const exUser = await User.findOne({
            attributes: ['auth_code'],
            where: {
                email: auth_email,
                auth_use: false,
            }
        });
        console.log(exUser, "exUser");
        if (!exUser) {
            return res.status(403).send('이미 인증완료 되었거나 가입되지 않은 이메일 입니다.');
        }
        const auth_code = crypto.randomInt(100000, 999999);
        const result = await User.update({ auth_code },
            { where: { email: auth_email } }
        );
        console.log(result);
        let temp = await nunjucks.render('../views/mail_temp.html', { email: auth_email, code: auth_code });
        const param = {
            toEmail: auth_email,
            subject: '가입 인증 번호 입니다.',
            html: temp,
        }
        mailSender(param);
        console.log(param, auth_code);

        return res.send('인증번호가 이메일로 전송 되었습니다.');
        //이메일 보냈다는 메세지 보여주고 나머지 완성 가입 페이지에서도 메세지 추가해야 할듯

    } catch (error) {
        console.error(error);
        next(error);
    }

});

router.post('/change_nick', isLoggedIn, async (req, res, next) => {
    try {
        const { nick } = req.body;
        const result = await User.update({
            nick,
        }, {
            where: {
                id: req.user.id,
            },
        });
        //nick그대로면 변경 x?
        console.log(result, '닉변결과');
        return res.send('변경완료');
    } catch (error) {
        console.error(error);
        next(error);
    }

});

router.post('/change_pw', isLoggedIn, async (req, res, next) => {
    try {
        const { current_pw, new_pw } = req.body;
        console.log(req.user, '유저');
        console.log(current_pw, new_pw);
        const exUser = await User.findOne({ where: { id: req.user.id } });
        // if (exUser) {
        const result = await bcrypt.compare(current_pw, exUser.password);
        // console.log(result,'비밀번호 비교 결과'); result 는 true 의 형태로 나옴
        if (result) {
            const hash = await bcrypt.hash(new_pw, 12);
            await User.update({
                password: hash,
            }, {
                where: {
                    id: req.user.id,
                },
            });
            return res.send('비밀번호 변경 완료');
            // done(null, exUser);
        } else {
            return res.status(403).send('비밀번호가 일치하지 않습니다.');
        }
        // } else {
        // done(null, false, { message: '가입되지 않은 회원입니다.' });
        // }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/withdraw', isLoggedIn, async (req, res, next) => {
    try {
        const { password } = req.body;
        // console.log(password);
        const exUser = await User.findOne({ where: { id: req.user.id } });
        const result = await bcrypt.compare(password, exUser.password);
        if(result){
            // const rs = await User.destroy({ where: { id: req.user.id } });
            const rs = await exUser.destroy();
            console.log(rs,'탈퇴 결과');
            return res.send('탈퇴 완료');
        }else{
            return res.status(403).send('비밀번호가 일치하지 않습니다.');
        }
    } catch (error) {

    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/login?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;