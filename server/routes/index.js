import express from 'express';
import account from './account';
import memo from './memo';

/*
/api/memo -> GET, POST, PUT, DELETE 메소드로 요청 가능
*/

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});

router.use('/account', account);
router.use('/memo', memo);

export default router;
