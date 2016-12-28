var redisServer = require('redis');
var redisClient = (process.env.NODE_ENV=='production'?redisServer.createClient('6379','redis'):redisServer.createClient({
    host: 'localhost',
    port: 32769
}))


/*
redis structure

alimi-storeid: socket id
pos-storeid: socket id

 */

/*
    알리미가 새로 연결되었을 때 해당 업체에 등록
 */
function addNewAlimi(alimiSocketId, storeId) {
    return new Promise(function (resolve, reject) {
        redisClient.set('alimi-' + storeId, alimiSocketId, function (err, data) {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    })
}
/*
 알리미가 해당 업체에 연결되어 있는지 확인
 */
function checkIfThereIsAlimi(storeId){
    return new Promise(function(resolve, reject){
        redisClient.get('alimi-'+storeId, function(err, data){
            if(err){
                reject(err);
            }
            if(data===null){
                resolve(false);
            }else{
                resolve(data);
            }
        })
    })

}
/*
 알리미가 죽었을 때 알리미를 리스트에서 삭제
 */
function onAlimiDisconnect(storeId){
    return new Promise(function(resolve, reject){
        redisClient.del('alimi-'+storeId, function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        })
    })
}

/*
 포스기가 새로 연결되었을 때 해당 업체에 등록
 */
function addNewPos(alimiSocketId, storeId) {
    return new Promise(function (resolve, reject) {
        redisClient.set('pos-' + storeId, alimiSocketId, function (err, data) {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    })
}
/*
 포스기가 해당 업체에 연결되어 있는지 확인
 */
function checkIfThereIsPos(storeId){
    return new Promise(function(resolve, reject){
        redisClient.get('pos-'+storeId, function(err, data){
            if(err){
                reject(err);
            }
            if(data===null){
                resolve(false);
            }else{
                resolve(data);
            }
        })
    })

}
/*
 포스기가 죽었을 때 알리미를 리스트에서 삭제
 */
function onPosDisconnect(storeId){
    return new Promise(function(resolve, reject){
        redisClient.del('pos-'+storeId, function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        })
    })
}

module.exports={
    addNewAlimi:addNewAlimi,
    checkIfThereIsAlimi:checkIfThereIsAlimi,
    onAlimiDisconnect:onAlimiDisconnect,
    addNewPos:addNewPos,
    checkIfThereIsPos:checkIfThereIsPos,
    onPosDisconnect:onPosDisconnect
}