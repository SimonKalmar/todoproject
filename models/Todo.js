const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    todo: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000)
    },
    random: {
        type: String,
      }
});

/*
userSchema.methods.getFullName = function () {
    return `Name: ${this.firstName} ${this.lastName}`;
}

userSchema.methods.getInfo = function () {
    return `${this.getFullName()}, Email: ${this.email}, Zipcode: ${this.zipcode}`;
}

userSchema.methods.getCredentials = function () {
    return `${this.email}\t${this.password}`;
}
*/

module.exports = mongoose.model("Todo", todoSchema, 'todo');
