// ActionTypes 에서 export 한 모든 상수를 types 객체에 넣어서 불러온다.
import * as types from 'actions/ActionTypes';

import update from 'react-addons-update';


//페이지가 새로고침 되었을 때 세션이 유효한지 체크하고, 유효하다면 true, 만료되었거나 비정상적이면 false.
const initialState = {
    login: {
        status: 'INIT'
    },
    register: {
        status: 'INIT',
        error: -1
    },
    status: {
        valid: false,
        isLoggedIn: false,
        currentUser: ''
    }
};


export default function authentication(state, action) {
    if (typeof state === "undefined") {
        state = initialState;
    }

    switch (action.type) {
        /* LOGIN */
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING ' }
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: 'SUCCESS' }
                },
                status: {
                    isLoggedIn: { $set: true },
                    currentUser: { $set: action.username }
                }
            });
        case types.AUTH_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' }
                }
            });

            /* REGISTER */
        case types.AUTH_REGISTER:
            return update(state, {
                register: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case types.AUTH_REGISTER_SUCCESS:
            return update(state, {
                register: {
                    status: { $set: 'SUCCESS' },
                }
            });
        case types.AUTH_REGISTER_FAILURE:
            return update(state, {
                register: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });

            /* getinfo */
            //AUTH_GET_STATUS 는 쿠키에 세션이 저장 된 상태에서, 새로고침을 했을 때 만 실행
        case types.AUTH_GET_STATUS:
            return update(state, {
                status: {
                    isLoggedIn: { $set: true }
                }
            });
        case types.AUTH_GET_STATUS_SUCCESS:
            return update(state, {
                status: {
                    valid: { $set: true },
                    currentUser: { $set: action.username }
                }
            });
        case types.AUTH_GET_STATUS_FAILURE:
            return update(state, {
                status: {
                    valid: { $set: false },
                    isLoggedIn: { $set: false }
                }
            });

            /* logout */
        case types.AUTH_LOGOUT:
            return update(state, {
                status: {
                    isLoggedIn: { $set: false },
                    currentUser: { $set: '' }
                }
            });
        default:
            return state;
    }
}
