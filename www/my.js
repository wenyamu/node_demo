//index.js

/* 方式一: mysql.createConnection*/
const Koa = require('koa');
const DB = require('./mysql');
const router = require('koa-router')();
const koaNunjucks = require('koa-nunjucks-2'); // 引入 koa-nunjucks-2（nunjucks模板中间件）
const path = require('path');
const static = require('koa-static');//引用静态
var app = new Koa();
// 使用中间件，利用path模块的方法拼接出静态文件目录的绝对路径
app.use(static(path.join(__dirname,"public"),{ extensions: ['html']}));
/* 使用 koa-nunjucks-2 实例获得中间件*/
app.use(koaNunjucks({
    ext: 'html', // 使用HTML后缀的模板
    //path: path.join(__dirname, 'view'), // 模板所在路径
    path: __dirname + "/view", // 模板所在路径
    nunjucksConfig: { // nunjucks的配置
        trimBlocks: true
    }
}));

router.get('/view', async (ctx) => {
    var food = {
            'ketchup': '5 tbsp',
            'mustard': '1 tbsp',
            'pickle': '0 tbsp'
        };
    var food2 = [{
            'id': '1',
            'name': '2',
            'home': '3'
        },{
            'id': 'a',
            'name': 'b',
            'home': 'c'
        }];
    var food3 = {"ddd":[{
            'id': '1',
            'name': '2',
            'home': '3'
        },{
            'id': 'a',
            'name': 'b',
            'home': 'c'
        }]};
    var ljs = food3.ddd;
    await ctx.render('demo', {text:'Hello World!', title:'nunjucks', food, food2, ljs});
});

router.get('/view2', async (ctx) => {

    var sql = 'select id,name,home from student ORDER BY id asc';
    var result = await DB.query(sql);
    var res = {data: result};
    //var zcw = res.data
    //await ctx.render('demo', {text:'Hello World!', title:'nunjucks', zcw});
    await ctx.render('demo', {text:'Hello World!', title:'nunjucks', zcw:res.data});
});
// 执行查询操作
router.get('/', async (ctx) => {
    await ctx.render('index', {title:'Hello Node!', info:'node'});
});
// 执行查询操作
router.get('/cha', async (ctx) => {
    var sql = 'select id,name,home from student ORDER BY id asc';
    var result = await DB.query(sql);
    //ctx.type = 'text/html';
    ctx.body = {
        //"code": ctx.params.n,//获取路由中的参数值
        data: result,
        //"mesg": ctx.query.a//获取url中的参数值
    }
});
// 增加操作
router.get('/add', async (ctx) => {
    // 模拟获取前台的数据
    var username = '张三';
    var homeid = '222888';
 
    var sql = 'insert into student (name,home) values (?,?)';
    var params = [username, homeid];
    var result = await DB.query(sql, params);
    // 实际开发中需要判断后给出响应
    ctx.body = '增加成功';
 
});
// 增加多条记录操作
router.get('/adds', async (ctx) => {
    // 模拟获取前台的数据
    var sql = 'insert into student (name,home) values ?';
    var params = [["工",11],["了",22],["以",33]];
    var data = await DB.query(sql, [params]);
    // 实际开发中需要判断后给出响应
    ctx.body = '增加多条记录成功';
 
});
// 编辑操作
router.get('/edit', async (ctx) => {
    // 模拟获取前台的数据
    var n = '李四2';
    var h = '111222';
    var id = ctx.query.id;//url带上参数id=123，可以获取id的值为123
    var sql = 'update student set name=?,home=? where id=?';
    var result = await DB.query(sql, [n, h, id]);
 
    // 实际开发中需要判断后给出响应
    ctx.body = '修改成功';
});
 
// 删除操作
router.get('/del/:id', async (ctx) => {
    var hid = ctx.params.id;
    var sql = 'delete from student where id=?';
    var result = await DB.query(sql,hid);
    // 实际开发中需要判断后给出响应
    ctx.body = '删除成功';
});


/* 方式二: mysql.createPool
const Koa = require('koa')
const mysql = require('./mysql')
const router = require('koa-router')()
const app =  new Koa()

//获取用户1(GET请求)
router.get('/abc/:n', async (ctx, next) => {
    let sql = 'SELECT * from student';
    let data = await mysql.query(sql)
    ctx.body = {
        //code: ctx.params.n,//获取路由中的参数值
        //msg: ctx.query.a,//获取url中的参数值
        data: data,
    }
})

//获取用户2(GET请求)
router.get('/efg/:id', async (ctx, next) => {
    let homeid = ctx.params.id;
    let sql = `SELECT * from student where home="${homeid}"`
    let data = await mysql.query(sql)
    // 实际开发中需要判断后给出响应
    if(data && data.status && data.status === 200) {
        ctx.body = {
            code: 1,
            msg: "查询成功",
            data: data,
        };
    } else {
        ctx.body = data;
    }

})


//插入(GET请求)
// 插入的字段类型是否一致，不然会出错
// 成功时：{"fieldCount":0,"affectedRows":10,"insertId":51,"serverStatus":2,"warningCount":5,"message":"'Records: 10  Duplicates: 0  Warnings: 5","protocol41":true,"changedRows":0}

router.get('/add', async (ctx, next) => {
    // 模拟获取前台的数据

    var sql = 'insert into student (name,home) values ?';
    var params = [["1",11],["2",22],["3",33],["4",44],["5",55],["6",66],["7",77],["8",88],["9",99],["10",1010]];
    var data = await mysql.query(sql, [params]);
    // 实际开发中需要判断后给出响应
    if(data && data.status && data.status === 200) {
        ctx.body = {
            //code: 1,
            //msg: "插入成功",
            data: data,
        };
    } else {
        ctx.body = data;
    }
})

//更新(GET请求)
// 空表时：{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 0  Changed: 0  Warnings: 0","protocol41":true,"changedRows":0}
// 成功时：{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}

router.get('/up', async (ctx, next) => {
    // 模拟获取前台的数据

    var sql = `update student set name=?,home=? where id=51`;
    var params = ['张1', 1];
    var data = await mysql.query(sql, params);
    // 实际开发中需要判断后给出响应
    if(data && data.status && data.status === 200) {
        ctx.body = {
            //code: 1,
            //msg: "更新成功",
            data: data,
        };
    } else {
        ctx.body = data;
    }
})

//删除(GET请求)

//成功时：{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
router.get('/del', async (ctx, next) => {
    // 模拟获取前台的数据
 
    var sql = `DELETE FROM student WHERE id=?`;
    var params = [52];
    var data = await mysql.query(sql, params);
    // 实际开发中需要判断后给出响应
    if(data && data.status && data.status === 200) {
        ctx.body = {
            //code: 1,
            //msg: "删除成功",
            data: data,
        };
    } else {
        ctx.body = data;
    }
})*/

// add router middleware:
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(80)
console.log('正在监听80端口，请使用 ip:80 访问');