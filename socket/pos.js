posNS.on('connection', function (socket) {
    console.log("connected");
    console.info("연결된 소켓 id: " ,socket.id);
    /*
     소켓의 아이디는 매 연결시마다 바뀔수 있다
     따라서 각 알리미, 포스기에서 보내준 고유 값과 매칭하여 저장해주는 것이 필요하다
     */

    socket.on('register', function (incoming) {
        //포스기의 아이디 값을 가져와서 소켓 아이디와 연결
        var storeId=incoming.storeId;
        redis.addNewPos(socket.id, storeId);
        /*
         등록되지 않은 guid의 경우, 에러 핸들링 필요함.
         알리미에 알려줘야함.
         */
    });
    socket.on('PONG', function (incoming) {
        Emitter.PingPongEmitter.emit('PONG_'+socket.id,incoming);
    });
});

module.exports = posNS;