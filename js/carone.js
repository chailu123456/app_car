$(function(){
	var mainUser = JSON.parse(localStorage.getItem('main'));
	
	var token ='201801171503190304';

	//获取钱包的钱
	var d_per = JSON.parse(sessionStorage.getItem('person_mo'));
//	console.log(d_per.per_mon)
	//获取钱包的钱
	var myopenid = JSON.parse(localStorage.getItem('openId'));
	//用户id
	var userCode = mainUser.userId;
	//接受车辆code，经纬度
	var car_cd = JSON.parse(localStorage.getItem('car_a'));
//	console.log(car_cd)
	loaddata(car_cd);
	function loaddata(car_cd){
		var l_lons = 0.011012;
		var s_lats = 0.003786;
	    //加密的私钥
    	var key = 'HL1HBF6lLND721';
    	//将json转为字符串
		var aToStr=JSON.stringify(car_cd);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);

       	//解密字符串
        var str2 = decryptByDESModeEBC(str1,key);
//      console.log(str2)
        //转为字符串，传给后台
        var data_ = str1.toString();

		//请求附近网点
	    $.ajax({
			url: adress +'/api/car/info/query',
			type:'post',
			data:data_,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(data){
				var carNet = data.data;
				var netNum = decryptByDESModeEBC(carNet,key);
                var netcar_ = JSON.parse(netNum);
	    		var cardetail = netcar_.data;
	    		console.log(cardetail)
	    		$('.load').hide()
				var carnum = '';
				var s_lat = cardetail.latitude*1+s_lats*1;
				var l_lon = cardetail.longitude*1+l_lons*1;
				
				carnum += '<li><div class="car_left"><p><img src="http://qsimages.qisu666.com'+cardetail.carImgPath+'"/></p><p>'+ cardetail.plateNumber +'</p></div><div class="car_right"><p><i>'+ 
					cardetail.brandName+cardetail.modelNumber +'</i><span><img src="../images/dianch.png"/><em>'+ 
					cardetail.oddPowerForNE +'%</em></span></p><p><span>'+ 
					cardetail.carSeatNum +'座</span><em>可行驶里程：</em><i>'+ 
					cardetail.oddMileage +'km</i></p><p><em class="userCar" id="'+ cardetail.carCode +'" href="#">立即订车</em><a href="http://api.map.baidu.com/marker?location='+ s_lat+','+l_lon+'&title='+ cardetail.lastLocationTxt +'&content='+ cardetail.lastLocationTxt +'&output=html"><img src="../images/dh_button.png"/>导航</a></p></div></li>'
				$('.marker_car').html(carnum)
				
				$('.userCar').click(function(){
					$(this).each(function(){
						var car_Code = $(this).attr('id');
						var carid = {
				        	"carCode": car_Code,
				        }
						localStorage.setItem('car_Code',JSON.stringify(carid))
						//身份认证
						var userid = {
							"userCode":userCode
						}
						var carcode = {
							"car": car_Code
						}
						//将json转为字符串
						var userdet = JSON.stringify(userid);
						//加密字符串
				        var y_userdet = encryptByDES(userdet,key);
				
						//押金是否缴纳
						var judge = {
							"userCode":userCode,
							"carCode":car_Code 
						}
						//将json转为字符串
						var deposit_a=JSON.stringify(judge);
						//加密字符串
				        var y_deposit = encryptByDES(deposit_a,key);
				        //解密字符串
    					var str22 = decryptByDESModeEBC(y_deposit,key);
    					console.log(str22)
				        //转为字符串，传给后台
				        var despoint = y_deposit.toString();
						console.log(despoint)
						//判断钱包是否为负
				        if(d_per.per_mon<0){
				        	$('.showmsg').show()
		               		$('.showmsg').html('余额不足，请充值')
		               		setTimeout(function(){
		               			$('.showmsg').hide();
		               		},2000)
				        }else{
							$.ajax({
								url: adress +'/api/auth/info/query',
								type:'post',
								data:y_userdet,
								async:true,
								withCredentials:true,
								dataType:"json",
								contentType:"application/json;charset=utf-8", 
								beforeSend: function(request) {
					          		request.setRequestHeader("token", token);
					       		},
					       		success:function(res){
					       			var user_p = res.data;
									var user_ids = decryptByDESModeEBC(user_p,key);
									var user_msg = JSON.parse(user_ids);
									console.log(user_msg)
									if(user_msg.code == -1145){
										$('.showmsg').show()
					               		$('.showmsg').html(user_msg.msg+',正在前往认证')
					               		setTimeout(function(){
					               			localStorage.setItem('carnum',JSON.stringify(carcode))
					               			$('.showmsg').hide();
					               		},20000)
									}
									if(user_msg.code == -1160){
										$('.showmsg').show()
					               		$('.showmsg').html(user_msg.msg+',请等待...')
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               		},20000)
									}
									if(user_msg.code>0){
										if(user_msg.code ==1163){
											$('.showmsg').show()
						               		$('.showmsg').html(user_msg.msg)
						               		setTimeout(function(){
						               			window.location.href = 'identity.html'
						               			$('.showmsg').hide();
						               		},2000)
										}
										if(user_msg.code ==1164){
											$('.showmsg').show()
						               		$('.showmsg').html(user_msg.msg)
						               		setTimeout(function(){
						               			window.location.href = 'drivelince.html'
						               			$('.showmsg').hide();
						               		},2000)
										}
										if(user_msg.data.idcardIsAuth!=1){
											$('.showmsg').show()
						               		$('.showmsg').html('身份证未认证，正在前往认证')
						               		setTimeout(function(){
						               			localStorage.setItem('carnum',JSON.stringify(carcode))
						               			window.location.href = 'identity.html'
						               			$('.showmsg').hide();
						               		},2000)
										}if(user_msg.data.licenseIsAuth!=1){
											$('.showmsg').show()
						               		$('.showmsg').html('驾驶证未认证，正在前往认证')
						               		setTimeout(function(){
						               			localStorage.setItem('carnum',JSON.stringify(carcode))
						               			window.location.href = 'drivelince.html'
						               			$('.showmsg').hide();
						               		},2000)
										}
										if(user_msg.data.idcardIsAuth==1 && user_msg.data.licenseIsAuth==1){
											$.ajax({
												url: adress +'/api/user/user/deposit',
												type:'post',
												data:despoint,
												async:true,
												withCredentials:true,
												dataType:"json",
												contentType:"application/json;charset=utf-8", 
												beforeSend: function(request) {
									          		request.setRequestHeader("token", token);
									       		},
									       		success:function(res){
									       			var des_p = res.data;
													var backdet = decryptByDESModeEBC(des_p,key);
													var back_msg = JSON.parse(backdet);
												
													if(back_msg.code>0){
														console.log(back_msg.msg)
														if(back_msg.data.despositStatus == 1){
															$('.showmsg').show()
										               		$('.showmsg').html('需缴纳押金')
										               		setTimeout(function(){
										               			$('.showmsg').hide();
										               			localStorage.setItem('carnum',JSON.stringify(carcode))
										               			window.location.href = 'pay/promoney.html'
										               		},2000)
														}
														if(back_msg.data.despositStatus ==4){
															$('.showmsg').show()
										               		$('.showmsg').html('需补缴纳押金')
										               		setTimeout(function(){
										               			$('.showmsg').hide();
										               			localStorage.setItem('carnum',JSON.stringify(carcode))
										               			window.location.href = 'pay/promoney.html'
										               		},2000)
														}
														if(back_msg.data.despositStatus ==3){
													
															window.location.href = 'car_detail.html'
														}	
													}else{
														$('.showmsg').show()
									               		$('.showmsg').html(back_msg.msg)
									               		setTimeout(function(){
									               			$('.showmsg').hide();
									               		},2000)
													}
									       		}
									      	})
										}
									}else if(user_msg.code == -1159){
										$('.showmsg').show()
					               		$('.showmsg').html(user_msg.msg)
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               		},2000)
									}else if(user_msg.code == -1160){
										$('.showmsg').show()
					               		$('.showmsg').html(user_msg.msg)
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               		},2000)
									}else{
										$('.showmsg').show()
					               		$('.showmsg').html(user_msg.msg)
					               		setTimeout(function(){
					               			$('.showmsg').hide();
					               			window.location.href = 'identity.html'
					               		},2000)
									}
					       		}
					     	})
						}
			    	})
			    })
		
			},error:function(){
				console.log('出错了')
			}
		})
	 }  
	
	$('.iknow').click(function(){
		$('.prompt').hide()
	})
	
	$('.userCar').click(function(){
		console.log($(this).attr('id'));
		window.location.href = 'car_detail.html'
	})
	
	
})
