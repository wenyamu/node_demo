// mysql/index.js

var mysql = require('mysql');
var config = require('../config/default.js')//mysql

var db = {
    host     : config.database.HOST,
    port     : config.database.PORT,
    user     : config.database.USERNAME,
    password : config.database.PASSWORD,
    database : config.database.DATABASE
};

var pool  = mysql.createPool(db);

/* 方式一: mysql.createConnection*/
var mysql = require('mysql');

// 建立链接
function __connection() {
    var connection = mysql.createConnection(db);
    connection.connect();
    return connection;
};
 
exports.query = function (sql, parmas = null) {
    // 获取数据库链接对象
    var connection = __connection();
    return new Promise(function (reject, resolve) {
        // 执行SQL语句
        connection.query(sql, parmas, function (error, results, fields) {
            if (error) throw error;
            reject(results);
            console.log("命令成功");
        });
        // 关闭链接
        connection.end();
    })
}


/* 方式二: mysql.createPool
//网上说，并发访问时，通过connection.release()释放连接死活不成功，导致访问达到一定连接数上限后，pool.getConnection直接卡死没有任何的回调！改成pool.releaseConnection(connection)才ok！(未亲测，待研究)
exports.query = (sql, sqlParams) => {
    return new Promise((resolve, reject) => {
        //初始化连接池
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err,'数据库连接失败！');
            }
            else{
                console.log('数据库连接成功！');
                //操作数据库
                connection.query(sql, sqlParams, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        //connection.release();
                        pool.releaseConnection(connection);
                        resolve({
                            status: 200,
                            results
                        });
                    }
                });
            }
        })
    });
}*/
