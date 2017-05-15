import React from 'react';
import { Memo } from 'components';

//React 컴포넌트에 애니메이션 효과 추가.
//애니메이션을 적용 할 컴포넌트에 안에서 사용 할게 아니라 해당 컴포넌트의 부모 컴포넌트에서 사용 해야 한다.
//MemoList 컴포넌트안에서 ReactCSSTransitionGroup 을 사용하고 ReactCSSTransitionGroup 의 자식으로 Memo 컴포넌트들을 렌더링 한다.
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MemoList extends React.Component {

    //LifeCycle API 
    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }

    render() {

        //MemoList 컴포넌트 받은 데이터 배열을 컴포넌트 매핑
        //props.currentUser: 유저가 각 메모를 star 한지 안한지 여부를 확인.
        const mapToComponents = data => {
            return data.map((memo, i) => {
                return ( < Memo data = { memo }
                    ownership = { memo.writer === this.props.currentUser }
                    key = { memo._id }
                    onEdit = { this.props.onEdit }
                    onRemove = { this.props.onRemove }
                    onStar = { this.props.onStar }
                    index = { i }
                    currentUser = { this.props.currentUser }
                    />
                );
            });
        };

        return ( < div >
            < ReactCSSTransitionGroup transitionName = "memo"
            transitionEnterTimeout = { 2000 }
            transitionLeaveTimeout = { 1000 } > { mapToComponents(this.props.data) } < /ReactCSSTransitionGroup> < /div>
        );
    }
}

MemoList.propTypes = {
    data: React.PropTypes.array,
    currentUser: React.PropTypes.string,
    onEdit: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onStar: React.PropTypes.func
};

MemoList.defaultProps = {
    data: [],
    currentUser: '',
    onEdit: (id, index, contents) => {
        console.error('onEdit not defined');
    },
    onRemove: (id, index) => {
        console.error('onRemove not defined');
    },
    onStar: (id, index) => {
        console.error('onStar not defined');
    }
};

export default MemoList;
