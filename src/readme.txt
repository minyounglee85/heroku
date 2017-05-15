디렉토리 구조는 아래 주소 참고
https://github.com/erikras/react-redux-universal-hot-example

src
├── actions
│   ├── ActionTypes.js (redux 에서 필요한 action type)
│   ├── authentication.js
│   ├── index.js
│   ├── memo.js
│   └── search.js
├── components (각종 콤포넌트 저장)
│   ├── Authentication.js (계정 인증)
│   ├── Header.js
│   ├── index.js
│   ├── Memo.js
│   ├── MemoList.js
│   ├── Search.js
│   └── Write.js
├── containers (라우터에서 보여줄 페이지)
│   ├── App.js (페이지 틀)
│   ├── Home.js
│   ├── index.js
│   ├── Login.js
│   ├── Register.js
│   └── Wall.js
├── index.js
└── reducers (계정인증 / 메모 / 검색)
    ├── authentication.js
    ├── index.js
    ├── memo.js
    └── search.js