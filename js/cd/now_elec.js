$(function(){
	var get_per = JSON.parse(localStorage.getItem('main'));
	$('.stop_e').hide()
	$('.stop_e').html('停止充电')
	var uesrid = get_per.userId;
	
	var g_code = JSON.parse(localStorage.getItem('cd_ord'));
	console.log(g_code)
	
	var token ='201801171503190304';
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
	
	var ordr_in = JSON.stringify(g_code);
	var timer =null;
	var num;

	//加密字符串
    var striord = encryptByDES(ordr_in,key);
    console.log(striord)
	 //转为字符串，传给后台
	var o_ord = striord.toString();
	var timeIndex =0;
	//请求开始充电
	function stat_cd(){
		$.ajax({
			type:'post',
			url: adress+'/weChat/charge/order/result/query',
			data:o_ord,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
	   		success:function(res){
//	   			$("#divTime").html('加载中...');
	   			var detords= res.data;
				var back_ord = decryptByDESModeEBC(detords,key);
				var bk_order = JSON.parse(back_ord);
				console.log(bk_order);
				if(bk_order.code>0){
					var a_data =bk_order.data;
					$('.elec_z').html(a_data.stationName)
					$('.z_code span').html(a_data.chargePileNum)
					if(a_data.orderState == 02){
						$('.stop_e').show()
						$('.knows').hide()
						$('.cd_type').html('充电中...')
						var gl = (a_data.currentV*a_data.currentA)/1000;
						var gll = gl.toFixed(2)
						var c_times = getMyDate(a_data.totalChargeTimes)
						$('.cf_fy').html(a_data.totalChargeMoney);
						$('.has_elec').html(a_data.totalChargeQuantity);
						timeIndex = a_data.totalChargeTimes;
						$('.cd_dy').html(a_data.currentV);
						$('.cd_dl').html(a_data.currentA);
						$('.cd_gl').html(gll);
					}else if(a_data.orderState == 01){
						$('.knows').hide()
						$('.cd_type').html('充电连接中...')
						timeIndex = a_data.totalChargeTimes;
					}else if(a_data.orderState == 03){
							$('.stop_e').show()
							$('.cd_type').html('充电结束')
							var gl = (a_data.currentV*a_data.currentA)/1000;
							var gll = gl.toFixed(2)
							var c_times = getMyDate(a_data.totalChargeTimes)
							$('.cf_fy').html(a_data.totalChargeMoney);
							$('.has_elec').html(a_data.totalChargeQuantity);
							timeIndex = a_data.totalChargeTimes;
							$('.cd_dy').html(a_data.currentV);
							$('.cd_dl').html(a_data.currentA);
							$('.cd_gl').html(gll);
							setTimeout(clears,500)  //待充电，时间位0
					}else if(a_data.orderState == 04){
						$('.stop_e').html('充电结束')
						$('.stop_e').show()
						setTimeout(clears,500)  //待充电，时间位0
						clearInterval(timer);   //清除充电循环定时器					
		   				setTimeout(function(){
		           			$('.showmsg').hide();
		           			window.location.href = 'end_order.html'
		           		},2000)
					}
				}else {
					$('.showmsg').show();
               		$('.showmsg').html(bk_order.msg);
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
				}
	   		}
		})
	}
	stat_cd()
	timer = setInterval(stat_cd,8000)
	
	var stat_time = null;
	//从0计时
 	var regex = /dateTime=(\d+)/;
    var src = location.toString();
    if(src.match(regex)){
        timeIndex = src.match(regex)[1]
    }
    function setTime(){
        var hour = parseInt(timeIndex / 3600);
        var minutes = parseInt((timeIndex % 3600) / 60);
        var seconds = parseInt(timeIndex % 60);
        hour = hour < 10 ? "0" + hour : hour;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $("#divTime").html(hour + ":" + minutes + ":" + seconds);
        timeIndex++;
    }
    setTime();
    stat_time = setInterval(setTime, 1000);

	function clears(){
		clearInterval(stat_time);
	}
	$('.stop_e').click(function(){
		function stopcd(){
			$.ajax({
				type:'post',
				url: adress+'/weChat/charge/stop',
				data:o_ord,
				async:true,
				withCredentials:true,
				dataType:"json",
				contentType:"application/json;charset=utf-8", 
				beforeSend: function(request) {
		      		request.setRequestHeader("token", token);
		   		},
		   		success:function(res){
		   			var end_c= res.data;
					var end_cd = decryptByDESModeEBC(end_c,key);
					var order_e = JSON.parse(end_cd);
		   			console.log(order_e)
		   			if(order_e.code>0){
		   				$('.stop_e').html('停止充电中...')
		   				stat_cd()
		   			}
		   		}	
			})
		}
		stopcd()
		setInterval(stopcd,10000)
	}) 
})
function getMyDate(str){
    var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth()+1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = getzf(oHour) +':'+
			getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
  if(parseInt(num) < 10){
      num = '0'+num;
	}
  	return num;
}
	

