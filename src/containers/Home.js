import React from 'react';
import { connect } from 'react-redux';
import { Write, MemoList } from 'components';
import {
    memoPostRequest,
    memoListRequest,
    memoEditRequest,
    memoRemoveRequest,
    memoStarRequest
} from 'actions/memo';

//Home 컨테이너 컴포넌트에서 Redux 연결
class Home extends React.Component {

        constructor(props) {
            super(props);
            this.handlePost = this.handlePost.bind(this);
            this.handleEdit = this.handleEdit.bind(this);
            this.handleRemove = this.handleRemove.bind(this);
            this.handleStar = this.handleStar.bind(this);
            this.loadNewMemo = this.loadNewMemo.bind(this);
            this.loadOldMemo = this.loadOldMemo.bind(this);
            this.state = {
                loadingState: false,
                initiallyLoaded: false //true 일때만 해당 메시지가 노출.
            };
        }

        componentDidMount() {
            // 새 글을 30초 간격으로 로딩
            const loadMemoLoop = () => {
                this.loadNewMemo().then(
                    () => {
                        this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 30000);
                    }
                );
            };

            const loadUntilScrollable = () => {
                // 스크롤바 없으면
                if ($("body").height() < $(window).height()) {
                    this.loadOldMemo().then(
                        () => {
                            // 마지막 페이지까지 반복 실행
                            if (!this.props.isLast) {
                                loadUntilScrollable();
                            }
                        }
                    );
                }
            };


            this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
                () => {
                    setTimeout(loadUntilScrollable, 1000);
                    loadMemoLoop();
                    this.setState({
                        initiallyLoaded: true
                    });
                }
            );

            //무한스크롤
            //스크롤바의 위치를 계산해서 스크롤바가 아랫부분에 닿으면 내용울 추가.
            $(window).scroll(() => {
                // UNDER SCROLLBOTTOM 높이가 250 이하 이면(구간에 들어오면 실행)
                if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                    if (!this.state.loadingState) {
                        this.loadOldMemo();
                        this.setState({
                            loadingState: true
                        });
                    }
                } else {
                    if (this.state.loadingState) {
                        this.setState({
                            loadingState: false
                        });
                    }
                }
            });
        }

        componentWillUnmount() {
            // 글 로드 멈춤
            clearTimeout(this.memoLoaderTimeoutId);

            // 윈도우 스크롤 리스너 제거
            $(window).unbind();

            this.setState({
                initiallyLoaded: false
            });
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.props.username !== prevProps.username) {
                this.componentWillUnmount();
                this.componentDidMount();
            }
        }

        //username 값은 Wall 컴포넌트에서 props로 전달.
        //username 값이 없으면 일반 로딩을 진행.

        //새 글 로드하는 메소드
        loadNewMemo() {
            // 메모 요청 상태가 WAITING일 때는 로딩 금지.
            if (this.props.listStatus === 'WAITING') {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }

            // 페이지가 비어 있으면 초기 로딩
            if (this.props.memoData.length === 0)
                return this.props.memoListRequest(true);
            return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id, this.props.username);
        }

        loadOldMemo() {
            // 유저가 마지막 페이지를 읽으면 취소
            if (this.props.isLast) {
                return new Promise(
                    (resolve, reject) => {
                        resolve();
                    }
                );
            }

            // GET ID OF THE MEMO AT THE BOTTOM
            let lastId = this.props.memoData[this.props.memoData.length - 1]._id;

            // 요청 시작
            return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
                // 마지막 페이지면 알림 노출
                if (this.props.isLast) {
                    Materialize.toast('You are reading the last page', 2000);
                }
            });
        }

        //메모가 작성되고 나면, 새 메모를 불러온다.
        //로그인 상태가 아니라면 알림을 띄우고 2초뒤 새로고침.
        //handlePost 를 onPost 로 Write 컴포넌트에 전한다.
        handlePost(contents) {
            return this.props.memoPostRequest(contents).then(
                () => {
                    if (this.props.postStatus.status === "SUCCESS") {
                        // TRIGGER LOAD NEW MEMO
                        // TO BE IMPLEMENTED
                        this.loadNewMemo().then(
                            () => {
                                Materialize.toast("Success!", 2000);
                            }
                        );
                    } else {
                        /*
                            ERROR CODES
                                1: NOT LOGGED IN
                                2: EMPTY CONTENTS
                        */

                        let $toastContent;
                        switch (this.props.postStatus.error) {
                            case 1:
                                // 로그인 상태가 아니라면 알림 노출 하고 리프레시
                                $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
                                Materialize.toast($toastContent, 2000);
                                setTimeout(() => { location.reload(false); }, 2000);
                                break;
                            case 2:
                                $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
                                Materialize.toast($toastContent, 2000);
                                break;
                            default:
                                $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                                Materialize.toast($toastContent, 2000);
                                break;
                        }
                    }
                }
            );
        }

        handleEdit(id, index, contents) {
            return this.props.memoEditRequest(id, index, contents).then(() => {
                if (this.props.editStatus.status === 'SUCCESS') {
                    Materialize.toast('Success!', 2000);
                } else {
                    /*
                           ERROR CODES
                               1: INVALID ID,
                               2: EMPTY CONTENTS
                               3: NOT LOGGED IN
                               4: NO RESOURCE
                               5: PERMISSION FAILURE
                    */
                    let errorMessage = [
                        'Something broke',
                        'Please write soemthing',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    let error = this.props.editStatus.error;

                    // 에러 알림 노출
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);

                    // 로그인 상태 아니라면 2초 후 페이지 리프레시
                    if (error === 3) {
                        setTimeout(() => { location.reload(false); }, 2000);
                    }


                }
            });
        }

        handleRemove(id, index) {
            this.props.memoRemoveRequest(id, index).then(
                () => {
                    if (this.props.removeStatus.status === "SUCCESS") {
                        setTimeout(() => {
                            if ($("body").height() < $(window).height()) {
                                this.loadOldMemo();
                            }
                        }, 1000);
                    } else {
                        /*
                        DELETE MEMO: DELETE /api/memo/:id
                        ERROR CODES
                            1: INVALID ID
                            2: NOT LOGGED IN
                            3: NO RESOURCE
                            4: PERMISSION FAILURE
                        */
                        let errorMessage = [
                            'Something broke',
                            'You are not logged in',
                            'That memo does not exist',
                            'You do not have permission'
                        ];

                        // 에러 알림 노출
                        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
                        Materialize.toast($toastContent, 2000);

                        // 로그인 상태 아니면 페이지 리프레시
                        if (this.props.removeStatus.error === 2) {
                            setTimeout(() => { location.reload(false); }, 2000);
                        }
                    }
                }
            );
        }

        handleStar(id, index) {
            this.props.memoStarRequest(id, index).then(
                () => {
                    if (this.props.starStatus.status !== "SUCCESS") {
                        /*
                            TOGGLES STAR OF MEMO: POST /api/memo/star/:id
                            ERROR CODES
                                1: INVALID ID
                                2: NOT LOGGED IN
                                3: NO RESOURCE
                        */
                        let errorMessage = [
                            'Something broke',
                            'You are not logged in',
                            'That memo does not exist'
                        ];

                        // 에러 알림 노출
                        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.starStatus.error - 1] + '</span>');
                        Materialize.toast($toastContent, 2000);

                        // 로그인 상태 아니면 페이지 리프레시
                        if (this.props.starStatus.error === 2) {
                            setTimeout(() => { location.reload(false); }, 2000);
                        }
                    }
                }
            );
        }

        render() {
                const write = ( < Write onPost = { this.handlePost }
                    />);

                    const emptyView = ( < div className = "container" >
                        < div className = "empty-page" >
                        < b > { this.props.username } < /b> isn't registered or hasn't written any memo < /div> < /div>
                    );

                    const wallHeader = ( < div >
                        < div className = "container wall-info" >
                        < div className = "card wall-info blue lighten-2 white-text" >
                        < div className = "card-content" > { this.props.username } < /div> < /div> < /div> { this.state.initallyLoaded && this.props.memoData.length === 0 ? emptyView : undefined } < /div>
                    );

                    //Home 컨테이너 컴포넌트에 wrapper 스타일 클래스 적용
                    //Home 컨테이너 컴포넌트 서버에서 받은 결과값 MemoList 로 전달
                    return ( < div className = "wrapper" > { typeof this.props.username !== 'undefined' ? wallHeader : undefined } {
                            this.props.isLoggedIn ? < Write onPost = { this.handlePost }
                            /> : undefined} < MemoList data = { this.props.memoData }
                            currentUser = { this.props.currentUser }
                            onEdit = { this.handleEdit }
                            onRemove = { this.handleRemove }
                            onStar = { this.handleStar }
                            /> < /div>
                        );
                    }
                }

                Home.PropTypes = {
                    username: React.PropTypes.string
                };

                Home.defaultProps = {
                    username: undefined
                };

                //state.memo.list.isLast 연결 (마지막 페이지에서 요청 취소)
                const mapStateToProps = (state) => {
                    return {
                        isLoggedIn: state.authentication.status.isLoggedIn,
                        postStatus: state.memo.post,
                        currentUser: state.authentication.status.currentUser,
                        memoData: state.memo.list.data,
                        listStatus: state.memo.list.status,
                        isLast: state.memo.list.isLast,
                        editStatus: state.memo.edit,
                        removeStatus: state.memo.remove,
                        starStatus: state.memo.star
                    };
                };

                const mapDispatchToProps = (dispatch) => {
                    return {
                        memoPostRequest: (contents) => {
                            return dispatch(memoPostRequest(contents));
                        },
                        memoListRequest: (isInitial, listType, id, username) => {
                            return dispatch(memoListRequest(isInitial, listType, id, username));
                        },
                        memoEditRequest: (id, index, contents) => {
                            return dispatch(memoEditRequest(id, index, contents));
                        },
                        memoRemoveRequest: (id, index) => {
                            return dispatch(memoRemoveRequest(id, index));
                        },
                        memoStarRequest: (id, index) => {
                            return dispatch(memoStarRequest(id, index));
                        }
                    };
                };

                //postStatus 와 memoPostRequest 가 매핑
                export default connect(mapStateToProps, mapDispatchToProps)(Home);
