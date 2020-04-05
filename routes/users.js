var express = require('express');
var router = express.Router();
var userHandler = require("../models/handleUsers.js");
var todoHandler = require("../models/handleTodo.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.authenticated) {
    return res.redirect('/view');
  } else {
    res.render('index', { title: 'Todos', authenticated: req.session.authenticated, names: req.session.fullname, });
  }
});

router.get('/register', function(req, res) {    // display register route
  if (req.session.authenticated) {
    res.render('register', { title: 'Register', authenticated: req.session.authenticated, names: req.session.fullname, });
  } else {
    res.render('register', { title: 'Register', authenticated: req.session.authenticated, names: req.session.fullname, });
  }
});

router.post('/register', async function(req, res) {   // new user post route
    userHandler.upsertUser(req);
    return res.redirect('/');                   // skip the receipt, return to fp
});

router.get('/login', function(req, res) {       // display register route
    if (req.session.authenticated) {
      return res.redirect('/view');
    } else {
      res.render('login', {                       // display register form view
          title: 'Login', names: req.session.fullname,        // input data to view
      });
    }
});

router.post('/login', async function(req, res) {// new user post route
    let rc = await userHandler.verifyUser(req); // verify credentials
    if (rc) {
        return res.redirect('/view');
    } else {
        res.render('login', {                   // find the view 'login'
            title: 'Please try again!',   // input data to 'login'
            loggedin: false
        });
    }
});

router.get('/logout', function(req, res) {       // display register route
    req.session.authenticated = false;
    res.render('index', {                   // find the view 'index'
          title: 'Todos', authenticated: req.session.authenticated, names: req.session.fullname,
      });
});

router.get('/addtodo', function(req, res) {       // display register route
    if (req.session.authenticated)
      res.render('addtodo', {                       // display register form view
          title: 'nodeAuthDemo User Login',        // input data to view
          who: req.session.user,
          password: req.session.password,
          names: req.session.fullname,
          email: req.session.email,
          authenticated: req.session.authenticated
      });
    else {
      return res.redirect('/login');
    }
});

router.post('/addtodo', function(req, res) {       // display register route
    todoHandler.upsertTodo(req);
    res.render('view', {                   // find the view 'index'
        title: 'Entry entered!',         // input data to 'index'
        loggedin: true,
        who: req.session.user,
        names: req.session.fullname,            // using session var(s)
        authenticated: req.session.authenticated,
        success: true,
        title: "Success! Your entry was added!"
    });
});

router.get('/view', async function(req, res) {       // display register route
    if (req.session.authenticated) {
      let stuff = await todoHandler.retrieveTodo(req, {sort: {endDate: 1, priority: -1}});
      if (stuff) {
        console.log("Why");
        res.render('view', {                       // display register form view
            stuff: stuff,
            names: req.session.fullname,
            who: req.session.user,
            authenticated: req.session.authenticated,
            title: "View your todos"
        });

      } else {
        console.log("yes");
        res.render('view', {
            nothing: true,
            names: req.session.fullname,                   // display register form view
            data: "Hi Mom",
            authenticated: req.session.authenticated
        });
      }
    } else {
      return res.redirect('/login');
    }
});

router.get('/edit/:random', async function(req, res) {       // display register route
    if (req.session.authenticated) {
      let stuff = await todoHandler.retrievemodTodo(req);
      if (stuff) {
        console.log("Why");
        res.render('edit', {                       // display register form view
            stuff: stuff,
            names: req.session.fullname,
            who: req.session.user,
            authenticated: req.session.authenticated
        });

      } else {
        console.log("yes");
        res.render('view', {                       // display register form view
            data: "Hi Mom",
            authenticated: req.session.authenticated,
            nothing: true,
            names: req.session.fullname,
        });
      }
    } else {
      return res.redirect('/login');
    }
});

router.post('/edit/:random', async function(req, res) {       // display register route
    if (req.session.authenticated) {
      let stuff = await todoHandler.modifyTodo(req);
      if (stuff) {
        res.render('login', {                       // display register form view
            stuff: stuff,
            names: req.session.fullname,
            who: req.session.user,
            authenticated: req.session.authenticated,
            success: true,
            title: "Success! Your entry was updated!"
        });

      } else {
        console.log("yes");
        res.render('view', {                       // display register form view
            data: "Hi Mom",
            authenticated: req.session.authenticated,
            names: req.session.fullname,
            nothing: true
        });
      }
    } else {
      return res.redirect('/login');
    }
});


module.exports = router;
