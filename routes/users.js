var express = require('express');
var router = express.Router();
var userHandler = require("../models/handleUsers.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res) {    // display register route
    res.render('register', {                    // display register form view
        title: 'nodeAuthDemo Register User'     // input data to view
    });
});

router.post('/register', async function(req, res) {   // new user post route
    userHandler.upsertUser(req);
    return res.redirect('/');                   // skip the receipt, return to fp
});

router.get('/login', function(req, res) {       // display register route
    res.render('login', {                       // display register form view
        title: 'nodeAuthDemo User Login'        // input data to view
    });
});

router.post('/login', async function(req, res) {// new user post route
    let rc = await userHandler.verifyUser(req); // verify credentials
    if (rc) {
        res.render('index', {                   // find the view 'index'
            title: 'Logged in!',         // input data to 'index'
            loggedin: true,
            who: req.session.user               // using session var(s)
        });
    } else {
        res.render('login', {                   // find the view 'login'
            title: 'nodeAuthDemo User Login',   // input data to 'login'
            loggedin: false
        });
    }
});
router.get('/pizza', function(req, res) {       // display register route
    res.render('pizza', {                       // display register form view
        title: 'nodeAuthDemo User Login',        // input data to view
        who: req.session.user,
        password: req.session.password,
        email: req.session.email
    });
});


module.exports = router;
