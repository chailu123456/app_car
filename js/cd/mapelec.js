$(function(){
	var get_per = JSON.parse(localStorage.getItem('main'));
	
	var token ='201801171503190304';
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
   	//获取当前经纬度
	var thisLocation = {}
	var mk;
	//gps转换百度地图经纬度	   
    var r_lng = 0.011542;
    var a_lat = 0.003282;
	
	// 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(113.98118, 22.567614);
    map.centerAndZoom(point,13);
	
	var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
        	var icon = new BMap.Icon('../../images/loca.png', new BMap.Size(22, 22), {
			    anchor: new BMap.Size(36, 34)
			});
			icon.setImageSize(new BMap.Size(20, 20));
			var pt = new BMap.Point(r.point.lng, r.point.lat);
            mk = new BMap.Marker(pt,{icon:icon})
            map.addOverlay(mk);
            map.panTo(r.point);
			var ln = r.point.lng*1-r_lng*1;
			var la = r.point.lat*1-a_lat*1;
            thisLocation.longitude = ln+'';
            thisLocation.latitude = la+'';
            thisLocation.distance = "90";
            
        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
    
    //滑动地图监听事件
    map.addEventListener("moveend", showInfo);
	var centerlocat = {};
	function showInfo(){
		$('.load').show()
		center = map.getCenter();
		console.log(center)
		var lng = center.lng*1-r_lng*1;
		var lat = center.lat*1-a_lat*1;
	    centerlocat.longitude = lng+'';
	    centerlocat.latitude = lat+'';
	    centerlocat.distance = '6';
	    //函数调用，传参
	    console.log(centerlocat)
	    mapelecs(centerlocat)
	}
    showInfo()
	//滑动地图监听事件
    
	$('.c_lists').click(function(){
		sessionStorage.setItem('local', JSON.stringify(thisLocation));
		window.location.href = 'stat_list.html';
	})
	
	//经纬度之差
    var t_lon = 0.006656;
    var t_lat = 0.006092;
	
	function mapelecs(thisLocation) {
		aToStr1 = JSON.stringify(thisLocation)
		//加密字符串
	    var str1 = encryptByDES(aToStr1,key);
	    //转为字符串，传给后台
	    var data_ = str1.toString();
	    map.clearOverlays()
		map.addOverlay(mk);
	    
		//请求桩点
	    $.ajax({
			url: adress+'/weChat/pile/station/page/query',
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
				if(res.code>=0){
					var carNet = res.data;
					var netNum = decryptByDESModeEBC(carNet,key);
					var bacnmsg = JSON.parse(netNum)
					console.log(bacnmsg)
					var allcd = bacnmsg.data;
					$('.load').hide()
					for (var i = 0; i < allcd.length; i++) {
		    			var v_stype=null;
		    			var lon = allcd[i].longitude*1+t_lon*1;
		    			var lat = allcd[i].latitude*1+t_lat*1
		    			var point = new BMap.Point(lon,lat);
		    			//只显示有车网点
		    			if(allcd[i].chargeStationType ==2){
		    				v_stype="quick";
		    			}if(allcd[i].chargeStationType==3){
		    				v_stype="mid";
		    			}if(allcd[i].chargeStationType==1){
		    				v_stype="slow";
		    			}
		    			addnet(point,new net_grop(allcd[i].stationId,lon,lat,v_stype))
		    		}
				}else {
					$('.s_list').html('<li>数据异常</li>')
				}
			},error:function(){
				console.log('出错了')
			}
		})
	}
    function net_grop(stationid,longitude,latitude,v_stype){
        this.stationid=stationid;
        this.v_stype=v_stype;
        this.longitude = longitude;
        this.latitude =latitude;
    }
	function addnet(point,net_grop){
    	var myIcon;
    	if(net_grop.v_stype=='quick'){
    		myIcon = new BMap.Icon("../../images/cd/kua.png", new BMap.Size(52,64),{
    			anchor: new BMap.Size(52,64)
    		})
    		myIcon.setImageSize(new BMap.Size(26, 30));
    	}if(net_grop.v_stype=='mid'){
    		myIcon = new BMap.Icon("../../images/cd/kmc.png", new BMap.Size(52,64),{
    			anchor: new BMap.Size(52,64)
    		})
    		myIcon.setImageSize(new BMap.Size(26, 30));
    	}if(net_grop.v_stype=='slow'){
    		myIcon = new BMap.Icon("../../images/cd/manc.png", new BMap.Size(52,64),{
    			anchor: new BMap.Size(52,64)
    		})
    		myIcon.setImageSize(new BMap.Size(26, 30));
    	}
        var marker = new BMap.Marker(point,{icon:myIcon});
        map.addOverlay(marker);
        marker.addEventListener("click",function(){
            m_select(net_grop,point,marker);
        })
    }
	// 点击地图上桩
    function m_select(net_grop,point,marker){
        var stid=net_grop.stationid;
        var stat_lon = net_grop.longitude*1-t_lon*1;
        var stat_lat = net_grop.latitude*1-t_lat*1;
        var statId = {
        	 "stationId":stid+'',
        	 "longitude": thisLocation.longitude,
	    	 "latitude": thisLocation.latitude
        }
        console.log(statId)
        var stelec = JSON.stringify(statId)
		//加密字符串
	    var st_id = encryptByDES(stelec,key);
	    //转为字符串，传给后台
	    var s_id = st_id.toString();
        $.ajax({
			url: adress +'/weChat/pile/station/query',
			type:'post',
			data:s_id,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", "201801171503190304");
	   		},
			success:function(res){
				var carNet = res.data;
				var netNum = decryptByDESModeEBC(carNet,key);
				var allcd = JSON.parse(netNum)
				console.log(allcd)
				if(allcd.code>0){
					var d_detail = allcd.data;
					$('.statId').attr('id',d_detail.stationId)
					$('.d_adr').html(d_detail.stationName);
					$('.d_free').html(d_detail.chargeFeePer+'元/度');
					$('.d_detail').html(d_detail.chargeAddress);
					$('.d_fast').html('空闲 '+d_detail.pileFastNumFree);
					$('.distance').html(d_detail.chargeDistance+'km');
					$('.d_man').html('空闲 '+d_detail.pileSlowNumFree);
					$('.d_all').html('总桩数 '+d_detail.totalPileCount);
					var sat = d_detail.longitude*1+t_lon*1;
					var lon = d_detail.latitude*1+t_lat*1;
					var where = "http://api.map.baidu.com/marker?location="+ lon +","+sat+"&title="+ d_detail.stationName +"&content="+d_detail.chargeAddress +"&output=html";
					$('.go_cd').attr("href",where); 
					$('.bg_a').animate({
						'bottom': '6%'
					},300)
					
					$('.statId').click(function(){
						var statid = $(this).attr('id');
						window.location.href ="stat_detail.html?id="+statid
					})
				}else {
					$('.s_list').html('<div>'+ allcd.code +'</div>')
				}
			},error:function(){
				console.log('出错了')
			}
		})  
    }
})
