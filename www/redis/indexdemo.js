const Redis = require('ioredis')
const redis = {
    port: 8084,          // Redis port
    host: '8.21.230.212',   // Redis host
    prefix: 'sam:', //存储前缀
    ttl: 60 * 60 * 23,  //过期时间   
    family: 4, //ipv4、ipv6
    db: 0 //db0、db1、db2、...
}
const newRedis = new Redis(redis)

exports.get = function(key){
    return new Promise(function (resolve, reject) {
        newRedis.get(key, function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

//newRedis.set('a',"haha")
//module.exports.newRedis = newRedis
//module.exports.RedisGet = get

