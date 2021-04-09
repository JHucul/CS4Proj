let User = function(_name, _passwd){
    this.name = _name
    this.passwd = _passwd
}
function getPasswd(){
    _passwd = this.passwd
    return _passwd
}
function getName(){
    _name = this.name
    return _name
}
function setPasswd(_passwd){
    this.passwd = _passwd
}
function setName(_name){
    this.name = _name
}
module.exports = User