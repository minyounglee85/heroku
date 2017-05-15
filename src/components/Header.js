import React from 'react';
import { Link } from 'react-router';
import { Search } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends React.Component {

        constructor(props) {
            super(props);

            //true 면 검색창을 보여주고 false면 숨긴다.
            this.state = {
                search: false
            };

            this.toggleSearch = this.toggleSearch.bind(this);
        }

        //검색버튼이 onClick 되면 toggleSearch() 실행
        //search status 값을 true or false로 변경
        //Search 컴포넌트에 onClose props로 toggleSearch를 전달
        toggleSearch() {
            this.setState({
                search: !this.state.search
            });
        }

        render() {

            //로그인 여부에 따라 다른 버튼 노출.
            //a 가 아닌 link 사용. 새 로딩을 막고 라우트에 보여지는 내용만 변경.
            const loginButton = ( < li >
                < Link to = "/login" > < i className = "material-icons" > vpn_key < /i></Link >
                < /li>
            );

            //logoutButton 클릭 시 this.props.onLogout 함수를 실행
            const logoutButton = ( < li >
                < a onClick = { this.props.onLogout } > < i className = "material-icons" > lock_open < /i></a >
                < /li>
            );
            
            /*
            //헤더에서 로고 클릭하면 메인 페이지로 이동
            //src/containers/App.js handleSearch 메소드와 searchStatus 를 Header 컴포넌트로 전달 (onSearch, usernames)
            //onSearch 와 searchStatus 를 Search 컴포넌트로 전달 (onSearch, usernames)
            */
            
            return ( 
                <div>
                    <nav>
                        <div className = "nav-wrapper red darken-2">
                        <Link to = "/"className = "brand-logo center"> Write Your Story </Link>
                            <ul>
                                <li> 
                                <a onClick = { this.toggleSearch } > <i className = "material-icons" > search </i></a> 
                                </li> 
                            </ul>

                            <div className = "right" >
                                <ul > 
                                { this.props.isLoggedIn ? logoutButton : loginButton } 
                                </ul> 
                            </div> 
                        </div> 
                    </nav> 

                    <ReactCSSTransitionGroup transitionName = "search" transitionEnterTimeout = { 300 } transitionLeaveTimeout = { 300 }> 
                    { /* IMPLEMENT: SHOW SEARCH WHEN SEARCH STATUS IS TRUE */ } 
                    { this.state.search ? < Search onClose = { this.toggleSearch }
                    onSearch = { this.props.onSearch }
                    usernames = { this.props.usernames }
                    /> : undefined } 
                    </ReactCSSTransitionGroup> 
                </div>
                );
            }
        }

        //isLoggedn: 로그인 상태인지 아닌지 알려주는 값.
        //onLogout: 함수형 props 로서 로그아웃을 담당.

        Header.propTypes = {
            isLoggedIn: React.PropTypes.bool,
            onLogout: React.PropTypes.func,
            usernames: React.PropTypes.array
        };

        Header.defaultProps = {
            isLoggedIn: false,
            onLogout: () => { console.error("logout function not defined"); },
            usernames: []
        };

        export default Header;
