var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
	img:String,
	zwmc:String,
	gsmc:String,
	gzjy:String,
	zwlx:String,
	gzdd:String,
	gwxz:String
});
module.exports = CommentSchema;
