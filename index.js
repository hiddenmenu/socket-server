var express = require('express');
var http = require('http');
var app = express();

app.server = http.createServer(app);
io = require('socket.io')(app.server);

//포스기 쪽 네임스페이스 /pos
posNS=io.of('/pos');

//알리미 쪽 네임스페이스는 /
alimiNS=io.of('/');

tmpSid='';

//알리미 부분
require('./socket/alimi');

//포스기 부분
require('./socket/pos');

app.use('/',require('./route/index'));
app.use('/order',require('./route/order'));

app.server.listen(2016);
