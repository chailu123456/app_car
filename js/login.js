$(function(){

	//判断是从哪个页面跳进来的，登陆成功之后返回该页面
	var where = JSON.parse(sessionStorage.getItem('isyes'));  //  num为1时在用车页面  num为2时在充电页面
	console.log(where)
	//判断是从哪个页面跳进来的，登陆成功之后返回该页面 

	var key = 'HL1HBF6lLND721';
	var token ='201801171503190304';

	var geturl = window.location.href;  //获取当前链接
	console.log(geturl)
	var ary = geturl.split('?')[1];  //将当前链接分割为俩部分,获取后面的部分
	var lastopenid = ary.split('=')[1];
	console.log(lastopenid)
	
	var mainmsg = {
    	"openId": lastopenid,
    	"token" :token
    }
	//输入手机号，密码判断是否已经注册过；
	$('.yzlogin').click(function(){
		var passwords = $('#proving').val();
		var mob = $('#mobile').val();
		$('.load').show()
		//加密字符串     密码MD5加密
		var passw = $.md5(passwords);
		var lastmsg = {
			"mobileNo" :mob,
			"loginPwd" :passw,
			"openId": lastopenid
		}
		//将json转为字符串
		var lmsgb=JSON.stringify(lastmsg);
		//加密字符串
        var lcode = encryptByDES(lmsgb,key);
        //解密字符串
        var sta = decryptByDESModeEBC(lcode,key);
        //转为字符串，传给后台
        var lmsgbcode = lcode.toString();
        if(checkPhoneNum(mob) && passwords.length!=0){
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
	       			$('.load').hide()
	       			var ti= res.data;
					var times_i= decryptByDESModeEBC(ti,key);
					var q_c = JSON.parse(times_i);
					console.log(q_c)  //需要给我返回userid
					console.log(q_c.data.userId)  
					if(q_c.code>0){
						$('.showmsg').show()
	               		$('.showmsg').html('登陆成功，正在跳转首页...');
	               		
					    mainmsg.userId = q_c.data.userId;
					    
	               		$('.showmsg').hide();
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
					}else if(q_c.code== -1031){
						$('.showmsg').show();
	               		$('.showmsg').html(q_c.msg+'如忘记密码，请去App进行密码找回');
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}else {
						$('.showmsg').show();
	               		$('.showmsg').html(q_c.msg+',正在前往注册');
	               		setTimeout(function(){
	               			$('.showmsg').hide();
						   	window.location.href = 'register.html?openid='+lastopenid;
	               		},3000)
					}
	       		}
	        })
        }else {
        	$('.load').hide()
        	$('.showmsg').show()
       		$('.showmsg').html('手机号或密码输入有误')
       		setTimeout(function(){
       			$('.showmsg').hide();
       		},2000)
        }
	})
	
	$('.goregist').click(function(){
	  window.location.href = 'register.html?openid='+lastopenid;
	})
	
	function settime(obj) { //发送验证码倒计时
	    if (countdown == 0) { 
	        obj.attr('disabled',false); 
	        obj.val("获取验证码");
	        countdown = 60; 
	        return;
	    } else { 
	        obj.attr('disabled',true);
	        obj.val(countdown+'s');
	        countdown--; 
	    } 
		setTimeout(function() { 
	   		settime(obj)
	    },1000) 
	}
	
})

//验证电话号码
	function checkPhoneNum(obj){
		if(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(obj)){
			return true;
		}
	}
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