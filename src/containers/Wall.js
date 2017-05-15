import React from 'react';
import { Home } from 'containers';

//특정 유저의 게시글만 보여준다.
//클라이언트 라우팅의 params은 this.props.params.xxx로 읽는다.
class Wall extends React.Component {
    render() {        
        return(
            <Home username={this.props.params.username}/>
        );
    }
}

export default Wall;
