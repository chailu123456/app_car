$(function(){
	var token = "201801171503190304";
	var key = 'HL1HBF6lLND721';
	//接收userid和token
	var mainUser = JSON.parse(localStorage.getItem('main'));
	console.log(mainUser)
	
	if(mainUser == null ||mainUser.userId ==''|| mainUser.userId == null || mainUser.openId ==null || mainUser.openId ==''){
		mainUser = {};
	} 
	//获取openid
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	
	var code = getQueryString("code")
	
	getopenid();
	
	var backopenid;  //openid
	var backuserid;  //userid
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
	            	backuserid = w_get.data.userId; //得到userid
	            	mainUser.openId = backopenid;
	            	mainUser.userId = backuserid;
	            	mainUser.token = token;
	            	localStorage.setItem('main', JSON.stringify(mainUser));
	            }else if(w_get.code== -1006){
	            	backopenid = w_get.data.openId; //得到openid
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
//	mainUser.userId = 10002167;
	if(mainUser!=null && mainUser.userId !=null){
		var users = {
		    "userCode": mainUser.userId,
		    "status":  '0,1'
	    }
		
		//查询账户信息
	   	var personl = {
			"userId": mainUser.userId,
			"pageIndex":"1",
			"pageNum":"20"
		}
	   	var per_ceng = JSON.stringify(personl);
		//加密字符串
	    var str_pin = encryptByDES(per_ceng,key);
	    //转为字符串，传给后台
	    var find_per = str_pin.toString();
	   	$.ajax({
	   		url: adress+'/weChat/acctinfo/query',
			type:'post',
			data:find_per,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
	   		success:function(res){
				var p_type = res.data;
				var prd_type = decryptByDESModeEBC(p_type,key);
				var per_det = JSON.parse(prd_type)
				console.log(per_det)
				if(per_det.code>0){
					$('.per_mobile').html(per_det.data.mobileNo);
					var mymoney = per_det.data.totalMoney;
					var my_mo = {
						"per_mon": mymoney
					}
					$('h3').html(mymoney)
					sessionStorage.setItem('person_mo', JSON.stringify(my_mo));
					$('.accoutnum').html(per_det.data.mobileNo)
				}else{
					$('.showmsg').show()
	           		$('.showmsg').html('账户信息'+per_det.msg)
	           		setTimeout(function(){
	           			$('.showmsg').hide();
	           		},2000)
				}
	   		}
	   	})
	//查询账户信息
	}
	
	//接收userid和token
	
	//用户id
	var userCode = mainUser.userId;
	
//	var d_per = JSON.parse(sessionStorage.getItem('person_mo'));
//	$('h3').html(d_per.per_mon)
	
	var c_style = {
	    "userCode": userCode
	}
	//将json转为字符串
	var ctostr=JSON.stringify(c_style);
	//加密字符串
    var strsq = encryptByDES(ctostr,key);
   	//解密字符串
    var strg = decryptByDESModeEBC(strsq,key);
    //转为字符串，传给后台
    var czhi = strsq.toString();
	$.ajax({
		url: adress +'/api/pay/donate',
		type:'post',
		data:czhi,
		async:true,
		withCredentials:true,
		dataType:"json",
		contentType:"application/json;charset=utf-8", 
		beforeSend: function(request) {
      		request.setRequestHeader("token", token);
   		},
   		success:function(res){
   			var d_bg= res.data;
			var d_back = decryptByDESModeEBC(d_bg,key);
            var md_back = JSON.parse(d_back);
           	console.log(md_back)
           	if(md_back.code>0){
           		var lists = md_back.data;
           		var dif_money = '';
           		for(var i=0;i<lists.length;i++){
           			var givemon = lists[i].giftQuota*1+lists[i].minimumRecharge*1;
           			dif_money +='<li><p>充<i>'+ lists[i].minimumRecharge +'</i>元</p><span>到账<i>'+ givemon +'</i>元</span></li>'
           			$('.select_money').html(dif_money)
           		}
           			//选取充值金额
				$('.select_money li').click(function(){
					$(this).each(function(){
			    		$(this).addClass('on').siblings().removeClass('on');	
			    		var get_money = ($(this).children('p').children('i').html());
			    		$('input').val(get_money);
			    		var getMoney = $(this).children('span').children('i').html();
						$('.getmony').show();
						$('.realy_money').html(getMoney)
			    	})
				})
				//选取充值金额
           	}else {
           		$('.showmsg').show()
           		$('.showmsg').html(md_back.msg)
           		setTimeout(function(){
           			$('.showmsg').hide();
           		},2000)
           	}
   		}
	})
	$("input").focus(function(){
		$('.getmony').hide();
		$('.prompt').hide(500)
	});
	
	// 选择充值方式
	$('.seles').click(function(){
		$(this).attr('src','../images/sele_a.jpg');
		$(this).attr('id','123');
		$('.no_seles').attr('src','../images/sele_b.jpg')
		$('.no_seles').removeAttr('id');
	})
	$('.no_seles').click(function(){
		console.log('huu')
		$(this).attr('src','../images/sele_a.jpg');
		$(this).attr('id','123');
		$('.seles').attr('src','../images/sele_b.jpg')
		$('.seles').removeAttr('id');
	})
	// 选择充值方式

	//获取ip
	var cip = returnCitySN["cip"];

//	  console.log(returnCitySN["cip"]+','+returnCitySN["cname"])  
	
	//确定充值
	$('.recharge').click(function(){
		var z_mon = $('.realy_money').html()
		var money = $('.change').val();
		var giftmoney;
		if(parseInt(money)<500){
			giftmoney = 0
		}if(500< parseInt(money)&&parseInt(money) < 5000){
			giftmoney = 50;
		}if(parseInt(money)==500){
			giftmoney = 200
		}if(parseInt(money)==5000){
			giftmoney = 1000
		}if(5000< parseInt(money)&&parseInt(money) < 10000){
			giftmoney = 1000;
		}if(parseInt(money)>=10000){
			giftmoney = 3000
		}
		if(money == ''){
			$('.prompt').show(300);
			setTimeout(function(){
       			$('.prompt').hide();
       		},2000)
		}else{
			var m_data = {
			    "userId": userCode,
			    "totalFee": money,
			    "feeGift": giftmoney,
			    "spbillCreateIp": cip,
			    "payType": "1",
			    "openId":mainUser.openId
			}			
	    	//将json转为字符串
			var aToStr=JSON.stringify(m_data);
			//加密字符串
	        var strs = encryptByDES(aToStr,key);
	       	//解密字符串
	        var str2 = decryptByDESModeEBC(strs,key);
	        console.log(str2)
	        //转为字符串，传给后台
	        var cz_user = strs.toString();
			console.log(cz_user)
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
	                                alert("支付成功");
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
	               		$('.showmsg').show()
	               		$('.showmsg').html(w_back.msg)
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
	               	}
	       		}
			})
		}
	})
	//确定充值	
})
