$(function(){
	
	//判断是从哪个页面跳进来的，登陆成功之后返回该页面
	var where = JSON.parse(sessionStorage.getItem('isyes'));    //  num为1时在用车页面  num为2时在充电页面
	//判断是从哪个页面跳进来的，登陆成功之后返回该页面

	// 接收openid
	var geturl = window.location.href;  //获取当前链接
	console.log(geturl)
	var ary = geturl.split('?')[1];  //将当前链接分割为俩部分,获取后面的部分
	var lastopenid = ary.split('=')[1];
	console.log(lastopenid)
		
	//加密的私钥
	var key = 'HL1HBF6lLND721';
	var token ='201801171503190304';
	var countdown = 60; 	
	
	var mainmsg = {
    	"openId": "lastopenid",
    	"token" :token
   }
	//验证电话号码
	function checkPhoneNum(obj){
		if(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(obj)){
			return true;
		}
	}
	var cleart; //计时验证码
	//点击获取验证码
	$('.getnum').click(function(){
		var mobil = $('#mobile').val();
//		var onlymob ="qisu666"+ mobil;
		//加密字符串
//      var msgcodq = encryptByDES(onlymob,key);
//      console.log(typeof msgcodq)
        //转为字符串，传给后台
//      var jmobile = msgcodq.toString();

		var msgdetail = {
			"mobileNo": mobil,
			"tempType":"1",
			"appkey":"qisu666"+mobil
		}
		console.log(msgdetail)
		//调用倒计时
    	var obj = $(this);
		//将json转为字符串
		var msgs=JSON.stringify(msgdetail);
		//加密字符串
        var msgco = encryptByDES(msgs,key);
        //转为字符串，传给后台
        var msgcode = msgco.toString();
        if(checkPhoneNum(mobil)){
        	//倒计时
			settime(obj);
        	$.ajax({
				url: adress +'/weChat/sms/send/type',
				type:'post',
				data:msgcode,
				async:true,
				withCredentials:true,
				dataType:"json",
				contentType:"application/json;charset=utf-8", 
				beforeSend: function(request) {
	          		request.setRequestHeader("token", token);
	       		},
	       		success:function(res){
	       			var times = res.data;
					var times_ing = decryptByDESModeEBC(times,key);
					var qu_log = JSON.parse(times_ing);
					console.log(qu_log)
					if(qu_log.code>0){
						$('.showmsg').show()
	               		$('.showmsg').html('短信发送成功')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}else {
						clearTimeout(cleart);
				 		obj.attr('disabled',false); 
				        obj.html("获取验证码");
				        countdown = 60; 
				        
						$('.showmsg').show()
	               		$('.showmsg').html(qu_log.msg)
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}
	       		}
			})
        }else {
        	$('p').html('手机号格式有误')
        	$('p').show().fadeOut(3000);
        }
	})
	var mob;
	//立即注册验证验证码是否正确
	$('.go_login').click(function(){
		mob = $('#mobile').val();
		var backmsg = $('.msgback').val();
		var passwords = $('#proving').val();
		//加密密码     密码MD5加密
		var passw = $.md5(passwords);
		var infos = {
			"mobileNo" : mob,
			"verifyCode" : backmsg
		}
		$('.load').show()
		//将json转为字符串
		var msgb=JSON.stringify(infos);
		//加密字符串
        var bcode = encryptByDES(msgb,key);
        //转为字符串，传给后台
        var msgbcode = bcode.toString();
		//验证码验证是否与后台一样
		if(checkPhoneNum(mob) && backmsg.length !='' && passwords.length !=''){
			$.ajax({
				url: adress +'/weChat/sms/msg/verify',
				type:'post',
				data:msgbcode,
				async:true,
				withCredentials:true,
				dataType:"json",
				contentType:"application/json;charset=utf-8", 
				beforeSend: function(request) {
	          		request.setRequestHeader("token", token);
	       		},
	       		success:function(res){
	       			var registid = res.data;
					var times_ing = decryptByDESModeEBC(registid,key);
					var successId = JSON.parse(times_ing);
					$('.load').show()
					if(successId.code>0){
						var lastmsg = {
							"mobileNo" : mob,
							"loginPwd" : passw,
							"verify"  : backmsg,
							"openId": lastopenid
						}
						//将json转为字符串
						var lmsgb=JSON.stringify(lastmsg);
						//加密字符串
				        var lcode = encryptByDES(lmsgb,key);
				        //转为字符串，传给后台
				        var lmsgbcode = lcode.toString();
				        if(passwords.length>5){
				        	$.ajax({
					        	url: adress +'/weChat/user/register',
								type:'post',
								data:lmsgbcode,
								async:true,
								withCredentials:true,
								dataType:"json",
								contentType:"application/json;charset=utf-8", 
								beforeSend: function(request) {
					          		request.setRequestHeader("token", token);
					       		},
					       		success:function(res){
					       			var ti= res.data;
									var times_i= decryptByDESModeEBC(ti,key);
									var getids = JSON.parse(times_i);
									console.log(getids)
									$('.load').hide()
									if(getids.code>0){
										$('.showmsg').show()
					               		$('.showmsg').html('注册成功');
					               		mainmsg.userId = getids.data.userId;
					               		if(where.num==1){
				               				localStorage.setItem('main', JSON.stringify(mainmsg));
				               				setTimeout(function(){
				               					window.location.href = 'index.html'
				               				},1000)
					               		}else{
					               			localStorage.setItem('main', JSON.stringify(mainmsg));
					               			setTimeout(function(){
					               				window.location.href = 'html/cd/cd_index.html'
					               			},1000)
					               		}
									}else {
										$('.showmsg').show()
					               		$('.showmsg').html(getids.msg)
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               		},2000)
									}
					       		}
					        })
				        }else {
				        	$('.load').hide()
				        	$('.showmsg').show()
				       		$('.showmsg').html('密码不能少于6位，请重新设置密码')
				       		setTimeout(function(){
				       			$('.showmsg').hide();
				       		},2000)
				        }
					}else {
						$('.load').hide()
						$('.showmsg').show()
			       		$('.showmsg').html(successId.msg)
			       		setTimeout(function(){
			       			$('.showmsg').hide();
			       		},2000)
					}
	       		}
			})
		}else{
			$('.load').hide()
			$('.showmsg').show()
       		$('.showmsg').html('请输入完整信息')
       		setTimeout(function(){
       			$('.showmsg').hide();
       		},2000)
		}
	})
	function settime(obj) { //发送验证码倒计时
	    if (countdown == 0) { 
	        obj.attr('disabled',false); 
	        obj.html("获取验证码");
	        countdown = 60; 
	        return;
	    } else { 
	        obj.attr('disabled',true);
	        obj.html(countdown+'s');
	        countdown--; 
	    } 
		cleart = setTimeout(function() { 
	   		settime(obj)
	    },1000) 
	}
})
    // DES加密
    function encryptByDES(message,key) {
	    //把私钥转换成16进制的字符串
	
	    var keyHex = CryptoJS.enc.Utf8.parse(key);
	    //模式为ECB padding为Pkcs7
	    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
	        mode: CryptoJS.mode.ECB,
	        padding: CryptoJS.pad.Pkcs7
	    });
	    //加密出来是一个16进制的字符串
	    return encrypted.ciphertext.toString();
	
	}
//DES  ECB模式解密
function decryptByDESModeEBC(ciphertext,key) {
	
    //把私钥转换成16进制的字符串
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    //把需要解密的数据从16进制字符串转换成字符byte数组
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    //以utf-8的形式输出解密过后内容
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}