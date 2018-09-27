$(function(){
	
	var mainUser = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
	var userCode = mainUser.userId;
	var users = {
	    "userCode": userCode,
	    "status":  '0,1'
    }
	var myopenid = JSON.parse(localStorage.getItem('openId'));
//	console.log(users)
	//加密的私钥
    var key = 'HL1HBF6lLND721';
	
//	$('.tab span').click(function(){
//		$(".tab span").eq($(this).index()).addClass("sele").siblings().removeClass('sele');
//      $(".car_list").hide().eq($(this).index()).show();
//	})

	//获取钱包的钱
	var d_per = JSON.parse(sessionStorage.getItem('person_mo'));
//	console.log(d_per.per_mon)
	//获取钱包的钱
	
	//接受网点编码，利用网点编号查询网点车辆列表
	var stationCode = JSON.parse(localStorage.getItem('netcode'));
	
//	console.log(stationCode)
	loaddata(stationCode)
	function loaddata(stationCode){
    	//将json转为字符串
		var aToStr=JSON.stringify(stationCode);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
        //转为字符串，传给后台

        var data_ = str1.toString();

	    var l_lon = 0.011012;
	    var s_lat = 0.003786;
		
		//请求附近网点车辆
	    $.ajax({
			url: adress +'/api/station/car/query',
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
                var netcar_c = JSON.parse(netNum);
               	console.log(netcar_c)
               	$('.load').hide()
               	if(netcar_c.code>0){
               		var caradre = netcar_c.data;
	               	$('.adress_c').html(caradre.stationInfo.stationName);
	               	$('.distance_c').html('据您约'+ caradre.stationInfo.distance.toFixed(2)+'公里');
	               	var carlist = netcar_c.data.carList;
	          		var carnum = '';
	          		if(carlist.length!=0){
	          			for(var i=0;i<carlist.length;i++){
			    			var lon = carlist[i].longitude*1+l_lon*1;
							var sat = carlist[i].latitude*1+s_lat*1;
							carnum += '<li><div class="car_left"><p><img src="http://qsimages.qisu666.com'+carlist[i].carImgPath+'"/></p><p>'+ carlist[i].plateNumber +'</p></div><div class="car_right"><p><i>'+ 
								carlist[i].brandName+carlist[i].carDisposition +'</i><span><img src="../images/dianch.png"/><em>'+ 
								carlist[i].oddPowerForNE +'%</em></span></p><p><span>'+ 
								carlist[i].carSeatNum +'座</span><em>可行驶里程：</em><i>'+ 
								carlist[i].oddMileage +'km</i></p><p><em class="userCar u_car" lat="' + lon + '" lon="'+ sat +'" id="'+ carlist[i].carCode +'">立即订车</em><a href="http://api.map.baidu.com/marker?location='+ sat+','+lon +'&title='+ carlist[i].lastLocationTxt +'&content='+ carlist[i].lastLocationTxt +'&output=html"><img src="../images/dh_button.png"/>导航</a></p></div></li>'
							$('.car_list').html(carnum)
						}
	          		}else{
	          			carnum = '<li style="height:5rem;line-height:5rem;text-align:center;">网点暂无车辆</li>';
	          			$('.car_list').html(carnum)
	          		}

		    		//点击判断是否缴纳押金--用户认证是否通过
		    		$('.userCar').click(function(){
						$(this).each(function(){
							var car_Code = $(this).attr('id');
							var lng = $(this).attr('zlon');
							var lat = $(this).attr('zlat');
							var carid = {
					        	"carCode": car_Code,
					        	"longitude" :lng,
					        	"latitude" : lat
					       }
							var carcode = {
								"car": car_Code
							}
							
							localStorage.setItem('car_Code',JSON.stringify(carid))
							//身份认证
							var userid = {
								"userCode":userCode
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
					        //转为字符串，传给后台
					        var despoint = y_deposit.toString();
					        
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
						               		},2000)
										}
										if(user_msg.code == -1160){
											$('.showmsg').show()
						               		$('.showmsg').html(user_msg.msg+',请等待...')
						               		setTimeout(function(){
						               			$('.showmsg').hide();
						               		},2000)
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
										       			console.log(res)
										       			var des_p = res.data;
														var backdet = decryptByDESModeEBC(des_p,key);
														var back_msg = JSON.parse(backdet);
														console.log(back_msg)
														if(back_msg.code>0){
															console.log(back_msg.msg)
															if(back_msg.data.despositStatus == 1){
																$('.showmsg').show()
											               		$('.showmsg').html('需缴纳押金,正在前往...')
											               		setTimeout(function(){
											               			$('.showmsg').hide();
											               			localStorage.setItem('carnum',JSON.stringify(carcode))
											               			window.location.href = 'pay/promoney.html'
											               		},2000)
															}
															if(back_msg.data.despositStatus == 4){
																$('.showmsg').show()
											               		$('.showmsg').html('需补缴纳押金,正在前往...')
											               		setTimeout(function(){
											               			$('.showmsg').hide();
											               			localStorage.setItem('carnum',JSON.stringify(carcode))
											               			window.location.href = 'pay/promoney.html'
											               		},2000)
															}
															if(back_msg.data.despositStatus == 3){
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
               	}else{
               		var error_list = '<li style="height:100px;line-height:100px;text-align:center;">网络请求失败</li>';
               		$('.car_list').html(error_list)
               	}
			},error:function(){
				console.log('出错了')
			}
		})
	}  
	$('.iknow').click(function(){
		$('.prompt').hide()
	})
			
})
