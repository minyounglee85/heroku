//mongoose: mongodb 데이터 모델링 툴.
import mongoose from 'mongoose';

//bcryptjs 모듈을 사용하여 비밀번호 보안을 강화
import bcrypt from 'bcryptjs';

/*
Schema 데이터의 틀이다.
Model 실제 데이터베이스에 접근 할 수 있게 해주는 클래스.
*/

console.log("server/models/account.js");

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    created: { type: Date, default: Date.now }
});

// generates hash
Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
Account.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//account Schema 를 만들고 model 로 만들어서 export
export default mongoose.model('account', Account);

/*
.model() 의 첫번째 인수로 들어가는 account 는 collection 이름이다.
복수형이다.
account의 복수형은 accounts 이니 accounts 라는 컬렉션이 만들어지고 거기에 저장.
*/
