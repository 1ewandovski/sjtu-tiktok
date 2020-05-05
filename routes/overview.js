var express = require('express');
var router = express.Router();

/* GET Overview page. */
router.get('/', function(req, res, next) {
    //res.render('overview', { title: 'Overview' });
    res.send('overview'); //send overview information
});

module.exports = router;