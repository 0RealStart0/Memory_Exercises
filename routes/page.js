const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user_info = await User.findOne({
            attributes: ['email', 'nick', 'createdAt'], //나중에 게시글 모음 등등 까지 포함 할것
            where: { id: req.user.id, auth_use: true, deletedAt: null }
        });
        res.render('profile', { title: '내 정보 - Memory Exercises',user_info });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - Memory Exercises' })
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', { title: '로그인 - Memory Exercises' })
});

router.get('/', (req, res, next) => {
    res.render('main', { title: 'Memory Exercises' });
});

router.get('/auth/join_auth', isNotLoggedIn, (req, res, next) => {
    // console.log(req.session);
    
    let {auth_email,msg} = req.session;
    if(auth_email || msg){
        delete req.session.auth_email;
        delete req.session.msg;
        // console.log(req.session);
        // console.log(auth_email,msg);
    }else{
        auth_email = req.query.auth_email;
    }
    // console.log(msg,auth_email,'get join_auth')
    res.render('join_auth', { title: '가입 인증 - Memory Exercises',msg,auth_email});
});

router.get('/auth/email_send', isNotLoggedIn, (req, res, next) => {
    res.render('email_send', { title: '인증번호 재발송 - Memory Exercises' })
});

router.get('/practice',(req,res,next)=>{
    res.render('practice_start',{ title: '연습 하기 - Memory Exercises'})
});
router.get('/board',(req,res,next)=>{
    res.render('board',{ title: '커뮤니티 - Memory Exercises'})
});

module.exports = router;