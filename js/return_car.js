$(function(){
	
	var mainUser = JSON.parse(localStorage.getItem('main'));
	var token = "201801171503190304";
	var userId = mainUser.userId;

	//租车进行中的订单查询，用于更新时间
	var users ={
	    userCode: userId,
	    status:  '0,1'
    }
	//租车进行中的订单查询，用于更新时间

	 //加密的私钥
   	var key = 'HL1HBF6lLND721';
	var r_lng = 0.011012;
    var a_lat = 0.003786;

	//获取的是正在进行的订单数据
	var e_order = JSON.parse(localStorage.getItem('s_order'));
	console.log(e_order)
	//获取的是正在进行的订单数据
	console.log('上边的信息事未完成订单的')
	
	var user_data = JSON.parse(localStorage.getItem('key_user'));
    console.log(user_data)

	//车牌
	var car_get = localStorage.getItem('car_id');
	console.log(car_get)
	if(e_order != null) {
		car_get = e_order.data.orderList[0].car.carCode;
	}
	console.log(car_get)
	localStorage.setItem('car_Id',car_get)
	
	//将json转为字符串
	var dtime=JSON.stringify(users);
	//加密字符串
    var time_s = encryptByDES(dtime,key);
    //转为字符串，传给后台
    var time_z = time_s.toString();
    //解密字符串
    var st = decryptByDESModeEBC(time_z,key);
    
    var timeIndex;
	
	//租车进行中的订单查询
	$.ajax({
    	url: adress +'/api/tss/order/query/map',
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
			var times = data.data;
			var times_ing = decryptByDESModeEBC(times,key);
			var car_time = JSON.parse(times_ing);

			var longit = car_time.data.orderList[0].car.longitude*1+r_lng*1;
            var latit = car_time.data.orderList[0].car.latitude*1+a_lat*1;
			if(car_time.code>0){
				var orderstatus = car_time.data.orderList[0].status;
				console.log(car_time.data.orderList[0].status)
				var cartimeing = car_time.data.orderList[0];
				console.log(cartimeing)
				var car_det = '';
				car_det += '<div class="deta_car"><div class="car_left"><p><img src="http://192.168.1.203:18080'+cartimeing.car.carImgPath+'"/></p><p>'+ cartimeing.car.plateNumber +'</p></div><div class="car_right"><p><i>'+ 
						cartimeing.car.carBrandModels.brandName+cartimeing.car.carBrandModels.carDisposition +'</i><span><img src="../images/dianch.png"/><em>'+ 
						cartimeing.car.oddPowerForNE +'%</em></span></p><p><span>'+ 
						cartimeing.car.carSeatNum +'座</span><em>可行驶里程：</em><i>'+ 
						cartimeing.car.oddMileage +'km</i></p><p><a href="http://api.map.baidu.com/marker?location='+ latit+','+longit +'&title=&content=&output=html">导航</a></p></div></div>'
				$('.car_det').append(car_det)
				timeIndex = (cartimeing.updatedTimeLong*1 - cartimeing.borrowTimeLong*1)/1000;
				if(cartimeing.car.bootType==2){
					$('.power').hide()
				}	
			}
		}
    })
	//租车进行中的订单查询

	//用车时间
	if(e_order != null){
		timeIndex = (e_order.data.orderList[0].updatedTimeLong*1 - e_order.data.orderList[0].borrowTimeLong*1)/1000;
	}
	//计时
//	var timeIndex = 0;
    var regex = /dateTime=(\d+)/;
    var src = location.toString();
    if(src.match(regex)){
        timeIndex = src.match(regex)[1]
    }
    setTime();
    setInterval(setTime, 1000);
   $(".car_time").html('加载中...');
    function setTime(){
        var hour = parseInt(timeIndex / 3600);
        var minutes = parseInt((timeIndex % 3600) / 60);
        var seconds = parseInt(timeIndex % 60);
        hour = hour < 10 ? "0" + hour : hour;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $(".car_time").html(hour + ":" + minutes + ":" + seconds);
        timeIndex++;
        var cartimes = hour + ":" + minutes + ":" + seconds;
        // 存用车时间
        localStorage.setItem('usercarTime',cartimes)
    }	

	$('.bord img').click(function(){
		console.log('开启动力')
		$('.showmsg').show()
		$('.showmsg').html('动力开启中...')
		var open_power = {
    		carCode:car_get,
    		cmdKey: 'POWER_ON'
    	}
		console.log(open_power)
	
		//将json转为字符串
		var o_power=JSON.stringify(open_power);
		//加密字符串
	    var power_open = encryptByDES(o_power,key);
	    console.log(power_open)
	   	//解密字符串
	    var str_power = decryptByDESModeEBC(power_open,key);
	    //转为字符串，传给后台
	    var powerOpen = power_open.toString();
		console.log(str_power)
	    
	    $.ajax({
			url: adress +'/api/cmd/car/cmd/send',
			type:'post',
			data:powerOpen,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(res){
				console.log(res)
				var op_power = res.data;
				var ope_power = decryptByDESModeEBC(op_power,key);
                var power_ok = JSON.parse(ope_power);
               	console.log(power_ok)
               	if(power_ok.code>0){
               		$('.showmsg').show()
               		$('.showmsg').html(power_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}else{
               		$('.showmsg').show()
               		$('.showmsg').html(power_ok.msg+'请重新点击')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},3000)
               	}

			},error:function(){
				console.log('出错了')
			}
		})

	})
	$('.closedoor img').click(function(){
		console.log('关闭动力');
		$('.showmsg').show()
		$('.showmsg').html('动力关闭中...')
		var close_power = {
    		carCode:car_get,
    		cmdKey: 'POWER_OFF'
    	}
	
		//将json转为字符串
		var off_power=JSON.stringify(close_power);
		//加密字符串
	    var power_off = encryptByDES(off_power,key);
	   	//解密字符串
	    var str_off = decryptByDESModeEBC(power_off,key);
	    //转为字符串，传给后台
	    var powerOff = power_off.toString();
	
		$.ajax({
			url: adress +'/api/cmd/car/cmd/send',
			type:'post',
			data:powerOff,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(res){
				console.log(res)
				var off_p = res.data;
				var off_po = decryptByDESModeEBC(off_p,key);
                var off_ok = JSON.parse(off_po);
               	console.log(off_ok)
               	if(off_ok.code>0){
               		$('.showmsg').show()
               		$('.showmsg').html(off_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}else{
               		$('.showmsg').show()
               		$('.showmsg').html(off_ok.msg+'请重新点击')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},3000)
               	}

			},error:function(){
				console.log('出错了')
			}
		})
	})
	
	//鸣笛
	$('.loudspeak img').click(function(){
		console.log('鸣笛')
		$('.showmsg').show()
		$('.showmsg').html('鸣笛开启中...')
		var horn = {
    		carCode:car_get,
    		cmdKey: 'SEARCH'
    	}
		//将json转为字符串
		var o_horn =JSON.stringify(horn);
		//加密字符串
	    var op_horn = encryptByDES(o_horn,key);
	   	//解密字符串
	    var str_horn = decryptByDESModeEBC(op_horn,key);
	    //转为字符串，传给后台
	    var on_horn = op_horn.toString();
		
	    $.ajax({
			url: adress +'/api/cmd/car/cmd/send',
			type:'post',
			data:on_horn,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(res){
				var horn_a = res.data;
				var horn_b = decryptByDESModeEBC(horn_a,key);
                var horn_c = JSON.parse(horn_b);
               	console.log(horn_c)
               	if(horn_c.code>0){
               		$('.showmsg').show()
               		$('.showmsg').html(horn_c.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}else{
               		$('.showmsg').show()
               		$('.showmsg').html(horn_c.msg+'请重新点击')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},3000)
               	}
			},error:function(){
				console.log('出错了')
			}
		})
	})
	
	$('.kai img').click(function(){
		$('.showmsg').show()
		$('.showmsg').html('开锁中...')
		var open_unlock = {
    		carCode:car_get,
    		cmdKey: "UN_LOCK"
    	}
	
		//将json转为字符串
		var o_unlock =JSON.stringify(open_unlock);
		//加密字符串
	    var op_unlock = encryptByDES(o_unlock,key);
	  
	    //转为字符串，传给后台
	    var unlock_open = op_unlock.toString();
	
		$.ajax({
			url: adress +'/api/cmd/car/cmd/send',
			type:'post',
			data:unlock_open,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(res){
			
				var unl = res.data;
				var open_unl = decryptByDESModeEBC(unl,key);
                var open_yes = JSON.parse(open_unl);
               	console.log(open_yes)
               	if(open_yes.code>0){
               		$('.showmsg').show()
               		$('.showmsg').html(open_yes.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}else{
               		$('.showmsg').show()
               		$('.showmsg').html(open_yes.msg+'请重新点击')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},3000)
               	}

			},error:function(){
				console.log('出错了')
			}
		})
	})
	
	$('.suo img').click(function(){
		$('.showmsg').show()
		$('.showmsg').html('关锁中...')
		var close_lock= {
    		carCode:car_get,
    		cmdKey: 'LOCK'
    	}
	
		//将json转为字符串
		var o_lock =JSON.stringify(close_lock);
		//加密字符串
	    var op_lock = encryptByDES(o_lock,key);

	    //转为字符串，传给后台
	    var lock_close = op_lock.toString();
		$.ajax({
			url: adress +'/api/cmd/car/cmd/send',
			type:'post',
			data:lock_close,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(res){
			
				var close_door = res.data;
				var close_a = decryptByDESModeEBC(close_door,key);
                var close_ok = JSON.parse(close_a);
               	console.log(close_ok)
               	if(close_ok.code>0){
               		$('.showmsg').show()
               		$('.showmsg').html(close_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}else{
               		$('.showmsg').show()
               		$('.showmsg').html(close_ok.msg+'请重新点击')
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},3000)
               	}
			},error:function(){
				console.log('出错了')
			}
		})
	})
	//立即还车
	$('.immediat_givecar').click(function(){
		localStorage.removeItem('s_order')
		window.location.href = 'ok_returnCar.html'
	})

})
