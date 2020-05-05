var express = require('express');
var router = express.Router();
// 实现与MySQL交互
var mysql = require('mysql');
var config = require('../model/config');
// 使用连接池，提升性能
var pool = mysql.createPool(config.mysql);
/* GET tiktok page. */
router.get('/', function (req, res, next) {   //tiktok homepage
    res.send('welcome to tiktok');
});

router.get('/vlognext', function (req, res, next) {   //浏览下一个vlog
    res.send('interested video refer to AI');
});

router.post('/vlogupload',function(req,res,next){    //上传vlog
    var video = req.body.video;
    var title = req.body.title;
    var type = req.body.type;
    pool.getConnection(function (err, connection) {
        var $sql = "insert into vlogs() values(?,?,?)"; //example
        connection.query($sql, [video,title,type], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 285,
                    msg: '发布vlog成功'
                };
            } else {
                result = {
                    code: 284,
                    msg: '发布vlog失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

router.post('/vlogcomment',function(req,res,next){    //评论vlog
    var comment = req.body.comment;
    var vlog = req.body.vlog;
    pool.getConnection(function (err, connection) {
        var $sql = "insert into vlogs() values(?,?,?)"; //example
        connection.query($sql, [vlog,comment], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 283,
                    msg: '评论vlog成功'
                };
            } else {
                result = {
                    code: 282,
                    msg: '评论vlog失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

router.post('/vlogdelete',function(req,res,next){   //删vlog
    var vlog = req.body.vlog;
    var $sql = "delete vlogs() values(?,?)";   //example
    pool.getConnection(function (err, connection) {
        connection.query($sql, [vlog], function (err, result) {
            console.log(result);
            if (result) {
                result = {
                    code: 281,
                    msg: '删vlog成功'
                };
            } else {
                result = {
                    code: 280,
                    msg: '删vlog失败'
                };
            }
            res.json(result);
            connection.release();
        });
    });
});

module.exports = router;