var express = require('express');
var router = express.Router();
// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');
// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);
/* GET notice page. */
router.get('/', function (req, res, next) {
    //res.render('notice', {title: 'notice'});
    pool.getConnection(function(err,connection){
        var $sql="select * from websites"; //example,输出网站列表
        connection.query($sql, function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if(resultJson.length ==0){
                result ={
                    code : 290,
                    msg : '无网站'
                };
                res.json(result);
                connection.release();
            }else{ //返回通知
                res.json(result);
                connection.release();
            }
        });
    });
});
router.post('/userNotice',function(req,res,next){
    var website = req.body.website;
    var date = req.body.date;
    pool.getConnection(function (err, connection) {
        //先判断有无最新通知
        var $sql="select * from websites where website=? and date>?"; //example
        connection.query($sql, [website,date], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if(resultJson.length ==0){
                result ={
                    code : 299,
                    msg : '该网站无最新通知'
                };
                res.json(result);
                connection.release();
            }else{ //返回通知
                res.json(result);
                connection.release();
            }
        });
    });
});

module.exports = router;