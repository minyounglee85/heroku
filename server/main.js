import express from 'express';
import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

//HTTP 요청을 로그하는 미들웨어
import morgan from 'morgan';

//body-parser 요청에서 JSON을 파싱할때 사용되는 미들웨어
import bodyParser from 'body-parser';

//mongodb 데이터 모델링 툴
import mongoose from 'mongoose';

//Express 프레임워크에서 세션을 관리하기 위해 필요한 미들웨어
import session from 'express-session';

import api from './routes';


const app = express();

//헤로쿠 서버 환경 변수 적용
const port = process.env.PORT || 3000;
const devPort = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());

//몽고DB 연결
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
// mongoose.connect('mongodb://username:password@host:port/database=');

//암호를 감추기 위해 헤로쿠 환경변수로 적용
mongoose.connect(process.env.MONGOLAB_FULL);
//mongoose.connect('mongodb://minyoung:비밀번호@ds015899.mlab.com:15899/heroku_ls9469s6');

//세션 사용
app.use(session({
    secret: 'CodeLab1$1$234', //쿠키를 임의로 변조하는것을 방지하기 위한 값 
    resave: false, //세션을 언제나 저장할 지 정하는 값
    saveUninitialized: true //세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
}));

app.use('/', express.static(path.join(__dirname, './../public')));

//express 서버에서 클라이언트사이드 라우팅을 호환
/* setup routers & static directory */
app.use('/api', api);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

//에러 처리
//라우터에서 throw err 실행시 아래 코드 실행
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
