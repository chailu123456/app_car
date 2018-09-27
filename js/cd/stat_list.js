$(function(){

	var get_per = JSON.parse(localStorage.getItem('main'));

	//加密的私钥
   	var key = 'HL1HBF6lLND721';
   	var token ='201801171503190304';
	var aToStr = {}
	
	//gps转换百度地图经纬度	   
    var r_lng = 0.011542;
    var a_lat = 0.003282;
	
	 var data1 = JSON.parse(sessionStorage.getItem('local'));
	 console.log(data1)

	list_c()
	function list_c(){
		var l_lon = 0.011012;
		var s_lat = 0.003786;
		aToStr1 = JSON.stringify(data1)
		//加密字符串
	    var str1 = encryptByDES(aToStr1,key);
	   	//解密字符串
	    var str2 = decryptByDESModeEBC(str1,key);
	    //转为字符串，传给后台
	    var data_ = str1.toString();
	   
		//请求附近网点
	    $.ajax({
			url: adress+'/weChat/pile/station/list/query',
			type:'post',
			data:data_,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
			success:function(res){
				console.log(res)
				var carNet = res.data;
				var netNum = decryptByDESModeEBC(carNet,key);
				var allcding = JSON.parse(netNum)
				console.log(allcding)
				if(allcding.code>0){
					var stat_num = '';
					var allcd = allcding.data;
					for(var i=0;i<allcd.length;i++){
						var lon = allcd[i].longitude*1+l_lon*1;
						var sat = allcd[i].latitude*1+s_lat*1;
						stat_num += '<li><p class="elecid" id="'+ allcd[i].stationId +'"><span>'
								+ allcd[i].stationName+'</span><i><img src="../../images/cd/lbjt.png"/></i><em>'
								+ allcd[i].chargeFeePer +'元/度</em></p><div class="c_adress"><img src="../../images/cd/ditu.png"/><span>'
								+ allcd[i].chargeAddress +'</span><em class="distance">'
								+ allcd[i].chargeDistance +'km</em></div><div class="spare"><span><img src="../../images/cd/kuai.png"/><i>空闲'
								+ allcd[i].pileFastNumFree +'</i></span><span><img src="../../images/cd/man.png"/><i>空闲'
								+allcd[i].pileSlowNumFree+'</i></span><span><img src="../../images/cd/zong.png"/><i>总桩数'
								+allcd[i].totalPileCount+'</i></span></div><a class="go_cd" href="http://api.map.baidu.com/marker?location='+ sat+','+lon +'&title='+ allcd[i].stationName +'&content='+ allcd[i].chargeAddress +'&output=html"><img src="../../images/cd/daohang.png"/>前往充电</a></li>'
						$('.s_list').html(stat_num)
						$('.load').hide()
					}	
					$('.elecid').click(function(){
						$(this).each(function(){
							var statid = $(this).attr('id');
							window.location.href ="stat_detail.html?id="+statid
						})
					})
				}else {
					$('.s_list').html('<li style="width:96%;text-align:center;height:2rem;">'+ allcding.msg +'</li>')
				}
				
			},error:function(){
				console.log('出错了')
			}
		})
	}	
})
