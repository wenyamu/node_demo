
const Koa = require('koa');

const router = require('koa-router')();

var app = new Koa();
//const redisDB = require('./redis');

const Redis = require('ioredis')
const redis = {
    //prefix: 'ljs:',
    port: 8084, //端口
    host: '87.21.26.20',    //你的redisIP
    password: '', //你的redis密码 无密码可以为空
    db: 0,  //默认存储库
    ttl: 60 * 60 * 24, //过期时间
    options: {} //其它配置
}
const newRedis = new Redis(redis)

function GET(key){
    return new Promise(function (resolve, reject) {
        newRedis.get(key, function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

//为key赋值，成功返回OK，key不存在则新增再赋值，存在则修改值
function SET(key,val){
    return new Promise(function (resolve, reject) {
        newRedis.set(key,val, function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

//为不存在的key赋值，成功返回1，key存在则赋值失败，返回0
function SETNX(key,val){
    return new Promise(function (resolve, reject) {
        newRedis.setnx(key,val, function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

//为key的值加1
function INCR(key){
    return new Promise(function (resolve, reject) {
        newRedis.incr(key, function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

//获取redis信息
function info(){
    return new Promise(function (resolve, reject) {
        newRedis.info(function (err, result) {  
            if(err) reject(err)
            console.log(result)
            resolve(result);
          });  
    })
};

router.get('/info', async (ctx, next) => {
    let rows = await info()
    if(rows != null){
         console.log('rows = ',rows)
         ctx.body = rows;
         return;
    }

});

router.get('/get/:key', async (ctx, next) => {
    let KEY = ctx.params.key
    let rows = await GET(KEY)
    if(rows != null){
         console.log('rows = ',rows)
         ctx.body = rows;
         return;
    }

});

router.get('/set/:key/:value', async (ctx, next) => {
    let KEY = ctx.params.key
    let VALUE = ctx.params.value
    let rows = await SET(KEY,VALUE)
    /**/if(rows != null){
         console.log('rows = ',rows)
         ctx.body = rows;
         return;
    }

});

router.get('/setnx/:key/:value', async (ctx, next) => {
    let KEY = ctx.params.key
    let VALUE = ctx.params.value
    let rows = await SETNX(KEY,VALUE)
    /**/if(rows != null){
         console.log('rows = ',rows)
         ctx.body = rows;
         return;
    }

});

router.get('/incr/:key', async (ctx, next) => {
    let KEY = ctx.params.key
    let rows = await INCR(KEY)
    /**/if(rows != null){
         console.log('rows = ',rows)
         ctx.body = rows;
         return;
    }

});

/*
router.get('/set', async (ctx) => {
    //await redis.setData("aaa", "bbb", 60 * 5);
    ctx.body = "set成功"
});


async getCode({ size = 4, w = 100, h = 30 }) {
    try {
        const data = {
            text: 135478,
            ex: 12456
        }
        //设置验证码   data可以为任意js数据类型  存储到redis
        await redis.setData(`redis的key最好用一个变量或者常量来代替字符`, data, 60 * 5); //设置有效期 单位是 秒（s） 返回Boolean值 
        const rd = await redis.getData(`redis的key 和存储时的一样`);//存在返回存储的原对象,不存在或者过期后返回null
        const delRD = redis.delData(`redis的key 和存储时的一样`);	//删除redis的缓存 返回Boolean 值
        return result.success(null, { img: data });
    } catch (error) {
        return result.failed(error);
    }
}*/


// add router middleware:
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(80)
console.log('正在监听80端口，请使用 ip:80 访问');
