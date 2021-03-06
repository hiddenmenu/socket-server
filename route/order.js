var express = require('express');
var router = express.Router();
var Emitter = require('../libs/Emitter');

router
//새 주문 들어왔을 경우
    .post('/new', function (req, res, next) {
        /*
         먼저 ping을 해서 pong이 오는 지 확인

         새로운 주문 들어왔을 시, 포스가 죽었다면 알리미로도 정보가 가면 안됨.

         request data
         - company_id  //본 코드에는 storeId로 표현
         - order_id

         */

        var storeId = req.body.company_id;

        //포스 상태
        redis.checkIfThereIsPos(storeId).then(function (posSid) {
            console.log("검색된 포스: " + posSid);
            if (posSid) {
                Emitter.PosPongReceiver(posSid)
                    .then(function () {
                        /*
                         포스 살았을 때는
                         포스로 새로운 주문 정보 보내주면 된다.
                         */
                        console.log("received pos pong");
                        io.of('/pos').to(posSid).emit("NEW_ORDER", {order_id: req.body.order_id});

                        redis.checkIfThereIsAlimi(storeId).then(function (result) {
                            if (result) {
                                Emitter.AlimiPongReceiver(result)
                                    .then(function () {
                                        /*
                                         알리미 살았을 때
                                         1.
                                         2. 알리미에 불 켜지라고 신호,
                                         3. 포스기에 새로운 주문 정보 전달
                                         */
                                        console.log("received pong");
                                        io.of('/').to(result).emit('led', 'on');
                                        res.json({result: "success"})
                                    })
                                    .catch(function () {
                                        console.log("didnt receive pong");
                                        //알리미가 죽음
                                        redis.onAlimiDisconnect(storeId);

                                        res.json({err: "알리미 죽음", errCode: "ALIMI DEAD"})
                                    })
                            } else {
                                res.json({result: "success"})
                            }
                        })
                    })
                    .catch(function () {
                        /*
                         포스 죽었을 때는
                         1. 죽었다고 본 api서버에 알린다
                         */
                        console.log("didnt receive pos pong");
                        res.json({err: "포스 죽음", errCode: "DEAD"})
                    })


            } else {
                //연결된 포스기가 없을 경우
                res.json({err: "포스 없음", errCode: "NONE"})
            }
        })
    })
    .post('/confirm', function (req, res, next) {
        /*
         먼저 ping을 해서 pong이 오는 지 확인

         포스기에는 핑을 보내지 않음.
         어차피 컨펌 요청은 포스기에서 보내진 것이므로

         request

         - company_id
         - moreOrder 현재 가게에 남은 주문이 있는지 bool

         */
        console.log("confirmed:::");
        console.log(req.body);
        var company_id = req.body.company_id;
        var more_order = req.body.more_order;
        redis.checkIfThereIsAlimi(company_id).then(function (result) {
            if (result) {
                //알리미 상태
                Emitter.AlimiPongReceiver(result)
                    .then(function () {
                        /*
                         알리미 살았을 때는

                         1. 해당 업체 아이디에 연결된 알리미의 redis 카운터에 -1
                         2. 카운터가 0이라면 알리미에 불끄라고 신호
                         */
                        console.log("received pong");
                        if(more_order){
                            io.of('/').to(result).emit('led', 'on');
                        }else{
                            io.of('/').to(result).emit('led', 'off');
                        }
                        res.json({result: "success"})
                    })
                    .catch(function () {
                        /*
                         알리미 죽었을 때는
                         1. 먼저 죽었다고 본 api서버에 알리고
                         2. 다시 살아나면(연결되면) 해당 업체의 현재 알리미 상태를 읽어서 불을 켤지 말지 결정한다.

                         */
                        console.log("didnt receive pong");
                        res.json({err: "알리미 죽음", errCode: "DEAD"})
                    })
            } else {
                //연결된 알리미가 없을 경우
                res.json({result: "success"});
            }
        })

    })
    .all('*', function (req, res, next) {
        res.sendStatus(404);
    })


module.exports = router;