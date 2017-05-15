import {
    MEMO_POST,
    MEMO_POST_SUCCESS,
    MEMO_POST_FAILURE,
    MEMO_LIST,
    MEMO_LIST_SUCCESS,
    MEMO_LIST_FAILURE,
    MEMO_EDIT,
    MEMO_EDIT_SUCCESS,
    MEMO_EDIT_FAILURE,
    MEMO_REMOVE,
    MEMO_REMOVE_SUCCESS,
    MEMO_REMOVE_FAILURE,
    MEMO_STAR,
    MEMO_STAR_SUCCESS,
    MEMO_STAR_FAILURE
} from './ActionTypes';
import axios from 'axios';

//글 작성
export function memoPostRequest(contents) {
    return (dispatch) => {
        dispatch(memoPost());

        return axios.post('/api/memo/', { contents })
            .then((response) => {
                dispatch(memoPostSuccess());
            }).catch((error) => {
                dispatch(memoPostError(error.response.data.code));
            });
    };
}

export function memoPost() {
    return {
        type: MEMO_POST
    };
}

export function memoPostSuccess() {
    return {
        type: MEMO_POST_SUCCESS
    };
}

export function memoPostFailure(error) {
    return {
        type: MEMO_POST_FAILURE,
        error
    };
}

//글 리스트

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; memo id (one at the bottom or one at the top)
        - username:  OPTIONAL; find memos of following user
*/

//글 로딩할때 사용
export function memoListRequest(isInitial, listType, id, username) {
    return (dispatch) => {
        // to be implemented
        dispatch(memoList());

        let url = '/api/memo';

        //username이 주어진다면 요청 할 URL 을 다르게 설정.
        if (typeof username === "undefined") {
            // username 없으면 일반 메모 url 호출
            url = isInitial ? url : `${url}/${listType}/${id}`;
            // or url + '/' + listType + Z'/' +  id
        } else {
            // username 호출
            url = isInitial ? `${url}/${username}` : `${url}/${username}/${listType}/${id}`;
        }

        return axios.get(url)
            .then((response) => {
                dispatch(memoListSuccess(response.data, isInitial, listType));
            }).catch((error) => {
                dispatch(memoListFailure());
            });
    };
}
export function memoList() {
    return {
        type: MEMO_LIST
    };
}

export function memoListSuccess(data, isInitial, listType) {
    return {
        type: MEMO_LIST_SUCCESS,
        data,
        isInitial,
        listType
    };
}

export function memoListFailure() {
    return {
        type: MEMO_LIST_FAILURE
    };
}

//글 수정
//수정이 성공하면  수정된 메모 객체를 반환.
//전달받은 객체를 리스트에 있던 자리로 삽입.
export function memoEditRequest(id, index, contents) {
    return (dispatch) => {
        dispatch(memoEdit());

        return axios.put('/api/memo/' + id, { contents })
            .then((response) => {
                dispatch(memoEditSuccess(index, response.data.memo));
            }).catch((error) => {
                dispatch(memoEditFailure(error.response.data.code));
            });
    };
}

export function memoEdit() {
    return {
        type: MEMO_EDIT
    };
}

export function memoEditSuccess(index, memo) {
    return {
        type: MEMO_EDIT_SUCCESS,
        index,
        memo
    };
}

export function memoEditFailure(error) {
    return {
        type: MEMO_EDIT_FAILIURE,
        error
    };
}

//글 삭제
export function memoRemoveRequest(id, index) {
    return (dispatch) => {
        // TO BE IMPLEMENTED
        dispatch(memoRemove());

        return axios.delete('/api/memo/' + id)
            .then((response) => {
                dispatch(memoRemoveSuccess(index));
            }).catch((error) => {
                console.log(error);
                dispatch(memoRemoveFailure(error.response.data.code));
            });
    };
}

export function memoRemove() {
    return {
        type: MEMO_REMOVE
    };
}

export function memoRemoveSuccess(index) {
    return {
        type: MEMO_REMOVE_SUCCESS,
        index
    };
}

export function memoRemoveFailure(error) {
    return {
        type: MEMO_REMOVE_FAILURE,
        error
    };
}

//글 별점
export function memoStarRequest(id, index) {
    return (dispatch) => {
        dispatch(memoStar());

        return axios.post('/api/memo/star/' + id)
            .then((response) => {
                dispatch(memoStarSuccess(index, response.data.memo));
            }).catch((error) => {
                console.log(error);
                dispatch(memoStarFailure());
            });
    };
}

export function memoStar() {
    return {
        type: MEMO_STAR
    };
}

export function memoStarSuccess(index, memo) {
    return {
        type: MEMO_STAR_SUCCESS,
        index,
        memo
    };
}

export function memoStarFailure(error) {
    return {
        type: MEMO_STAR_FAILURE,
        error
    };
}
