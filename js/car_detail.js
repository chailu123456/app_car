$(function(){
	var mainUser = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
	
	 //加密的私钥
    var key = 'HL1HBF6lLND721';

	//接收车辆code，经纬度
	var Cod_car = JSON.parse(localStorage.getItem('car_Code'));
	console.log(Cod_car)
	loaddata(Cod_car)
	
	function loaddata(Cod_car){
    	//将json转为字符串
		var aToStr=JSON.stringify(Cod_car);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
       	//解密字符串
        var str2 = decryptByDESModeEBC(str1,key);
        //转为字符串，传给后台
        var data_ = str1.toString();
		//车辆信息
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
                $('.load').hide()
               	console.log(netcar_)
               	if(netcar_.code>0){
               		var carlist = netcar_.data;
	               	$('.imgsrc').attr('src','http://qsimages.qisu666.com'+carlist.carImgPath)
	               	$('.car_name').html(carlist.brandName+carlist.carDisposition)
					$('.car_p').html(carlist.plateNumber)
					$('.car_e').html(carlist.oddPowerForNE)
					$('.car_k').html(carlist.oddMileage)
               	}else{
               		var error_list = '<li style="height:100px;line-height:100px;text-align:center;">数据异常</li>';
               		$('.car_user').html(error_list)
               	}
			},error:function(){
				console.log('出错了')
			}
		})
	    //用车套餐
	    $.ajax({
			url: adress +'/api/policy/driver/query',
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
                var netcar_x = JSON.parse(netNum);
               	console.log(netcar_x)
               	if(netcar_x.code>0){
               		var carlist = netcar_x.data;
	               	$('.elec_m').html(carlist.electricityCharge);
					$('.kilometer_m').html(carlist.chargingByMileage);
					$('.sele_day').html(carlist.dayCost);
					$('.ok').attr('id',carlist.carCode);
					
					var show_time = netcar_x.data.policyList;
					console.log(show_time)
					var confirm = '';
					for(var i=0;i<show_time.length;i++){
						confirm += '<em><i>('+ show_time[i].timeBegin +'-' + show_time[i].timeEnd + ')</i><span>' + show_time[i].chargePrice + '</span>元/分钟</em>'
						$('.schedule').html(confirm)
					}
               	}
			},error:function(){
				console.log('出错了')    
			}
		})
	}

	$('.users').addClass('move');
	$('.slide').click(function(){
    	$('.s_introd').addClass('tall');
    })
	
	//选取租车套餐
	var change = 0;
    $('.sele_time').click(function(){
        $(this).attr("src","../images/right.jpg");
        $('.seleday').attr("src","../images/no_select.jpg");
    	change = 0;
	})
    $('.seleday').click(function(){	
        $('.sele_time').attr("src","../images/no_select.jpg");
        $(this).attr("src","../images/right.jpg");
  		change = 1;
	})

    // 预约租车
    $('.ok').click(function(){
     	var car_code = $(this).attr('id');
     	console.log(change)
	    var car_style ={
		    userCode: mainUser.userId,
		    carCode: car_code,
		    city: "SZ",
		    borrowType: change,
		    driverType: "0" 
	    }
	   
    	//将json转为字符串
		var aToStr=JSON.stringify(car_style);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
    
        //转为字符串，传给后台
        var data_ = str1.toString();
		//网点预约接口   选好套餐，确认预约
	    $.ajax({
			url: adress +'/api/tss/order/book',
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
				var yuyue= JSON.parse(netNum);
//				console.log(yuyue)
                var yuyue_ok= JSON.parse(netNum).data;
//             	console.log(yuyue_ok)
               	
               	//返回判断是否预约成功，成功跳下一页面
               	if(yuyue_ok.status == 0){
//             		console.log('预约成功')
               		var thisorder = yuyue_ok.orderCode;
//             		console.log(thisorder)
               		//用于取消预约订单
               		var info = {
			     		userCode: mainUser.userId,
			     		orderCode: thisorder
				    };
               		localStorage.setItem('key_user', JSON.stringify(info));
               		//用于取消预约订单
					window.location.href = 'confirm_use.html';
					
               	}else{
               		
               		$('.showmsg').show()
               		$('.showmsg').html(yuyue.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
               	}
               	
			},error:function(){
				console.log('出错了')
			}
		})
  	
    })
	
	
})
