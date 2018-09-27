$(function(){
	var get_per = JSON.parse(localStorage.getItem('main'));
	var token ='201801171503190304';
	$('.tabcont').eq(0).show()
	
	$('.tab span').click(function() {
        var i = $(this).index();//下标第一种写法
        $(this).addClass("ins").siblings().removeClass("ins");
        $('.tabcont').eq(i).show().siblings('.tabcont').hide();
    });
    
		//加密的私钥
   	var key = 'HL1HBF6lLND721';
	var aid = GetRequest();
	
	var getstatid = aid['id'];
	console.log(getstatid)
	
	var statone = {
		"stationId":getstatid
	}
	astatid = JSON.stringify(statone)
	//加密字符串
    var strid = encryptByDES(astatid,key);
   	//解密字符串
    var stats = decryptByDESModeEBC(strid,key);
    //转为字符串，传给后台
    var s_id = strid.toString();
    
    
    var l_lon = 0.011012;
	var s_lat = 0.003786;
    
    $.ajax({
    	url:adress+"/weChat/pile/station/info/query",
		type:'post',
		data:s_id,
		async:true,
		withCredentials:true,
		dataType:"json",
		contentType:"application/json;charset=utf-8", 
		beforeSend: function(request) {
      		request.setRequestHeader("token", token);
   		},
   		success:function(res){
   			console.log(res)
   			var stations = res.data;
			var statelec = decryptByDESModeEBC(stations,key);
			var elecdetq = JSON.parse(statelec)
			console.log(elecdetq)
			if(elecdetq.code>0){
				var elecdet = elecdetq.data;
				$('.e_adress').html(elecdet.stationName);
				$('.d_adress').html(elecdet.addrDetail)
				$('.serve_m').html(elecdet.serviceFee+'元/度')
				$('.car_m').html(elecdet.parkingFee)
				$('.car_code').html(elecdet.directionArea)
				$('.car_go').html(elecdet.parkingLot)
				var lon = elecdet.longitude*1+l_lon*1;
				var sat = elecdet.latitude*1+s_lat*1;
				var where = "http://api.map.baidu.com/marker?location="+ sat+","+lon +"&title="+ elecdet.stationName +"&content="+elecdet.addrDetail +"&output=html";
				$('.targit').attr("href",where); 
				var e_for = elecdet.timeList;
				
				var times_c ='';
				for(var t=0;t<e_for.length;t++){
					//开始时间
					var by_s = e_for[t].startTime+'';
					var a = by_s.substr(0, 2);
					var b = by_s.replace(".","").substr(-2,2);
				
					//结束时间
					var by_e = e_for[t].endTime+'';
					var c = by_e.substr(0, 2);
					var d = by_e.replace(".","").substr(-2,2);
			
					times_c +='<li>('+ a +':'+ b +'-'+ c +':'+d+') <i class="one">'+ e_for[t].chargePrice +'</i>元/度</li>';
					$('.eleclist').html(times_c)
				}
				
				
				var z_state =  elecdet.recordList;
				var state = '';
				var cimg = '';
				for(var t=0;t<z_state.length;t++){
					if(z_state[t].pileState == '00'){
						z_state[t].pileState = '离线';
					}if(z_state[t].pileState == '01'){
						z_state[t].pileState = '故障 ';
					}if(z_state[t].pileState == '02'){
						z_state[t].pileState = '告警  ';
					}if(z_state[t].pileState == '03'){
						z_state[t].pileState = '空闲  ';
					}if(z_state[t].pileState == '04'){
						z_state[t].pileState = '充电中 ';
					}if(z_state[t].pileState == '05'){
						z_state[t].pileState = '完成 ';
					}if(z_state[t].pileState == '06'){
						z_state[t].pileState = '预约  ';
					}if(z_state[t].pileState == '07'){
						z_state[t].pileState = '插抢  ';
					}if(z_state[t].chargePileBel ==01){
						z_state[t].chargePileBel ='公共桩 '
					}if(z_state[t].chargePileBel ==02){
						z_state[t].chargePileBel ='个人桩 '
					}if(z_state[t].chargePilePower>=60){
						 cimg = '../../images/cd/kuai_big.png'
					}if(z_state[t].chargePilePower<60){
						 cimg = '../../images/cd/man_big.png'
					}
					if(z_state[t].chargePileType ==05) {
						z_state[t].chargePileType = '双枪同时充直流充电桩';
						
					}if(z_state[t].chargePileType ==04) {
						z_state[t].chargePileType = '双枪轮流充直流充电桩';
						
					}if(z_state[t].chargePileType ==03) {
						z_state[t].chargePileType = '三相交流充电桩';
						
					}if(z_state[t].chargePileType ==02) {
						z_state[t].chargePileType = '单相交流充电桩';
						
					}if(z_state[t].chargePileType ==01) {
						z_state[t].chargePileType = '直流充电桩';
					}if(z_state[t].soc == 200){
						z_state[t].soc =''
					}else{
						z_state[t].soc ='(SOC:'+ z_state[t].soc +'%)'
					}
					state+='<div class="b_code"><img src="'+ cimg +'"/><p><i>编号：'
					+ z_state[t].chargePileNum +'</i><span class="soc">'
					+z_state[t].soc +'</span><em class="e_stats">'
					+ z_state[t].pileState +'</em></p><p>'
					+ z_state[t].chargePileBel +'  国标 '
					+ z_state[t].chargePileType + '  &nbsp' + z_state[t].chargePilePower +'KW</p></div>'
					
					$('.tabcontone').html(state)

					var allli = $('.eleclist li').length;
					$('.arrow').click(function(){
						$('.eleclist').animate({
							"height":allli*1.6+'rem'
						},300)
					})
	
				}
			}else{
				var t_s = '<li>+'+ elecdetq.msg +'</li>';
				$('.tabcontone').html(t_s)
			}
	
   		}
    })
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		 if (url.indexOf("?") != -1) {
		       var str = url.substr(1);
		       strs = str.split("&");
		       for (var i = 0; i < strs.length; i++) {
		           theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
		       }
		   }
		   return theRequest;
	}
	
	
	
})
