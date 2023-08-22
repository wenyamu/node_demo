需要先配置mysql数据库 www/config/default.js
```
/*www/config/default.js*/
// 数据库配置
const dbconfig = {
    database: {
        DATABASE: '123', //数据库名称
        USERNAME: 'abc', //mysql用户名
        PASSWORD: '......', //mysql密码
        PORT: '3306', //mysql端口号
        HOST: '1.2.3.4', //服务器ip
    }
}

module.exports = dbconfig
```