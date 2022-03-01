const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt가 몇글자인지 나타냄

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 스페이스 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    // token 유효기간
    type: Number,
  },
});

// mongoose에서 가져온 메소드 user모델에 save(저장)하기전에 무언가를 한다!
userSchema.pre('save', function (next) {
  // this로 userSchema모델 가져오기
  let user = this;

  // password가 추가되거나 변경될떄만 암호화 실행해준다.
  if (user.isModified('password')) {
    // bycrypt api를 이용해 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // salt로 비밀번호 암호화
      bcrypt.hash(user.password, salt, function (err, hash) {
        // store hash(암호화된 비밀번호) in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// pw 비교 함수
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567    암호화된 PW $24sakdlcahewoi231354 블라블라
  // plainPassword를 암호화하고, DB의 암호화된 PW랑 같은지 확인
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// token 생성함수

const User = mongoose.model('User', userSchema);

module.exports = { User };
