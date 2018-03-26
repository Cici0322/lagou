var mongoose=require('mongoose');

var useschema = mongoose.Schema({
	usename:String,
	pwd:String,
	pwd1:String,
	em:String
});
module.exports=useschema;
