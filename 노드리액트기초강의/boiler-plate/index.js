const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');

// bodyparser 옵션
//application/x-www-form-urlencoded으로 되어있는 데이터 분석가능
app.use(bodyParser.urlencoded({ extended: true }));

//application/json으로 되어있는 데이터를 분석가능
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://hyunsix:ckaaotlf2080!@cluster0.8xuxq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
