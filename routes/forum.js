var express = require('express');
var router = express.Router();
// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');
// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);
/* GET forum page. */
router.get('/', function (req, res, next) {   //论坛主页
    var page = req.query.page;
    pool.getConnection(function (err, connection) {
        //先判断帖子是否到底
        var $sql = "select * from forum where page>?"; //example
        connection.query($sql, [page], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if (resultJson.length == 0) {
                result = {
                    code: 298,
                    msg: '没有更多帖子了'
                };
                res.json(result);
                connection.release();
            } else { //返回主页，包含很多帖子标题
                res.json(result);
                connection.release();
            }
        });
    });
});
router.post('/postForum',function(req,res,next){    //点进一个帖子看
    var page = req.body.page;
    var postpage = req.body.postpage; //postpage 帖子id

    var like = req.body.like;        //需要增加点赞逻辑

    pool.getConnection(function (err, connection) {
        var $sql = "select * from forum where postpage=?"; //example
        connection.query($sql, [postpage], function (err, result) {
            var resultJson = result;
            console.log(resultJson.length);
            if (resultJson.length == 0) { //帖子被删掉了
                result = {
                    code: 297,
                    msg: '帖子不见了'
                    };
                res.json(result);
                connection.release();
            } else { //返回帖子内容
                res.json(result);
                connection.release();
                }
        });
    });
});
router.post('/postcomment',function(req,res,next){   //评论一个帖子
    var comment = req.body.comment;
    var postpage = req.body.postpage;
    var $sql = "insert into postpages() values(?,?)";   //example
    pool.getConnection(function (err, connection) {
        connection.query($sql, [comment,postpage], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 295,
                    msg: '评论成功'
                };
            } else {
                result = {
                    code: 294,
                    msg: '评论失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

router.post('/postlike',function(req,res,next){   //点赞一个帖子
    var like = req.body.like;
    var postpage = req.body.postpage;
    var $sql = "insert into postpages() values(?,?)";   //example
    pool.getConnection(function (err, connection) {
        connection.query($sql, [like,postpage], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 293,
                    msg: '点赞成功'
                };
            } else {
                result = {
                    code: 292,
                    msg: '点赞失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

router.post('/postnew',function(req,res,next){    //发帖
    var title = req.body.title;
    var content = req.body.content;
    var $sql = "insert into postpages() values(?,?)";   //example
    pool.getConnection(function (err, connection) {
        connection.query($sql, [title,content], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 289,
                    msg: '发帖成功'
                };
            } else {
                result = {
                    code: 288,
                    msg: '发帖失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

router.post('/postdelete',function(req,res,next){   //删帖
    var postpage = req.body.postpage;
    var $sql = "delete postpages() values(?,?)";   //example
    pool.getConnection(function (err, connection) {
        connection.query($sql, [postpage], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 287,
                    msg: '删帖成功'
                };
            } else {
                result = {
                    code: 286,
                    msg: '删帖失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});
module.exports = router;