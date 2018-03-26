var mongoose = require('mongoose');
var use = require('../schema/regist');
var cc = mongoose.model('regist',use);

module.exports = cc;
