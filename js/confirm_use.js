$(function(){
	var mainUser = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
    var users ={
	    userCode: mainUser.userId
    } 
    //获取的是预约成功的订单数据
	var p_order = JSON.parse(localStorage.getItem('point_order'));
	console.log(p_order)
	
	//获取的是预约成功的订单数据
	console.log('上边的信息事未完成订单的')
    
    //加密的私钥
    var key = 'HL1HBF6lLND721';
	// 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(113.340993,23.131462);
    map.centerAndZoom(point,12);

	var r_lng = 0.011012;
    var a_lat = 0.003786;

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var icon = new BMap.Icon('../images/xxxx.png', new BMap.Size(32, 64), {
				    anchor: new BMap.Size(32, 64)
				});
			var pt = new BMap.Point(r.point.lng, r.point.lat);
            var mk = new BMap.Marker(pt,{icon:icon})
            map.addOverlay(mk);
            map.panTo(r.point);
        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
    
     function stubGroup(carCode,lng,lat){
        this.carCode=carCode;
        this.lng=lng;
        this.lat=lat;
    }
    
    function addMarker(point,stubGroup){
        var marker=new BMap.Marker(point);
        map.addOverlay(marker);
        marker.addEventListener("click",function(){
            m_selected(stubGroup,point,marker);
        })
    }

	// 点击地图上车辆标记获取车辆信息
    function m_selected(studGroup,point,marker){
        var carcode=studGroup.carCode;
        var lng=studGroup.lng;
        var lat=studGroup.lat;
  	
    }	
    //获取汽车编码
	var Code_car = localStorage.getItem('car_Code');
//	console.log(Code_car)
	
	var car_Id = JSON.parse(localStorage.getItem('car_Code'));
//	console.log(car_Id)
	
	if(p_order != null){
		car_Id.carCode = p_order.data.orderList[0].carCode
	}
    loaddata(car_Id)
	function loaddata(car_Id){
    	
    	//将json转为字符串
		var aToStr=JSON.stringify(car_Id);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
        //转为字符串，传给后台
        var data_ = str1.toString();
	    
	//预约倒计时
    //将json转为字符串
	var dtime=JSON.stringify(users);
	//加密字符串
    var time_s = encryptByDES(dtime,key);
    //转为字符串，传给后台
    var time_z = time_s.toString();
	//预约倒计时
	    
	//根据车辆编码获取车辆信息
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
                var car_order = JSON.parse(netNum).data;
               	console.log(car_order)
               	$('.load').hide()
               	var longit = car_order.longitude*1+r_lng*1;
               	var latit = car_order.latitude*1+a_lat*1;
              	var order_c='';
				order_c = '<div class="tops"><p class="tops_l"><img src="../images/wz.png"/><span>' + car_order.lastLocationTxt + '</span><a href="http://api.map.baidu.com/marker?location='
				+ latit+','+longit +'&title=' + car_order.lastLocationTxt + '&content=' + car_order.lastLocationTxt + '&output=html">导航</a></p><p class="tops_r"><span>预约中:</span><i class="d_time">30:00</i></p></div>'
			
				$('.order_car').append(order_c)

				var caring = '';
				caring += '<div class="deta_car"><div class="car_left"><p><img src="http://qsimages.qisu666.com'+car_order.carImgPath+'"/></p><p>'+ car_order.plateNumber +'</p></div><div class="car_right"><p><i>'+ 
						car_order.brandName+car_order.carDisposition +'</i><span><img src="../images/dianch.png"/><em>'+ 
						car_order.oddPowerForNE +'%</em></span></p><p><span>'+ 
						car_order.carSeatNum +'座</span><em>可行驶里程：</em><i>'+ 
						car_order.oddMileage +'km</i></p><p><span class="userCar get" id="'+ car_order.carCode +'">取车</span><span class="cacle">取消预约</span></p></div></div>'
				
				$('.order_car').append(caring)
				// 网点取车
				$('.get').click(function(){
					$(this).html('取车中...');
					$('.load').show();
					var car_Codes = $(this).attr('id');
					localStorage.setItem('car_id',car_Codes)
					var car_ok = {
			    		carCode : car_Codes
			    	}
			    	//将json转为字符串
					var o_car=JSON.stringify(car_ok);
					//加密字符串
			        var car_str = encryptByDES(o_car,key);
			      
			        //转为字符串，传给后台
			        var cardetails = car_str.toString();
					$.ajax({
				    	url: adress +'/api/tss/car/borrow',
						type:'post',
						data:cardetails,
						async:true,
						withCredentials:true,
						dataType:"json",
						contentType:"application/json;charset=utf-8", 
						beforeSend: function(request) {
			          		request.setRequestHeader("token", token);
			       		},
						success:function(data){
							var times = data.data;
							var times_ing = decryptByDESModeEBC(times,key);
							var qu_car = JSON.parse(times_ing);
							console.log(qu_car)
							//保存取消预约成功的数据，用于取车成功页面
							localStorage.setItem('quCar', JSON.stringify(qu_car.data));
							//保存取消预约成功的数据，用于取车成功页面
		
							//返回判断是否预约成功，成功跳下一页面
			               	if(qu_car.data.status == 1){
			               		$('.load').hide();
//			               		$('.get').html('取车');
			               		window.location.href = 'return_car.html';	
			               		$('.start_one').html('');
			               	}else{
			               		$('.get').html('取车');
			               		$('.load').hide();
			               		$('.showmsg').show()
			               		$('.showmsg').html(qu_car.msg)
			               		setTimeout(function(){
			               			$('.showmsg').hide();
			               		},2000)
			               	}
						}
				    })
				})
				// 取消预约
				$('.cacle').click(function(){
					//获取订单编号--用户userCode
				    var user_data = JSON.parse(localStorage.getItem('key_user'));
					//将json转为字符串
					var q_car=JSON.stringify(user_data);
					//加密字符串
			        var j_car = encryptByDES(q_car,key);
			        //转为字符串，传给后台
			        var cacle_usercar = j_car.toString();
					$.ajax({
				    	url: adress +'/api/tss/order/cancel',
						type:'post',
						data:cacle_usercar,
						async:true,
						withCredentials:true,
						dataType:"json",
						contentType:"application/json;charset=utf-8", 
						beforeSend: function(request) {
			          		request.setRequestHeader("token", token);
			       		},
						success:function(res){
							var car_result = res.data;
							var result_scr = decryptByDESModeEBC(car_result,key);
							var end_result = JSON.parse(result_scr);
							if(end_result.code>0){
								console.log(end_result.msg)
								$('.showmsg').show()
			               		$('.showmsg').html(end_result.msg)
			               		setTimeout(function(){
			               			$('.showmsg').hide();
			               			window.location.href='../index.html'
			               		},2000)
							}else{
								console.log(end_result.msg)
								$('.showmsg').show()
			               		$('.showmsg').html(end_result.msg)
			               		setTimeout(function(){
			               			$('.showmsg').hide();
			               		},2000)
							}
						}
				   })
				})
			},error:function(){
				console.log('出错了')
			}
		})
	    // 获取预约锁定剩余倒计时
	    $.ajax({
	    	url: adress +'/api/tss/order/book/locktime/query',
			type:'post',
			data:time_z,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(data){
//				console.log(data)
				var times = data.data;
				var times_ing = decryptByDESModeEBC(times,key);
				var car_time = JSON.parse(times_ing);
//				console.log(car_time)
				$('.d_time').html('加载中...');
				if(car_time.code>0){
					console.log(car_time.msg)
					//预约倒计时30分钟
				    var y_time = $('.d_time');
				    var allsecont = car_time.data;
				    dao(allsecont)
				}else{
					$('.order_car').html('');
					$('.showmsg').show();
					console.log(car_time.msg)
					$('.showmsg').html('暂无预约车辆')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},6000)
				}
			}
	    })
	} 
	
	function dao(allsecont){
		var minute_time = Math.floor(allsecont/60000);

	    var x = minute_time,
	        interval;
	    var d = new Date("1111/1/1,0:" + x + ":0");
	        interval = setInterval(function() {
	            var m = d.getMinutes();
	            var s = d.getSeconds();
	            m = m < 10 ? "0" + m : m;
	            s = s < 10 ? "0" + s : s;
	         
	            $('.d_time').html(m + ":" + s);
	            if (m == 0 && s == 0) {
	                clearInterval(interval);
	                $('.cacle').click()
	                return;
	            }
	            d.setSeconds(s - 1);
	        }, 1000);
	}
})
