import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/authentication';
import { browserHistory } from 'react-router';

//Login 컨테이너 컴포넌트를 Redux 에 연결
//로그인 요청을하는 loginRequest 와 로그인 요청 상태인 status 를 authentication 컴포넌트에 매핑.

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    //.then() 은, AJAX 요청이 끝난다음에 할 작업이다.
    //axios가 Promise 를 사용하기 떄문에 사용 가능.
    //Promise 는 JavaScript ES6 에 생긴 비동기 처리를 할 때 사용하는 기술.
    //맨앞 returnL handleLogin 메소드를 실행한 실행자에서 handleLogin.then() 방식으로 다음 할 작업을 설정.

    handleLogin(id, pw) {
        return this.props.loginRequest(id, pw).then(
            () => {
                if (this.props.status === "SUCCESS") {
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };

                    //로그인이 성공하면, 세션 데이터를 쿠키에 저장.
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('Welcome ' + id + '!', 2000);
                    browserHistory.push('/'); //browserHistory.push() 를 통하여 라우팅을 트리거.
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    Materialize.toast($toastContet, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return ( < div >
            < Authentication mode = { true }
            onLogin = { this.handleLogin }
            /> < /div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
