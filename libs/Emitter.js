var events = require('events');
var PingPongEmitter= new events.EventEmitter();

//알리미의 소켓 아이디를 인자로 받음
function AlimiPongReceiver(sid){
    io.of('/').to(sid).emit('PING', 'ponging');
    return new Promise(function(resolve, reject){
        var emitter=require('./Emitter').PingPongEmitter;
        var timeout=setTimeout(function(){
            // console.log("remove listener");
            emitter.removeListener('PONG_'+sid,function(){
                console.log("rejecting");
            })
            reject();
        },4000);
        emitter.once('PONG_'+sid,function(){
            clearTimeout(timeout);
            resolve();
        })
    });
}

//포스의 소켓 아이디를 인자로 받음
function PosPongReceiver(sid){
    io.of('/pos').to(sid).emit('PING', 'ponging');
    return new Promise(function(resolve, reject){
        var emitter=require('./Emitter').PingPongEmitter;
        var timeout=setTimeout(function(){
            // console.log("remove listener");
            emitter.removeListener('PONG_'+sid,function(){
                console.log("rejecting");
            })
            reject();
        },4000);
        emitter.once('PONG_'+sid,function(){
            clearTimeout(timeout);
            resolve();
        })
    });
}
module.exports={
    PingPongEmitter: PingPongEmitter,
    AlimiPongReceiver:AlimiPongReceiver,
    PosPongReceiver: PosPongReceiver
}