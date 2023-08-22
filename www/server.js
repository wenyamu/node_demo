// app.js
// 发现一个问题，不能通过 ip 访问
const Koa = require('koa'); // 引入koa
//const koaNunjucks = require('koa-nunjucks-2'); // 引入 koa-nunjucks-2
const path = require('path');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

//const sslify = require('koa-sslify').default;//http强制HTTPS
const https = require('https');//node内置https server
const fs = require('fs');

// koa-static中间件，用于访问静态文件
const static = require('koa-static');

const app = new Koa(); // 创建koa应用

//app.use(sslify());//强制HTTPS, 注释此行，则80和443都可访问

// 使用中间件，利用path模块的方法拼接出静态文件目录的绝对路径
app.use(static(path.join(__dirname,"public"),{ extensions: ['html']}));

/*app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
*/
/* log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});*/

// add url-route:
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/time', async (ctx, next) => {
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>time</h1>';
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`); // 打印URL
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

/* 使用 koa-nunjucks-2 实例获得中间件
app.use(koaNunjucks({
    ext: 'html', // 使用HTML后缀的模板
    //path: path.join(__dirname, 'view'), // 模板所在路径
    path: __dirname + "/view", // 模板所在路径
    nunjucksConfig: { // nunjucks的配置
        trimBlocks: true
    }
}));

app.use(async ctx => {
    await ctx.render('index', { text: 'Hello World!' }); // 使用 ctx.render 可以通过 nunjucks 渲染页面
})

router.get('/view', async (ctx, next) => {
    ctx.render('index', { text: 'Hello World!' });
    await next();
});

router.get('/view', async (ctx) => {
    var food = {
        'ketchup': '5 tbsp',
        'mustard': '1 tbsp',
        'pickle': '0 tbsp'
        };
    await ctx.render('index', {text:'Hello World!', title:'nunjucks', food});
});*/


// add router middleware:
app.use(router.routes());
app.use(router.allowedMethods());

/* 启动服务监听本地80和443端口*/

/*监听本地80
app.listen(80, () => {
    console.log('server running success at 80');
})*/

/*监听本地443*/

//配置ssl
var options = {
    key: fs.readFileSync('./ssl/privkey.pem'),  //私钥文件路径，相对于项目目录
    cert: fs.readFileSync('./ssl/fullchain.pem')  //证书文件路径，相对于项目目录
};

var httpsServer = https.createServer(options, app.callback());
httpsServer.listen(443, (err) => {// 默认监听443
  if (err) {
    console.log('服务启动出错', err);
  } else {
    //db.connect();  // 数据库连接
    console.log('server running success at 443');
  }
});

