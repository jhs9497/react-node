const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');

const config = require('./config/key');

// bodyparser 옵션
//application/x-www-form-urlencoded으로 되어있는 데이터 분석가능
app.use(bodyParser.urlencoded({ extended: true }));

//application/json으로 되어있는 데이터를 분석가능
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 회원가입 라우터
app.post('/register', (req, res) => {
  //회원 가입할때 필요한 정보들을 client에서 가져오면
  //그것들을 DB에 넣어준다.

  const user = new User(req.body);
  // save는 mongoDB의 메서드
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// 로그인 라우터
app.post('/login', (req, res) => {
  // 요청된 이메일을 DB안에서 찾기
  User.findOne({ email: req.body.eamil }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    // 요청한 이메일이 DB안에 있다면 비밀번호가 같은지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {});
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        messag: '비밀번호가 틀렸습니다.',
      });
    }
    // 비밀번호가 일치한다면 Token생성
    userInfo.generateToken((err, user) => {});
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
