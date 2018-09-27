$(function(){
	
	var get_per = JSON.parse(localStorage.getItem('main'));

	var uesrid =get_per.userid;
	var token = get_per.token;
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
	var timeIndex =0;
	var cddetail = JSON.parse(sessionStorage.getItem('c_deta'));
	console.log(cddetail)
	
	$('.z_code span').html(cddetail.TERMINAL_NUMBER);
	
	if(cddetail.CHARGE_ELECTRICITY == undefined){
		$('.c_dl').html(0);
	}else{
		$('.c_dl').html(cddetail.CHARGE_ELECTRICITY/100+'度');
	}
	
	$('.c_moeny').html(cddetail.REAL_MONEY/1000);
	var c_time = cddetail.CHARGE_END_TIME*1-cddetail.CHARGE_START_TIME*1; //充电时间
	timeIndex = c_time;
	if(c_time<0){
		timeIndex = 0
	}
	console.log(timeIndex)
	setTime();	
	
	//订单开始时间
	var s_time = cddetail.CHARGE_START_TIME.substr(0, 4);
	var cd_time = cddetail.CHARGE_START_TIME.substr(4, 2);
	var e_time = cddetail.CHARGE_START_TIME.substr(6, 2);
	var h_time = cddetail.CHARGE_START_TIME.substr(8, 2);
	var m_time = cddetail.CHARGE_START_TIME.substr(10, 2);
	var ss_time = cddetail.CHARGE_START_TIME.substr(12, 2);
	//订单开始时间
	//订单结束时间
	var q_time = cddetail.CHARGE_END_TIME.substr(0, 4);
	var w_time = cddetail.CHARGE_END_TIME.substr(4, 2);
	var d_time = cddetail.CHARGE_END_TIME.substr(6, 2);
	var a_time = cddetail.CHARGE_END_TIME.substr(8, 2);
	var z_time = cddetail.CHARGE_END_TIME.substr(10, 2);
	var v_time = cddetail.CHARGE_END_TIME.substr(12, 2);
	//订单结束时间
	var o_time = s_time+'-'+cd_time+'-'+e_time+'  '+h_time+':'+m_time+':'+ss_time//订单开始时间
	
	var e_time = q_time+'-'+w_time+'-'+d_time+'  '+a_time+':'+z_time+':'+v_time  //订单结束时间
	$('.c_state').html(o_time);
	$('.c_end').html(e_time)	
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
	    $(".c_time").html(hour + ":" + minutes + ":" + seconds);
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