const express = require('express');
const webServer = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const port = process.env.port || 3000;

const openBulb = (span) => {
  // TODO: 
  // ここでバルブを開く
  return new Promise((resolve, reject) => {
    setTimeout(resolve, span)
  })
}

webServer.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  return next();
});

webServer.use('/', express.static('.'));
webServer.use(bodyParser.json());

webServer.post('/justap/open', (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  console.log('---');
  console.log('/justap/open');
  console.log(req.body);

  openBulb(parseInt(req.body.time))
    .then(() => {
      // memo: delay秒後に呼ばれる
      // ここでバルブを閉める
      console.log(`finisehd`);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log('---');
  res.json("result: {status: 'okay'}");
  return next();
});

webServer.listen(port, () => {
  console.log('http://localhost:' + port + 'is generated');
});
