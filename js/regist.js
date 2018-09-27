$(function(){
	var key = 'HL1HBF6lLND721';
	var token ='201801171503190304';
	//获取openid
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	var code = getQueryString("code")
	
	getopenid();
	
	var backopenid;  //openid
	function getopenid() {
	    var m_data = {
	        "code" : code
	    }
	    //将json转为字符串
	    var aToStr=JSON.stringify(m_data);
	    //加密字符串
	    var strs = encryptByDES(aToStr,key);
	    //转为字符串，传给后台
	    var givecode = strs.toString();
	    $.ajax({ 
	        async: false, 
	        url: adress+"/weChat/user/getOpenId",
	        type: "post", 
	        dataType:"json",
	        data: givecode,
	        contentType:"application/json;charset=utf-8", 
	        success: function(result){ 
	            var wxdetail = result.data;
	            var wx_back = decryptByDESModeEBC(wxdetail,key);
	            var w_get = JSON.parse(wx_back);
	            console.log(w_get)  
	            if(w_get.code>0){
	            	backopenid = w_get.data.openId; //得到openid
	            }else if(w_get.code== -1006){
	            	backopenid= w_get.data.openId; //得到openid
//	            	window.location.href = 'login.html?openid='+backopenid;
	            }else{
	            	$('.showmsg').hide()
	           		$('.showmsg').html(w_get.msg)
	           		setTimeout(function(){
	           			$('.showmsg').hide();
	           		},2000)
	            }
	        }, 
	        error: function (jqXHR, textStatus, errorThrown) { 
	            console.log(textStatus); 
	        } 
	    });
    }
	//获取openid	
		
	//加密的私钥
	
	var countdown = 60; 	

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
		console.log(backopenid)
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
							"openId": backopenid
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
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               		},2000)
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