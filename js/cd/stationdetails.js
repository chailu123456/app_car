$(function(){
	var get_per = JSON.parse(localStorage.getItem('main'));
	var uesrid =get_per.userId;
	var token ='201801171503190304';
	var g_code = sessionStorage.getItem('guncode'); //枪编号
	$('.load').hide()
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
   	
   	var s_cd = {
	   "userId":uesrid,
	   "gunCode":g_code
	}
   	
   	var cd_x;  //充电桩序列号
	var cd_g;  //充电枪号
	
	var immer_cd = {
		"userId":uesrid,
		"orderType":"2"
	}
	var selec_elec;
	var sta;
	
	var aredode = JSON.stringify(s_cd);
	//加密字符串
    var strid = encryptByDES(aredode,key);
   	//解密字符串
    var stats = decryptByDESModeEBC(strid,key);
    //转为字符串，传给后台
    var s_eleco = strid.toString();
   	$.ajax({
		type:'post',
		url: adress+'/weChat/pile/records/query',
		data:s_eleco,
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
			if(allorder.code>0){
				var datanum = allorder.data;	
				immer_cd.chargePileSeri = datanum.chargePileSeri;
				immer_cd.gunCode = datanum.gunCode; 
				var a_codes = JSON.stringify(immer_cd);
				//加密字符串
			    var stat_c = encryptByDES(a_codes,key);
			   	//解密字符串
			    sta = decryptByDESModeEBC(stat_c,key);
			    //转为字符串，传给后台
			    selec_elec = stat_c.toString();
				
				
				
				$('.c_ad').html(datanum.stationName);
				$('.cd_code').html(datanum.gunCode)
				if(datanum.pileState == '00'){
					$('.cd_zt').html('离线')
				}if(datanum.pileState == '01'){
					$('.cd_zt').html('故障')
				}if(datanum.pileState == '02'){
					$('.cd_zt').html('告警')
				}if(datanum.pileState == '03'){
					$('.cd_zt').html('空闲')
				}if(datanum.pileState == '04'){
					$('.cd_zt').html('充电中')
				}if(datanum.pileState == '05'){
					$('.cd_zt').html('完成')
				}if(datanum.pileState == '06'){
					$('.cd_zt').html('预约')
				}if(datanum.pileState == '07'){	
					$('.cd_zt').html('插抢中')
				}
				if(datanum.chargePileType ==05) {
					$('.type_cd').html('双枪同时充直流充电桩')
				}if(datanum.chargePileType ==04) {
					$('.type_cd').html('双枪轮流充直流充电桩')
					
				}if(datanum.chargePileType ==03) {
					$('.type_cd').html('三相交流充电桩')
					
				}if(datanum.chargePileType ==02) {
					$('.type_cd').html('单相交流充电桩')	
				}if(datanum.chargePileType ==01) {
					$('.type_cd').html('直流充电桩')
				}
				if(datanum.chargePileBel ==01){
					$('.pub').html('直流充电桩')
				}if(datanum.chargePileBel ==02){
					
					$('.pub').html('个人桩')
				}
				$('.kil').html(datanum.chargePilePower+'KW')
				
				var e_for = datanum.timeList;
				$('.sevrfree').html(e_for[0].servicePrice+'度')
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
					
					var allli = $('.eleclist li').length;
					$('.arrow').click(function(){
						$('.eleclist').animate({
							"height":allli*1.6+'rem'
						},300)
					})
				}
			}
   		}
	})
	$('.immed').click(function(){
		console.log(sta)
		//请求充电桩枪状态
		$.ajax({
			type:'post',
			url: adress+'/weChat/pile/records/query',
			data:s_eleco,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
	   		success:function(res){
	   			console.log(res)
	   			var g_stye = res.data;
				var g_num = decryptByDESModeEBC(g_stye,key);
				var g_data = JSON.parse(g_num)
				console.log(g_data)
				if(g_data.code>0){
					var guns = g_data.data;
					if(guns.pileState == '03'){
						$('.showmsg').show()
	               		$('.showmsg').html('请插抢')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}if(guns.pileState == '01'){
						$('.showmsg').show()
	               		$('.showmsg').html('故障中...')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}if(guns.pileState == '05'){
						$('.showmsg').show()
	               		$('.showmsg').html('完成')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}if(guns.pileState == '06'){
						$('.showmsg').show()
	               		$('.showmsg').html('预约')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}if(guns.pileState == '04'){
						$('.showmsg').show()
	               		$('.showmsg').html('充电中...')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}
					if(guns.pileState == '00'){
						$('.showmsg').show()
	               		$('.showmsg').html('离线中...')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}if(guns.pileState == '02'){
						$('.showmsg').show()
	               		$('.showmsg').html('告警中...')
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}
					if(guns.pileState == '07'){
						//请求订单号
						$.ajax({
							url:adress+"/weChat/charge/wallet/order/pay",
							type:'post',
							data:selec_elec,
							async:true,
							withCredentials:true,
							dataType:"json",
							contentType:"application/json;charset=utf-8", 
							beforeSend: function(request) {
					      		request.setRequestHeader("token", token);
					   		},
					   		success:function(res){
					   			var stord= res.data;
								var ords = decryptByDESModeEBC(stord,key);
								var elec_order = JSON.parse(ords);
								console.log(elec_order);
								if(elec_order.code>0){
									var backorder = elec_order.data.outTradeNo;
									var ord_result = {
									    "userId": uesrid,
									    "outTradeNo": backorder
									}
									localStorage.setItem('cd_ord', JSON.stringify(ord_result));	
									window.location.href = 'now_elec.html';
								}else {
									$('.showmsg').show()
				               		$('.showmsg').html(elec_order.msg)
				               		setTimeout(function(){
				               			$('.showmsg').hide();
				               		},2000)
								}
					   		}
						})
					}
				}else {
					$('.showmsg').show()
               		$('.showmsg').html(g_data.msg)
               		setTimeout(function(){
               			$('.showmsg').hide();
               		},2000)
				}
	   		}
		})
	
	})

})
