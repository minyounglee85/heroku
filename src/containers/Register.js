//Register 컴포넌트 Redux 연결

import React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';
import { browserHistory } from 'react-router';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
    }

    /*
    성공하고 login 페이지로 라우팅.
    회원가입 오류 종류 3가지. 배열 처리.
    */

    handleRegister(id, pw) {
        return this.props.registerRequest(id, pw).then(
            () => {
                if (this.props.status === "SUCCESS") {
                    Materialize.toast('Success! Please log in', 2000);
                    browserHistory.push('/login');
                    return true;
                } else {
                    /*
                       ERROR CODES:
                           1: BAD USERNAME
                           2: BAD PASSWORD
                           3: USERNAME EXISTS
                   */
                    let errorMessage = [
                        'Invalid Username',
                        'Password is too short',
                        'Username already exists'
                    ];

                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }
    render() {
        return ( < div >
            < Authentication mode = { false }
            onRegister = { this.handleRegister }
            /> < /div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.register.status,
        errorCode: state.authentication.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (id, pw) => {
            return dispatch(registerRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
