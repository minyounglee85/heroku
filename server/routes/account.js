import express from 'express';
import Account from '../models/account';

/*
mongooses : 새 모델을 만들때는 객체를 생성해주고 save 메소드를 통하여 값을 저장.
express session : req.session 을 사용해서 그냥 객체 다루듯이 사용.
*/

const router = express.Router();

/*
    회원 가입 API
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/
router.post('/signup', (req, res) => {
    // Username 형식 체크
    let usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // 길이 체크
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // Username 존재 여부 체크
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        // 계정 생성
        let account = new Account({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        // DB 저장
        account.save(err => {
            if (err) throw err;
            return res.json({ success: true });
        });

    });
});

/*
    로그인 API
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/signin', (req, res) => {

    if (typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // Username 검색
    Account.findOne({ username: req.body.username }, (err, account) => {
        if (err) throw err;

        // 계정 존재 여부 확인
        if (!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // 패스워드 확인
        if (!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // ALTER 세션
        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // 성공시 true 리턴
        return res.json({
            success: true
        });
    });
});

/*
세션확인 API
클라이언트에서 로그인 시 로그인 데이터를 쿠키에 담고 사용을 하고 있는다.
새로고침으로 다시 렌더링 하게 될 때 현재 쿠키가 유효한건지 체크.
GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', (req, res) => {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

/*
로그아웃 API
LOGOUT: POST /api/account/logout
*/
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
    }); //세션 파괴
    return res.json({ sucess: true });
});


/*
유저 검색 API
SEARCH USER: GET /api/account/search/:username
결과값: [{"username":"tester"},{"username":"testset"}]
*/
router.get('/search/:username', (req, res) => {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    Account.find({ username: { $regex: re } }, { _id: false, username: true })
        .limit(5) //username 으로 시작하는 유저네임 5개를 리스트.
        .sort({ username: 1 })
        .exec((err, accounts) => {
            if (err) throw err;
            res.json(accounts);
        });
});

// EMPTY SEARCH REQUEST: GET /api/account/search
router.get('/search', (req, res) => {
    res.json([]);
});

export default router;
