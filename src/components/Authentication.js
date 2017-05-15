import React from 'react';
import { Link } from 'react-router';

/*
Authentication 컴포넌트에 mode 값을 주어서 true 일때는 Login, false 일떄는 Register 를 보여준다.
*/

class Authentication extends React.Component {

    //constructor 에서 this 바인딩 한 다음에 register 버튼 클릭 실행
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;

        //Login 컴포넌트의 handleLogin 에서 리턴한 true/false 값
        this.props.onLogin(id, pw).then(
            (success) => {
                if (!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onRegister(id, pw).then(
            (success) => {
                if (!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    //비밀번호 input에서 엔터를 눌렀을 때 로그인/회원가입 트리거
    handleKeyPress(e) {
        if (e.charCode === 13) {
            if (this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {

        //중복 코드 정리
        const inputBoxes = ( < div >
            < div className = "input-field col s12 username" >
            < label > Username < /label> < input name = "username"
            type = "text"
            className = "validate"
            value = { this.state.username }
            onChange = { this.handleChange }
            /> < /div> < div className = "input-field col s12" >
            < label > Password < /label> < input name = "password"
            type = "password"
            className = "validate"
            value = { this.state.password }
            onChange = { this.handleChange }
            onKeyPress = { this.handleKeyPress }
            /> < /div> < /div>
        );

        const loginView = ( < div >
            < div className = "card-content" >
            < div className = "row" > { inputBoxes } < a onClick = { this.handleLogin }
            className = "waves-effect waves-light btn" > LOGIN < /a> < /div> < /div>


            < div className = "footer" >
            < div className = "card-content" >
            < div className = "right" >
            New Here ? < Link to = "/register" > Create an account < /Link> < /div> < /div> < /div>

            < /div>
        );

        const registerView = ( < div className = "card-content" >
            < div className = "row" > { inputBoxes } < a onClick = { this.handleRegister }
            className = "waves-effect waves-light btn" > CREATE < /a> < /div> < /div>
        );

        return ( < div className = "container auth" >
            < Link className = "logo"
            to = "/" > Write Your Story < /Link> < div className = "card" >
            < div className = "header blue white-text center" >
            < div className = "card-content" > { this.props.mode ? "LOGIN" : "REGISTER" } < /div> < /div> { this.props.mode ? loginView : registerView } < /div> < /div>
        );
    }

}

Authentication.propTypes = {
    mode: React.PropTypes.bool,
    onLogin: React.PropTypes.func,
    onRegister: React.PropTypes.func
};

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("onLogin not defined"); },
    onRegister: (id, pw) => { console.error("onRegister not defined"); }
};

export default Authentication;
