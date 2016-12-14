var express = require('express');
var router = express.Router();
var path=require('path');
router.get('/', function (req, res, next) {
    var pjson = require('../package.json');
    res.send("히든 메뉴 실시간 푸시 서버 v."+ pjson.version);
});
router.get('/map', function(req, res, next){
    res.sendFile(path.join(__dirname,'../public/map.html'));
});
module.exports = router;