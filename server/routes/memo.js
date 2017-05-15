import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

/*
    작성 기능
    WRITE MEMO: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: EMPTY CONTENTS
*/
router.post('/', (req, res) => {
    // 로그인 여부 체크
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }

    // 콘텐츠 유무 체크
    if (typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    if (req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    // 새 메모 작성
    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents: req.body.contents
    });

    // DB에 저장
    memo.save(err => {
        if (err) throw err;
        return res.json({ success: true });
    });
});

/*
    수정기능
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENTS
        3: NOT LOGGED IN
        4: NO RESOURCE
        5: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {

    // 메모 ID 유효 체크
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // 콘텐츠 유효 체크
    if (typeof req.body.contents !== 'string') {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    if (req.body.contents === "") {
        return res.status(400).json({
            error: "EMPTY CONTENTS",
            code: 2
        });
    }

    // 로그인 상태 체크
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 3
        });
    }

    // 메모 찾기
    Memo.findById(req.params.id, (err, memo) => {
        if (err) throw err;

        // IF MEMO DOES NOT EXIST
        if (!memo) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 4
            });
        }

        // IF EXISTS, CHECK WRITER
        if (memo.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 5
            });
        }

        // MODIFY AND SAVE IN DATABASE
        memo.contents = req.body.contents;
        memo.date.edited = new Date();
        memo.is_edited = true;

        memo.save((err, memo) => {
            if (err) throw err;
            return res.json({
                success: true,
                memo
            });
        });

    });
});

/*
    삭제기능
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {

    // 메모 ID 유효 체크
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // 로그인 상태
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }

    // 메모 찾기 및 작성자 유효 체크
    Memo.findById(req.params.id, (err, memo) => {
        if (err) throw err;

        if (!memo) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }
        if (memo.writer != req.session.loginInfo.username) {
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }

        // 메모 삭제
        Memo.remove({ _id: req.params.id }, err => {
            if (err) throw err;
            res.json({ success: true });
        });
    });

});

/*
    읽기 기능
    READ MEMO: GET /api/memo
*/
router.get('/', (req, res) => {
    Memo.find()
        .sort({ "_id": -1 })
        .limit(6)
        .exec((err, memos) => {
            if (err) throw err;
            res.json(memos);
        });
});

/*
    READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    // 리스트 타입 유효 체크
    if (listType !== 'old' && listType !== 'new') {
        return res.status(400).json({
            error: "INVALID LISTTYPE",
            code: 1
        });
    }

    // 메모 ID 유효 체크
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 2
        });
    }

    let objId = new mongoose.Types.ObjectId(req.params.id);

    if (listType === 'new') {
        // 새 메모 가져오기
        Memo.find({ _id: { $gt: objId } })
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if (err) throw err;
                return res.json(memos);
            });
    } else {
        // 오래된 메모 가져오기
        Memo.find({ _id: { $lt: objId } })
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if (err) throw err;
                return res.json(memos);
            });
    }
});


/*
    별점 주기 API
    1. 주어진 :id 값을 가진 메모를 찾는다.
    2. 해당 메모의 starred 데이터 배열에 자신의 아이디가 존재하지 않는다면 자신의 아이디를 starred 데이터 배열에 추가.
    3. 이미 존재한다면 starred 데이터 배열에서 제거.

    TOGGLES STAR OF MEMO: POST /api/memo/star/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
*/
router.post('/star/:id', (req, res) => {
    // 메모 ID 유효 체크
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }

    // 로그인 상태 체크
    if (typeof req.session.loginInfo === 'undefined') {
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        });
    }

    // 메모 찾기
    Memo.findById(req.params.id, (err, memo) => {
        if (err) throw err;

        // 글이 존재하지 않는다면
        if (!memo) {
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 3
            });
        }

        // USERNAME을 Array에서 가져온다.
        //해당 글의 유저가 별점을 주었는지 아닌지 확인.
        //배열의 indexOf 메소드를 통하여 starred 데이터에 로그인유저의 username이 적혀있는지 확인.
        let index = memo.starred.indexOf(req.session.loginInfo.username);

        // 사용자가 이미 별점을 주었는지 아닌지 체크
        let hasStarred = (index === -1) ? false : true;

        if (!hasStarred) {
            // 존재하지 않는 다면
            memo.starred.push(req.session.loginInfo.username);
        } else {
            // 존재 한다면
            memo.starred.splice(index, 1);
        }

        // 메모 저장
        memo.save((err, memo) => {
            if (err) throw err;
            res.json({
                success: true,
                'has_starred': !hasStarred,
                memo,
            });
        });
    });
});

/*
    특정 유저의 글 불러 오기.
    READ MEMO OF A USER: GET /api/memo/:username
*/
router.get('/:username', (req, res) => {
    Memo.find({ writer: req.params.username })
        .sort({ "_id": -1 })
        .limit(6)
        .exec((err, memos) => {
            if (err) throw err;
            res.json(memos);
        });
});


/*
    메모 추가 로딩 API 구현
    READ ADDITIONAL (OLD/NEW) MEMO OF A USER: GET /api/memo/:username/:listType/:id
*/
router.get('/:username/:listType/:id', (req, res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    // 리스트 유효 타입 체크
    if (listType !== 'old' && listType !== 'new') {
        return res.status(400).json({
            error: "INVALID LISTTYPE",
            code: 1
        });
    }

    // 메모 ID 유효 체크
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 2
        });
    }

    let objId = new mongoose.Types.ObjectId(req.params.id);

    if (listType === 'new') {
        // 새 메모 가져오기
        Memo.find({ writer: req.params.username, _id: { $gt: objId } })
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if (err) throw err;
                return res.json(memos);
            });
    } else {
        // 옛날 메모 가져오기
        Memo.find({ writer: req.params.username, _id: { $lt: objId } })
            .sort({ _id: -1 })
            .limit(6)
            .exec((err, memos) => {
                if (err) throw err;
                return res.json(memos);
            });
    }
});

export default router;
