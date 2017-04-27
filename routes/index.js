'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('/Users/mbonassa/Desktop/db/index.js');

module.exports = router;

router.get('/', function (req, res, next) {
  client.query('SELECT * FROM tweets JOIN users ON tweets.user_id = users.id', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
})});

router.get('/tweets', function (req, res, next) {
  client.query('SELECT * FROM tweets JOIN users ON tweets.user_id = users.id', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
})});

router.get('/users/:username', function (req, res, next) {
  client.query(`SELECT * FROM tweets JOIN users ON tweets.user_id = users.id WHERE name = '${req.params.username}'`, function (err, result) {
    if (err) return next(err);
    var tweets = result.rows;
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweets,
      showForm: true,
      username: req.params.username
    })
  })
});

router.get('/tweets/:id', function (req, res, next) {
  client.query(`SELECT * FROM tweets JOIN users ON tweets.user_id = users.id WHERE tweets.id = '${req.params.id}'`, function (err, result) {
    if (err) return next(err);
    var tweetsWithThatId = result.rows;
    res.render('index', {title: 'Twitter.js', tweets: tweetsWithThatId});
  })
});

router.post('/tweets', function (req, res, next) {

var name = req.body.name;
var tweet = req.body.content;

client.query((`SELECT id FROM users WHERE name = '${name}'`), function (err, result) {
  if (err) return next (err)
  if (!result.rowCount) {
    client.query (`INSERT INTO users (name) VALUES ('${name}')`, function (err, result) {
      if (err) return next (err);
      client.query(`INSERT INTO tweets (user_id, content) VALUES ((SELECT id FROM users WHERE name = '${name}') ,'${tweet}')` , function (err, result) {
        if (err) return next (err);
        res.redirect('/');
      });          
    });
  } else {
    client.query(`INSERT INTO tweets (user_id, content) VALUES ((SELECT id FROM users WHERE name = '${name}') ,'${tweet}')` , function (err, result) {
      if (err) return next (err);
      res.redirect('/');
    });     
  };


});



  
});

