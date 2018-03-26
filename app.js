var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();//使用express  工厂函数	

app.use(express.static("html"));
app.use(express.static("css"));
app.use(express.static("js"));
app.use(express.static("jquery"));
app.use(express.static("uploadcache"));

var upload = require('./util/upload');
//导入model
var regist = require('./model/regist');
var Comment = require('./model/comment');
app.use(bodyParser.json())//处理post请求的参数为json格式
app.use(bodyParser.urlencoded({ //处理post请求为form表单格式
   extended: true
}))
mongoose.Promise = global.Promise;//node下面 没有window 全局是global
mongoose.connect("mongodb://127.0.0.1:27017/lagou")//为了兼容老版本的mongodb
		.then(function(db){
			console.log("数据库对接成功！")
		})

//注册
app.post('/api/regist',function(req,res){
	var r = req.body;
	var use = r.name,pwd = r.pwd,pwd1 = r.pwd1,em = r.em;
	regist.find({usename:use},function(err,doc){
		if(doc.length){
			res.json({
				code:0,
				msg:"账号已存在！！！"
			});
			return
		}else{
			regist.find({em:em},function(err,doc){		
						if(doc.length){
							res.json({
								code:3,
								msg:'该邮箱以存在'
						})
						return
					}else{
					var a = new regist({
							usename:use,
							pwd:pwd,
							pwd1:pwd1,
							em:em
						})
					a.save(function(err,doc){//保存到数据库
						if(err){
							console.log(err);
							return
						};
						res.json({
							code:1,
							msg:"成功注册！！"
						});
					});
				};
			});
		};
	});
});

//登录
app.post('/api/login',function(req,res){
	var c = req.body;
//	console.log(c);
	var name = c.names,pwd2 = c.pwd2;
	regist.find({usename:name},function(err,doc){
		if(doc.length){
			
			if(doc[0].pwd != pwd2){
				res.json({
				code:4,
				msg:"密码错误!"
				})
				return
			}else{
				res.json({
				code:5,
				msg:"登陆成功!"
				})
			}
			
		}else{
			res.json({
			code:6,
			msg:"用户不存在!"
			})
		};
	})
});

//处理图片上传
app.post('/upload',function(req,res){
	upload.upload(req,res)
});

//职位提交
app.post("/upload/comment",(req,res)=>{
	console.log(req.body);
	let {img,zhiwei,gs,exp,type,address,money} = req.body;
	
	var com = new Comment({
		img,
		zwmc:zhiwei,
		gsmc:gs,
		gzjy:exp,
		zwlx:type,
		gzdd:address,
		gwxz:money
	});
	com.save(function(err,doc){
		if(err){
			console.log(err);
			return
		}
		res.json({
			code:7,
			list:doc
		})
	})
})
//处理列表
app.post('/api/comment',function(req,res){
	Comment.count({},function(err,doc){
		if(err){
			return
		};
		res.json({
			code:0,
			list:doc
		})
	})
})
//分页后的
app.post('/api/page',function(req,res){
	var {page} = req.body;
	Comment.find({},null,{skip:(page-1)*5,limit:5},function(err,doc){
		if(err){
			return
		};
		res.json({
			code:0,
			list:doc
		});
	});
});
//删除
app.post('/delete/comment',function(req,res){
	var _id = req.body;
	Comment.findOneAndRemove({_id},function(err){
		if(err){
			return
		};
		res.json({
			code:0,
			msg:"删除成功！！！"
		})
	})
})
//修改
app.post("/update/comment",function(req,res){
	let{_id,img,mc,gs,jy,lx,dd,xz} = req.body;
	Comment.findOneAndUpdate({_id},{
		img:img,
	zwmc:mc,
	gsmc:gs,
	gzjy:jy,
	zwlx:lx,
	gzdd:dd,
	gwxz:xz},{new:true},function(err,doc){
		if(err){
			return
		};
		res.json({
			code:10,
			doc:doc
		})
	})
})

app.listen(8090,function(){
	console.log("变身成功！")
});