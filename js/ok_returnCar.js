$(function(){
	var mainUser = JSON.parse(localStorage.getItem('main'));
	
	var token = "201801171503190304";
	//用户id
	var userCode = mainUser.userId;
	
	//加密的私钥
	var key = 'HL1HBF6lLND721';

	//获取订单编号
	var ord = JSON.parse(localStorage.getItem('key_user'))
	console.log(ord)
	
	//获取车辆编号
	var car_ids = localStorage.getItem('car_Id');
	console.log(car_ids)

	//订单   网点还车,下面会加入网点id，还车地址
	var car_orde = {
		orderCode : ord.orderCode   //订单编号
	}
	console.log(car_orde)
	//还车网点
 	var stationId = {
 		orderCode: ord.orderCode  
 	};
 	//车辆id 
 	var car= {
 		carCode: car_ids
 	}
 	console.log(car)
	//将json转为字符串
	var aToStr=JSON.stringify(car_orde);
	//加密字符串
    var str1 = encryptByDES(aToStr,key);
   	//解密字符串
    var str2 = decryptByDESModeEBC(str1,key);
    //转为字符串，传给后台
    var data_ = str1.toString();
	console.log(data_)
	console.log(str2)
    
	 //确认完毕(检查车门，灯开关)
    $('.finish').click(function(){
	    //还车网点页面
	    $.ajax({
			url: adress +'/api/tss/distance/return/car',
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
	            var give_car= JSON.parse(netNum);
	           	console.log(give_car)
	           	if(give_car.code>0){
	           		var adress_car = give_car.data;
	           		stationId.endStation = adress_car.stationCode;
	           		if(adress_car.outOfDistance==1){
	           			$('.givecar_net').html('您未到达还车网点');
	           			var n_carm = adress_car.parkedAmount/100;
	           			$('.this_m').html('本次还车收取挪车费'+n_carm+'元')
	           		}
	           		$('.ad_car').html(adress_car.stationName)
	           	}else{
	           		console.log(give_car.msg)
	           	}
	
			},error:function(){
				console.log('出错了')
			}
		})

    	$('.ready_ok').animate({
    		left:0
    	},300)
    })
    //将json转为字符串
	var Carcode=JSON.stringify(car);
	//加密字符串
    var carStr = encryptByDES(Carcode,key);
   	//解密字符串
    var sq = decryptByDESModeEBC(carStr,key);
    //转为字符串，传给后台
    var carId = carStr.toString();
    //获取当前车辆还车地点经纬度,返回地址，传给后台
    $.ajax({
		url: adress +'/api/car/info/query',
		type:'post',
		data:carId,
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
            var netc_a = JSON.parse(netNum);
           	console.log(netc_a)
           	if(netc_a.code>0){
           		var carlist = netc_a.data;
           		var geoc = new BMap.Geocoder();    
			    var r_lng = 0.011418;
			    var a_lat = 0.002757;
			    var ln = carlist.longitude*1+r_lng*1;
			    var la = carlist.latitude*1+a_lat*1;
			    var pt = new BMap.Point(ln, la);
			    geoc.getLocation(pt, function(rs){
			        var addComp = rs.addressComponents;
			        console.log(addComp)     
			        console.log(rs.surroundingPois); //附近的POI点(array)
//			        console.log(rs.surroundingPois[0].title)
					stationId.endLocationTxt = rs.surroundingPois[0].title;
			    });
           	}
		},error:function(){
			console.log('出错了')
		}
	})
 	//检查完毕，确认完毕
	$('.check_ok').click(function(){
		$('.check_ok').html('费用结算中...');
		console.log(stationId)
    	//将json转为字符串
		var okcar=JSON.stringify(stationId);
		//加密字符串
        var str_car = encryptByDES(okcar,key);
        //转为字符串，传给后台
        var data_ee = str_car.toString();

		//网点还车
	    $.ajax({
			url: adress +'/api/tss/car/return',
			type:'post',
			data:data_ee,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
          		request.setRequestHeader("token", token);
       		},
			success:function(data){
				var carNets = data.data;
				var netNums = decryptByDESModeEBC(carNets,key);
                var give_ok= JSON.parse(netNums);
               	console.log(give_ok)
            	if(give_ok.code>0){
            		console.log(give_ok.msg)
            		$('.showmsg').show()
               		$('.showmsg').html(give_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
            		localStorage.setItem('acount_money', JSON.stringify(give_ok));
            		window.location.href= 'settlement.html';
            		$('.check_ok').html('确认还车');
            	}if(give_ok.code== -1052){
            		$('.showmsg').show()
               		$('.showmsg').html(give_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
            		localStorage.setItem('acount_money', JSON.stringify(give_ok));
            		window.location.href= 'settlement.html';
            		$('.check_ok').html('确认还车');
            	}else{
            		$('.check_ok').html('确认还车');
            		console.log(give_ok.msg)
            		$('.showmsg').show()
               		$('.showmsg').html(give_ok.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},4000)
            	}
			},error:function(){
				console.log('出错了')
			}
		})
    })
	
})
