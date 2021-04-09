const User = require('./User')

let Users = function() {
	this.users = [];
}
Users.prototype.addUser = function(_User){
    this.users[this.users.length] = _User
}
Users.prototype.getUsers = function(){
    _Users = this.users
    return _Users
}
Users.prototype.getUser = function(_student){
    this.users[this.users.length] = _student
}

module.exports = Users