"use strict";
const mon = require("./mongooseWrap");
const bcrypt = require('bcryptjs');                         // added for hashing
const User = require("./User");
const saltTurns = 10;
const dbServer = "localhost";
const dbName = "users";

exports.upsertUser = async function (req) {
    let check = { email: req.body.email };
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltTurns)
    });
    try {
        let cs = await mon.upsert(dbServer, dbName, User, user, check);
    } catch(e) {
        console.error(e);
    }
};

exports.verifyUser = async function (req) {
    let check = { email: req.body.email };
    let u = await mon.retrieve(dbServer, dbName, User, check);
    let success = await bcrypt.compare(req.body.password, u[0].password);
    if (success) {
        req.session.authenticated = true;       // set session vars
        req.session.user = u[0].firstName;      // set session vars
        req.session.email = u[0].email;
        req.session.password = u[0].password;
        req.session.fullname = u[0].firstName + " " + u[0].lastName;
    } else {
        req.session = undefined;
    }
    return success;
};
