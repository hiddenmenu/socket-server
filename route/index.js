var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var pjson = require('../package.json');
    res.send("히든 메뉴 실시간 푸시 서버 v."+ pjson.version);
});

module.exports = router;