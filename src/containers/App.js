//라우터의 각 페이지들이 렌더링 될 자리를 만든다.
//App 컨테이너 컴포넌트 Redux 연결

import React from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication';
import { searchRequest } from 'actions/search';

//App 컨테이너 컴포넌트 세션 확인 기능 구현
class App extends React.Component {

        constructor(props) {
            super(props);
            this.handleLogout = this.handleLogout.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
        }

        //로그아웃 요청을 하고, 로그인데이터를 초기화하여 쿠키에 적용
        //메소드를 Header 컴포넌트의 onLogout props 로 전달.
        handleLogout() {
            this.props.logoutRequest().then(
                () => {
                    Materialize.toast('Good Bye!', 2000);

                    // EMPTIES THE SESSION
                    let loginData = {
                        isLoggedIn: false,
                        username: ''
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                }
            );
        }

        handleSearch(keyword) {
            this.props.searchRequest(keyword);
        }

        componentDidMount() {
            // get cookie by name
            function getCookie(name) {
                var value = "; " + document.cookie;
                var parts = value.split("; " + name + "=");
                if (parts.length == 2) return parts.pop().split(";").shift();
            }

            // 쿠키로 부터 loginDta를 가져온다.
            let loginData = getCookie('key');

            // loginData가 undefiend 상태면 아무것도 하지 않는다.
            if (typeof loginData === "undefined") return;

            // decode base64 & parse json
            loginData = JSON.parse(atob(loginData));

            // 로그인 상태가 아니면 아무것도 안함.
            if (!loginData.isLoggedIn) return;

            // page refreshed & has a session in cookie,
            // check whether this cookie is valid or not
            this.props.getStatusRequest().then(
                () => {
                    if (!this.props.status.valid) {
                        // if session is not valid
                        // 로그아웃 세션
                        loginData = {
                            isLoggedIn: false,
                            username: ''
                        };

                        document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                        // 알림 노출
                        let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                        Materialize.toast($toastContent, 4000); //CSS 알림 기능
                    }
                }
            );

        }

        render() {
            let re = /(login|register)/;
            let isAuth = re.test(this.props.location.pathname);

            return ( < div > {
                    isAuth ? undefined : < Header isLoggedIn = { this.props.status.isLoggedIn }
                    onLogout = { this.handleLogout }
                    onSearch = { this.handleSearch }
                    usernames = { this.props.searchResults }
                    /> } { this.props.children } < /div >
                );

            }
        }

        const mapStateToProps = (state) => {
            return {
                status: state.authentication.status,
                searchResults: state.search.usernames
            };
        };

        const mapDispatchToProps = (dispatch) => {
            return {
                getStatusRequest: () => {
                    return dispatch(getStatusRequest());
                },
                logoutRequest: () => {
                    return dispatch(logoutRequest());
                },
                searchRequest: (keyword) => {
                    return dispatch(searchRequest(keyword));
                }
            };
        };

        export default connect(mapStateToProps, mapDispatchToProps)(App);
