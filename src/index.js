import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { App, Home, Login, Register, Wall } from 'containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

/*
store
- 앱의 상태 전부는 하나의 스토어(store)안에 있는 객체 트리에 저장
- Holds application state;
- Allows access to state via getState();
- Allows state to be updated via dispatch(action);
- Registers listeners via subscribe(listener);
- Handles unregistering of listeners via the function returned by subscribe(listener).
*/

/*
Action
- action은 어떤 변화가 일어나야 할 지 알려주는 객체.
- state를 변경하는 유일한 방법은 어떤일이 발생했는지 나타내주는 action 객체를 전달
- Action 을 dispatch 하여 상태값을 변경
*/

/*
Reducers
- action 객체를 처리하는 함수를 Reducer
- action 에 반응하여 application 의 state가 어떻게 바뀔지를 정한다.
- Reducer 는 ‘순수 함수’ 로만 작성
- 액션이 상태 트리를 어떻게 변경할지 명시
*/

/*
Redux
- Flux 아키텍쳐를 좀 더 편하게 사용 할 수 있도록 해주는 라이브러리(코드 및 구조가 정말 복잡해지는 스파게티 코드 막기)
- JavaScript 어플리케이션에서 data-state 와 UI-state 를 관리해주는 도구
- parent-child 관계가 아닌 컴포넌트끼리 데이터를 교류 할 때엔 글로벌 이벤트 시스템을 설정 하는 방법이 있다.
- Flux 패턴은 이를 수행하기 위한 방법 중 하나이다.
- Action 을 받았을 때, Dispatcher가 받은 Action들을 통제하여 Store에 있는 데이터를 업데이트합니다. 그리고 변동된 데이터가 있으면 View 에 리렌더링
- 컴포넌트끼리는 직접 교류하지 않고 store 중간자를 통하여 교류
*/

/*
Redux-thunk?
- redux-thunk: dispatcher 가 action creator 가 만든 action 객체 외에도 직접 만든 함수도 처리.
- 비동기 처리를 할 때 사용되는 redux 미들웨어
- action-creator 는 그냥 객체만 반환 할 뿐 거기에서 HTTP 요청을 하거나 할수는 없다.
- redux-thunk 를 사용하면 직접 함수를 만들어서 (함수를 리턴하는 함수에요) 그 함수 내부에서
- AJAX 요청을 하고 그 결과값에 따라 다른 action (ajax 성공 및 실패)을 또 dispatch 한다.
*/

/*
미들웨어는 액션을 보내는 순간부터 스토어에 도착하는 순간까지 사이에 서드파티 확장을 사용할 수 있는 지점을 제공
*/


//앱의 상태를 보관하는 Redux 스토어

const store = createStore(reducers, applyMiddleware(thunk));

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="home" component={Home}/>
                <Route path="login" component={Login}/>
                <Route path="register" component={Register}/>
                <Route path="wall/:username" component={Wall}/>
            </Route>
        </Router>
    </Provider>, rootElement
);
