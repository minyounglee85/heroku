import React from 'react';

//“1 second ago” 형식으로 글 작성 시간을 알려주는 컴포넌트
import TimeAgo from 'react-timeago';
import { Link } from 'react-router';

class Memo extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                editMode: false,
                value: props.data.contents
            };
            this.toggleEdit = this.toggleEdit.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.handleRemove = this.handleRemove.bind(this);
            this.handleStar = this.handleStar.bind(this);
        }

        componentDidMount() {
            // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
            // (TRIGGERED WHEN REFRESHED)
            $('#dropdown-button-' + this.props.data._id).dropdown({
                belowOrigin: true // Displays dropdown below the button
            });
        }

        //새 메모가 추가 될 때 새로운 메모들만 render 메소드가 실행.
        shouldComponentUpdate(nextProps, nextState) {
            let current = {
                props: this.props,
                state: this.state
            };

            let next = {
                props: nextProps,
                state: nextState
            };

            let update = JSON.stringify(current) !== JSON.stringify(next);
            return update;
        }

        componentDidUpdate(prevProps, prveState) {
            // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
            // (TRIGGERED WHEN LOGGED IN)
            $('#dropdown-button-' + this.props.data._id).dropdown({
                belowOrigin: true // Displays dropdown below the button
            });

            if (this.state.editMode) {
                // Trigger key up event to the edit input so that it auto-resizes (Materializecss Feature)
                $(this.input).keyup();
            }
        }

        toggleEdit() {
            if (this.state.editMode) {
                let id = this.props.data._id;
                let index = this.props.index;
                let contents = this.state.value;

                this.props.onEdit(id, index, contents).then(() => {
                    this.setState({
                        editMode: !this.state.editMode
                    });
                });
            } else {
                this.setState({
                    editMode: !this.state.editMode
                });
            }

        }

        //textarea의 값을 컴포넌트에 state 에서 불러온다.
        //수정될때마다 state 변경.
        handleChange(e) {
            this.setState({
                value: e.target.value
            });
        }

        handleRemove() {
            const id = this.props.data._id;
            const index = this.props.index;

            this.props.onRemove(id, index);
        }

        handleStar() {
            const id = this.props.data._id;
            const index = this.props.index;

            this.props.onStar(id, index);
        }

        //${expressioin} ES6의 Template Literals 문법
        //문자열 템플릿 안에 변수/상수 값을 쉽게 넣을 수 있다.
        render() {
            var { data, ownership } = this.props; //비구조화 할당.

            //Dropdown 메뉴는 자신의 메모일때만 보여주게하고 (ownership 이 true일때)
            //Dropdown 메뉴 활성화 작업을 componentDidMount와 componentDidUpdate에서 한다.
            const dropDownMenu = ( < div className = "option-button" >
                < a className = 'dropdown-button'
                id = { `dropdown-button-${data._id}` }
                data - activates = { `dropdown-${data._id}` } >
                < i className = "material-icons icon-button" > more_vert < /i> < /a > < ul id = { `dropdown-${data._id}` }
                className = 'dropdown-content' >
                < li > < a onClick = { this.toggleEdit } > Edit < /a></li >
                < li > < a onClick = { this.handleRemove } > Remove < /a></li >
                < /ul> < /div >
            );

            // EDITED info
            const editedInfo = ( < span style = {
                    { color: '#AAB5BC' }
                } > ·Edited < TimeAgo date = { this.props.data.date.edited }
                live = { true }
                /></span >
            );

            const starStyle = (this.props.data.starred.indexOf(this.props.currentUser) > -1) ? { color: '#ff9980' } : {};

            //memoView 상수에 담고, 렌더링할때 memoView 를 렌더링
            //Edit 모드일때 Write 와 비슷한 뷰를 보여 줄것이기 때문.
            const memoView = ( < div className = "card" >
                < div className = "info" >
                < Link to = { `/wall/${this.props.data.writer}` }
                className = "username" > { data.writer } < /Link> wrote a log · <TimeAgo date={data.date.created}/ > { this.props.data.is_edited ? editedInfo : undefined } { ownership ? dropDownMenu : undefined } < /div> < div className = "card-content" > { data.contents } < /div > < div className = "footer" >
                < i className = "material-icons log-footer-icon star icon-button"
                style = { starStyle }
                onClick = { this.handleStar } > star < /i> < span className = "star-count" > { data.starred.length } < /span > < /div> < /div >
            );

            const editView = ( < div className = "write" >
                < div className = "card" >
                < div className = "card-content" >
                < textarea ref = { ref => { this.input = ref; } }
                className = "materialize-textarea"
                value = { this.state.value }
                onChange = { this.handleChange } > < /textarea> < /div > < div className = "card-action" >
                < a onClick = { this.toggleEdit } > OK < /a> < /div > < /div> < /div >
            );

            return ( < div className = "container memo" > { this.state.editMode ? editView : memoView } < /div>);
            }
        }

        // Memo에 필요한 값들을 객체형으로 받아온다.
        Memo.propTypes = {
            data: React.PropTypes.object,
            ownership: React.PropTypes.bool,
            onEdit: React.PropTypes.func,
            onRemove: React.PropTypes.func,
            onStar: React.PropTypes.func,
            currentUser: React.PropTypes.string
        };

        //ownership prop: 해당 메모가 자신의 메모인지 아닌지 여부를 확인
        Memo.defaultProps = {
            data: {
                _id: 'id12367890',
                writer: 'Writer',
                contents: 'Contents',
                is_edited: false,
                date: { edited: new Date(), created: new Date() },
                starred: []
            },
            ownership: true,
            onEdit: (id, index, contents) => {
                console.error('onEdit not defined');
            },
            onRemove: (id, index) => {
                console.error('onRemove not defined');
            },
            onStar: (id, index) => {
                console.error('onStar not defined');
            },
            currentUser: ''
        };

        export default Memo;
