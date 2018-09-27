$(function(){
	//记录该页面值，登陆成功之后返回该页面
   	var itis = {
		"num" : 2
	}
	sessionStorage.setItem('isyes', JSON.stringify(itis))
   	//记录该页面值，登陆成功之后返回该页面
	//加密的私钥
   	var key = 'HL1HBF6lLND721';

	//看有没有userid
	//获取openid	
	
	var mainUser = JSON.parse(localStorage.getItem('main'));
	if(mainUser == null ||mainUser.userId ==''|| mainUser.userId == null || mainUser.openId ==null || mainUser.openId ==''){
		mainUser = {};
	} 
	
	//code
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
	            	localStorage.setItem('main', JSON.stringify(mainUser));
	            }else if(w_get.code== -1006){
	            	backopenid = w_get.data.openId; //得到openid
	            	window.location.href = '../../login.html?openid='+backopenid;
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

	
	
	//看有没有userid
//	user = "10002167";
	console.log(mainUser.userId)
	var token = "201801171503190304";

   	$('.m_wallet').click(function(){
   		localStorage.setItem('openId', JSON.stringify(wxid));
   		window.location.href = '../pay/mywallet.html'
   	})
   	
   	
   	//用户金额
   	var my_mo = {};

   	//个人信息查询
   	
   	if(mainUser!=null && mainUser.userId !=null){
	   	var person = {
			"userId": mainUser.userId,
			"pageIndex":"1",
			"pageNum":"20"
		}
	   	var per_cen = JSON.stringify(person);
		//加密字符串
	    var str_p = encryptByDES(per_cen,key);
	
	    //转为字符串，传给后台
	    var personal = str_p.toString();
	   	$.ajax({
	   		url: adress+'/weChat/acctinfo/query',
			type:'post',
			data:personal,
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
					my_mo.per_mon = mymoney;
					sessionStorage.setItem('person_mo', JSON.stringify(my_mo));
				}else{
					$('.showmsg').show()
	           		$('.showmsg').html('账户信息'+per_det.msg)
	           		setTimeout(function(){
	           			$('.showmsg').hide();
	           		},2000)
				}
	   		}
	   	})
   	}
   	//个人信息查询
   	
   	var uesrid = {
		"userId": mainUser.userId
	}
   	console.log(mainUser.userId)

	//判断是否有订单未完成
	var aredode = JSON.stringify(uesrid);
	//加密字符串
    var strid = encryptByDES(aredode,key);
   	//解密字符串
    var stats = decryptByDESModeEBC(strid,key);
    //转为字符串，传给后台
    var rcodes = strid.toString();
    function ord(){
		$.ajax({
			url: adress+'/weChat/charge/order/status/query',
			type:'post',
			data:rcodes,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
	   		success:function(res){
				var e_type = res.data;
				var ord_type = decryptByDESModeEBC(e_type,key);
				var backord = JSON.parse(ord_type)
				console.log(backord)
				if(res.code>0){
					if(backord.orderStatus == 02 ||backord.orderStatus == 03 || backord.orderStatus == 01){
						setTimeout(function(){
			       			window.location.href = 'now_elec.html'
			       		},2000)
					}
				}
	   		}
		})
	}
    ord()
 
    
	$('.s_code').click(function(){
		window.location.href='s_cd.html'
	})
	
	$('.maps').click(function(){
		window.location.href ='mapelec.html'
	})	
	
	//扫一扫
	$('.sm_code').click(function(){
		if(my_mo.per_mon<0){
			$('.showmsg').show();
       		$('.showmsg').html('余额不足,请充值');
       		setTimeout(function(){
       			$('.showmsg').hide();
       		},2000)
		}else{
			wx.scanQRCode({
			    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res) {
			    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果  
			  		setTimeout(queryPile,1000)
		    		function queryPile(){
			    		var sm_cd = {
						   "userId": mainUser.userId,
						   "gunCode": result
						}
						var ared = JSON.stringify(sm_cd);
						//加密字符串
					    var std = encryptByDES(ared,key);
					    //转为字符串，传给后台
	        			var sm_u = std.toString();
						$.ajax({
							type:'post',
							url: adress+'/weChat/pile/records/query',
							data:sm_u,
							async:true,
							withCredentials:true,
							dataType:"json",
							contentType:"application/json;charset=utf-8", 
							beforeSend: function(request) {
					      		request.setRequestHeader("token", token);
					   		},
					   		success:function(res){
					   			var e_ord = res.data;

								var ordNum = decryptByDESModeEBC(e_ord,key);
								var allorder = JSON.parse(ordNum)
								console.log(allorder)
								if(allorder.code>0){
									sessionStorage.setItem('guncode', result);
									window.location.href='stationdetails.html';
								}else{
									$('.showmsg').show();
				               		$('.showmsg').html(allorder.msg);
				               		setTimeout(function(){
				               			$('.showmsg').hide();
				               		},2000)
								}
					   		}
						})
					}
				}
			});
		}		
	})	
	//扫一扫
})
