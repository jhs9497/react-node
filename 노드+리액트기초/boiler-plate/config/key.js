// 개발환경인지 배포환경인지에 따라 mongoDB 연결 소스 분기

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}
