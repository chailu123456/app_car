$(function(){
	var mainUser = JSON.parse(localStorage.getItem('main'));
//	console.log(mainUser)
//	mainUser.userId = '10002167';
	var token ='201801171503190304';
	
	//接收openid
	var key = 'HL1HBF6lLND721';
	
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
	            	window.location.href = 'login.html?openid='+backopenid;
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
	
	//用户id
	var userCode = mainUser.userId;
	console.log(userCode)
	
	var c_style;

	var code_che = JSON.parse(localStorage.getItem('carnum'));
	console.log(code_che)
	if(code_che ==null){
		c_style = {
	    	"userCode": userCode
		}
	}else{
		c_style = {
	    	"userCode": userCode,
	    	"carCode":code_che.car
		}
	}
	//将json转为字符串
	var j_money=JSON.stringify(c_style);
	console.log(c_style)
	//加密字符串
    var str_jn = encryptByDES(j_money,key);
   	//解密字符串
    var s = decryptByDESModeEBC(str_jn,key);
    //转为字符串，传给后台
    var jn_car = str_jn.toString();
    //用户押金信息查询
	$.ajax({
		url: adress +'/api/user/user/deposit',
		type:'post',
		data:jn_car,
		async:true,
		withCredentials:true,
		dataType:"json",
		contentType:"application/json;charset=utf-8", 
		beforeSend: function(request) {
      		request.setRequestHeader("token", token);
   		},
   		success:function(res){
   			var j_back = res.data;
			var cont_back = decryptByDESModeEBC(j_back,key);
            var c_back = JSON.parse(cont_back);
           	console.log(c_back)
           	if(c_back.code>0){
           		var j_mon = c_back.data;
           		if(j_mon.despositStatus == 1){
           			$('h3').html(j_mon.depositMoney)
           		}if(j_mon.despositStatus == 2){
           			$('h3').html(j_mon.depositMoney)
           		}if(j_mon.despositStatus == 3){
           			$('h3').html(j_mon.depositMoney)
           		}if(j_mon.despositStatus == 4){
           			$('h3').html(j_mon.depositMoney)
           		}
           	}
   		}
	})
	//用户押金信息查询
	//获取ip
	var cip = returnCitySN["cip"];
	$('.givem').click(function(){
		var money = $('h3').html()
		var m_data = {
		    "userId": userCode,
		    "totalFee": money,
		    "feeGift" : "0",
		    "spbillCreateIp": cip,
		    "payType": "3",
		    "openId":mainUser.openId
		}
    	//将json转为字符串
		var aToStr=JSON.stringify(m_data);
		//加密字符串
        var strs = encryptByDES(aToStr,key);
        //转为字符串，传给后台
        var cz_user = strs.toString();
		$.ajax({
			url: adress +'/weChat/pay/wxpublic/pay',
			type:'post',
			data:cz_user,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
	   		success:function(res){
	   			console.log(res)
	   			var detailback = res.data;
				var d_back = decryptByDESModeEBC(detailback,key);
	            var w_back = JSON.parse(d_back);
	           	console.log(w_back)
	           	if(w_back.code>0){
	           		var param = w_back.data;
	           		wx.chooseWXPay({
	                    timestamp: param.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
	                    nonceStr: param.nonceStr, // 支付签名随机串，不长于 32 位
	                    package: param.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
	                    signType: "MD5", // 签名方式，默认为´SHA1´，使用新版支付需传入´MD5´
	                    paySign: param.paySign, // 支付签名
	                    success: function (res) {
	                    	console.log(res)
	                        if(res.errMsg == "chooseWXPay:ok"){
	                            //alert("支付成功");
	                           console.log(res)
	                        }else{
	                            alert(res.errMsg);
	                        }
	                    },
	                    cancel: function(res){
	                        //alert(´取消支付´);
	                    }
	                });
	           		
	           	}else {
	           		console.log(w_back.data)
	           	}
	   		}
		})
	})

	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字符串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
			}
		}
		
		return theRequest.code;
	}
	
	
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
		
	
})
