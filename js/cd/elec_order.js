$(function(){
	
	var get_per = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
	var userId = get_per.userId;
	var redode = {
	   "userId":userId,
	   "pageIndex":"1",
	   "pageNum":"100"
	}

	var timeIndex =0;
	
	//加密的私钥
   	var key = 'HL1HBF6lLND721';

	var aredode = JSON.stringify(redode);
	//加密字符串
    var strid = encryptByDES(aredode,key);

    //转为字符串，传给后台
    var rcodes = strid.toString();
    $.ajax({
		url: adress+'/weChat/charge/records/query',
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
			var e_ord = res.data;
			var ordNum = decryptByDESModeEBC(e_ord,key);
			var allorder = JSON.parse(ordNum)
			console.log(allorder)
			$('.load').hide()
			if(allorder.code>0){
				var order_m ='';
				var ord_length = allorder.data;
				for(var i=0;i<ord_length.length;i++){
					var s_time = ord_length[i].CHARGE_START_TIME.substr(0, 4);
					var c_time = ord_length[i].CHARGE_START_TIME.substr(4, 2);
					var e_time = ord_length[i].CHARGE_START_TIME.substr(6, 2);
					var h_time = ord_length[i].CHARGE_START_TIME.substr(8, 2);
					var m_time = ord_length[i].CHARGE_START_TIME.substr(10, 2);
					var ss_time = ord_length[i].CHARGE_START_TIME.substr(12, 2);
					var cd_usertime = ord_length[i].CHARGE_TIME;
					var cd_h = cd_usertime.substr(0,2);
					var cd_m = cd_usertime.substr(2,2);
					var cd_s = cd_usertime.substr(4,2);
			
					if(ord_length[i].CHARGE_ELECTRICITY == undefined){
						ord_length[i].CHARGE_ELECTRICITY = 0;
					}
					order_m += '<li><div class="statname"><img class="loca" src="../../images/cd/ditu_geren .png"/><p class="odr_details" id="'
					+ ord_length[i].OUT_TRADE_NO +'"><span>'
					+ ord_length[i].CHARGE_STATION_NAME+'</span><img class="arrow" src="../../images/cd/jiantou.png"/></p><span class="times">'
					+ s_time + '-' +c_time + '-'+ e_time +' '+ h_time+':'+m_time+':'+ss_time+'</span></div><div class="discount"><span>充电时长：<i>'
					+ cd_h+':'+cd_m+':'+cd_s+'</i></span><span>充电电量：<i>' 
					+ord_length[i].CHARGE_ELECTRICITY/100+' </i></span><span>剩余余额：<i>'
					+ ord_length[i].REBACK_MONEY +'</i></span><span>支付金额：<i>'
					+ord_length[i].PAY_MONEY+'</i></span></div><div class="givemonet">实付金额：<i>￥'
					+ ord_length[i].REAL_MONEY +'</i></div></li>';
					
					$('.ords').html(order_m);	
				}
				
				$('.odr_details').click(function(){
				
					$(this).each(function(){
						var oreid =  $(this).attr('id');
					
						var orddetail = {
							"outTradeNo" :oreid,
							"userId":userId
						}
						var ordode = JSON.stringify(orddetail);
						//加密字符串
					    var o_strid = encryptByDES(ordode,key);
					   	//解密字符串
					    var stats = decryptByDESModeEBC(o_strid,key);
					    //转为字符串，传给后台
					    var o_codes = o_strid.toString();
					 
						 $.ajax({
							type:'post',
							url: adress+'/weChat/charge/records/query/details',
							data:o_codes,
							async:true,
							withCredentials:true,
							dataType:"json",
							contentType:"application/json;charset=utf-8", 
							beforeSend: function(request) {
					      		request.setRequestHeader("token", token);
					   		},
					   		success:function(res){
					   			var e_ord = res.data;
								var ording = decryptByDESModeEBC(e_ord,key);
								var orderd = JSON.parse(ording)
								console.log(orderd)
								if(orderd.code>0){
									var c_detail = orderd.data;
									sessionStorage.setItem('c_deta', JSON.stringify(c_detail));
									window.location.href ="cd_detail.html";
								}
					   		}
						})
						
					})
				})	
			}else {
				var cd = '<div style="text-align:center; margin-top:20%;"><img class="nord"  src="../../images/zan.png"><div>'
               	$('.ords').html(cd)
			}
		},error:function(){
			console.log('出错了')
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
