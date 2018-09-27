$(function(){
	
	var get_per = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
	
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
	
	var last_ord = JSON.parse(localStorage.getItem('cd_ord'));
	var ordr_end = JSON.stringify(last_ord);
	//加密字符串
    var l_ord = encryptByDES(ordr_end,key);
  
  	var timeIndex =0;
  
	 //转为字符串，传给后台
	var o_ord = l_ord.toString();
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
   			var detords= res.data;
			var back_ord = decryptByDESModeEBC(detords,key);
			var bk_order = JSON.parse(back_ord);
			console.log(bk_order);
			if(bk_order.code>0){
				var a_data =bk_order.data;
				var gl = a_data.currentV*a_data.currentA;
				var c_times = getMyDate(Number(a_data.totalChargeTimes));
				var end_times = getMyDate(Number(a_data.endChargeTime));
				$('.elec_z').html(a_data.stationName)
				$('.z_code span').html(a_data.chargePileNum)
				$('.d_free').html(a_data.eleFee) 
				$('.s_free').html(a_data.serviceFee) 
				$('.cf_fy').html(a_data.actualPay/100);
				var backm = a_data.actualPay/100;
				$('.has_elec').html(a_data.totalChargeQuantity+'度');
				timeIndex = a_data.totalChargeTimes;
				setTime();	
				var s_time = a_data.endChargeTime.substr(0, 4);
				var c_time = a_data.endChargeTime.substr(4, 2);
				var e_time = a_data.endChargeTime.substr(6, 2);
				var h_time = a_data.endChargeTime.substr(8, 2);
				var m_time = a_data.endChargeTime.substr(10, 2);
				var ss_time = a_data.endChargeTime.substr(12, 2);
				$('.cd_dy').html(h_time+':'+m_time+':'+ss_time);
				$('.back_m').html(a_data.payMoney-backm)
				$('.cd_dl').html(a_data.chargeDiscountMoney);
				$('.df_zk').html(a_data.stationId)	
           		setTimeout(function(){
           			window.location.href = 'cd_index.html';
           		},3000000)
			}
   		}
	})
	
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
        $(".h_time").html(hour + ":" + minutes + ":" + seconds);
    }
   
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
	
function getMyDate2(str){
	    var oDate = new Date(str),
	    oYear = oDate.getFullYear(),
	    oMonth = oDate.getMonth()+1,
	    oDay = oDate.getDate(),
	    oHour = oDate.getHours(),
	    oMin = oDate.getMinutes(),
	    oSen = oDate.getSeconds(),
	    oTime = oYear +'-'+ getzf2(oMonth) +'-'+ getzf2(oDay) +' '+ getzf2(oHour) +':'+
				getzf2(oMin) +':'+getzf2(oSen);//最后拼接时间
	    return oTime;
	};
	//补0操作
	function getzf2(num){
	  if(parseInt(num) < 10){
	      num = '0'+num;
	}
	  	return num;
}