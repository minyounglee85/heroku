import {
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT
} from './ActionTypes';
import axios from 'axios';

/*
axios는 직접 AJAX 요청을 할 때 사용 하는 HTTP Client 
React는 뷰만 담당하는 라이브러리이기 때문에, 서버와의 통신을 하려면 써드 파티 라이브러리를 사용.
*/

/*
thunk 는 특정 작업의 처리를 미루기위해서 함수로 wrapping 하는것을 의미
예)
let foo = () => 1 + 2;' 
x = foo(); // 여기서 계산이 실행.
*/

/* ====== AUTH ====== */

//로그인
//loginRequest 는 dispatch 를 파라미터로 갖는 thunk 를 리턴.
export function loginRequest(username, password) {
    return (dispatch) => {
        dispatch(login());

        return axios.post('/api/account/signin', { username, password })
            .then((response) => {
                dispatch(loginSuccess(username));
            }).catch((error) => {
                dispatch(loginFailure());
            });
    };
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function loginSuccess(username) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

//가입
export function registerRequest(username, password) {
    return (dispatch) => {
        // inform register API is starting
        dispatch(register());

        return axios.post('/api/account/signup', { username, password })
            .then((reponse) => {
                dispatch(registerSuccess());
            }).catch((error) => {
                dispatch(registerFailure(error.response.data.code));
            });
    };
}

export function register() {
    return {
        type: AUTH_REGISTER
    };
}

export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS
    };
}

export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

//상태 정보 가져오기
export function getStatusRequest() {
    return (dispatch) => {
        dispatch(getStatus());
        return axios.get('/api/account/getinfo')
            .then((response) => {
                dispatch(getStatusSuccess(response.data.info.username));
            }).catch((error) => {
                dispatch(getStatusFailure());
            });
    };
}

export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}

export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}

export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}


//로그 아웃
//로그아웃 요청을 하고, 성공하면 logout 액션을 dispatch.
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
            .then((response) => {
                dispatch(logout());
            });
    };
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
