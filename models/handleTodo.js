"use strict";
const mon = require("./mongooseWrap");
const User = require("./User");
const Todo = require("./Todo");
const dbServer = "localhost";
const dbUsers = "users";
const dbTodo = "todos";

exports.upsertTodo = async function (req) {
    let check = { title: req.body.title, todo: req.body.todo };
    let startDate = await new Date(req.body.startDate);
    let endDate = await new Date(req.body.endDate);
    let random = await function randomLine() {
                 var result           = '';
                 var length           = 50;
                 var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                 var charactersLength = characters.length;
                 for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                 }
                 return result;
              };
      let todo = new Todo({
          email: req.session.email,
          title: req.body.title,
          todo: req.body.todo,
          priority: req.body.priority,
          startDate: startDate,
          endDate: endDate,
          random: random()
      });
      try {
          let cs = await mon.upsert(dbServer, dbTodo, Todo, todo, check);
      } catch(e) {
          console.error(e);
      }
};

exports.retrieveTodo = async function (req, sort) {
    let check = { email: req.session.email };
    let nothing = null;
    let u = await mon.retrieve(dbServer, dbTodo, Todo, check, sort);
    if (typeof u != "undefined" && u != null && u.length != null && u.length > 0) {
      console.log("Hi mum");
      return u;
    } else {
      let nothing = false;
      console.log("Hi");
      return nothing
    }
};

exports.modifyTodo = async function (req) {
    let check = { random: req.params.random };
    let startDate = await new Date(req.body.startDate);
    let endDate = await new Date(req.body.endDate);
      let todo = new Todo({
          email: req.session.email,
          title: req.body.title,
          todo: req.body.todo,
          priority: req.body.priority,
          startDate: startDate,
          endDate: endDate,
          random: req.params.random
      });
      try {
          let cs = await mon.upsert(dbServer, dbTodo, Todo, todo, check);
      } catch(e) {
          console.error(e);
      }
};

exports.retrievemodTodo = async function (req, sort) {
    let check = { email: req.session.email, random: req.params.random };
    let nothing = null;
    let u = await mon.retrieve(dbServer, dbTodo, Todo, check, sort);
    if (typeof u != "undefined" && u != null && u.length != null && u.length > 0) {
      console.log("Hi mum");
      return u;
    } else {
      let nothing = false;
      console.log("Hi");
      return nothing
    }
};
