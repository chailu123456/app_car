$(function(){
	var appid = 'wxa1913349bc1e72dd';
	var token ='201801171503190304';
	//加密的私钥
    var key = 'HL1HBF6lLND721';
	//记录该页面值，登陆成功之后返回该页面
	var itis = {
		"num" :1
	}
	sessionStorage.setItem('isyes', JSON.stringify(itis))
	//记录该页面值，登陆成功之后返回该页面

	//看有没有userid
	//获取openid	
	var mainUser = JSON.parse(localStorage.getItem('main'));
	if(mainUser == null ||mainUser.userId ==''|| mainUser.userId == null || mainUser.openId ==null || mainUser.openId ==''){
		mainUser = {};
	} 
	
	//获取openid
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	
	var code = getQueryString("code")
	
	getopenid();
	
	var backopenid;  //openid
	var backuserid;  //userid
	function getopenid() {
	    var m_data = {
	        "code" : code
	    }
	    //将json转为字符串
	    var aToStr=JSON.stringify(m_data);
	    //加密字符串
	    var strs = encryptByDES(aToStr,key);
	    //转为字符串，传给后台
	    var givecode = strs.toString();
	    $.ajax({ 
	        async: false, 
	        url: adress+"/weChat/user/getOpenId",
	        type: "post", 
	        dataType:"json",
	        data: givecode,
	        contentType:"application/json;charset=utf-8", 
	        success: function(result){ 
	            var wxdetail = result.data;
	            var wx_back = decryptByDESModeEBC(wxdetail,key);
	            var w_get = JSON.parse(wx_back);
	            console.log(w_get)  
	            if(w_get.code>0){
	            	backopenid = w_get.data.openId; //得到openid
	            	backuserid = w_get.data.userId; //得到userid
	            	mainUser.openId = backopenid;
	            	mainUser.userId = backuserid;
	            	mainUser.token = token;
	            	localStorage.setItem('main', JSON.stringify(mainUser));
	            }else if(w_get.code== -1006){
	            	backopenid = w_get.data.openId; //得到openid
	            	window.location.href = 'login.html?openid='+backopenid;
	            }else{
	            	$('.showmsg').hide()
	           		$('.showmsg').html(w_get.msg)
	           		setTimeout(function(){
	           			$('.showmsg').hide();
	           		},2000)
	            }
	        }, 
	        error: function (jqXHR, textStatus, errorThrown) { 
	            console.log(textStatus); 
	        } 
	    });
    }
	//获取openid	

	$('.m_wallet').click(function(){
   		window.location.href = 'html/pay/mywallet.html';
		hides()
   })
    //加密的私钥
   	var key = 'HL1HBF6lLND721';
   	if(mainUser!=null && mainUser.userId !=null){
		var users ={
		    "userCode": mainUser.userId,
		    "status":  '0,1'
	    }
		//查询账户信息
	   	var personl = {
			"userId": mainUser.userId,
			"pageIndex":"1",
			"pageNum":"20"
		}
	   	var per_ceng = JSON.stringify(personl);
		//加密字符串
	    var str_pin = encryptByDES(per_ceng,key);
	    //转为字符串，传给后台
	    var find_per = str_pin.toString();
	   	$.ajax({
	   		url: adress+'/weChat/acctinfo/query',
			type:'post',
			data:find_per,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
	   		success:function(res){
				var p_type = res.data;
				var prd_type = decryptByDESModeEBC(p_type,key);
				var per_det = JSON.parse(prd_type)
				console.log(per_det)
				if(per_det.code>0){
					$('.per_mobile').html(per_det.data.mobileNo);
					var mymoney = per_det.data.totalMoney;
					var my_mo = {
						"per_mon": mymoney
					}
					sessionStorage.setItem('person_mo', JSON.stringify(my_mo));
					$('.accoutnum').html(per_det.data.mobileNo)
				}else{
					$('.showmsg').show()
	           		$('.showmsg').html('账户信息'+per_det.msg)
	           		setTimeout(function(){
	           			$('.showmsg').hide();
	           		},2000)
				}
	   		}
	   	})
	//查询账户信息
	}
 
   	var userid = {
		"userId":mainUser.userId
	}
	//将json转为字符串
	var userdet = JSON.stringify(userid);
	//加密字符串
    var y_userdet = encryptByDES(userdet,key);
    
   	$('.s_name').click(function(){
   		$.ajax({
			url: adress +'/weChat/user/auth/query',
			type:'post',
			data: y_userdet,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
				request.setRequestHeader("token", token);
			},
			success:function(res){
				var des_p = res.data;
				var backdet = decryptByDESModeEBC(des_p,key);
				var back_msg = JSON.parse(backdet);
				console.log(back_msg)
				if(back_msg.code>0){
					console.log(back_msg.msg)
					if(back_msg.data.idcardIsAuth == 1 && back_msg.data.licenseIsAuth == 1){
						$('.showmsg').show()
			       		$('.showmsg').html("您已实名，无需再次认证！")
			       		setTimeout(function(){
			       			$('.showmsg').hide();
			       		},2000)
					}if(back_msg.data.idcardIsAuth == 1 && back_msg.data.licenseIsAuth != 1){
						$('.showmsg').show()
				   		$('.showmsg').html(back_msg.msg)
				   		setTimeout(function(){
				   			$('.showmsg').hide();
				   			window.location.href = 'html/drivelince.html'
				       		},2000)
						}
				} else if (back_msg.code == -1159) {
					$('.showmsg').show()
			       		$('.showmsg').html(back_msg.msg)
			       		setTimeout(function(){
			       			$('.showmsg').hide();
			       		},2000)
				}else{
					$('.showmsg').show()
			   		$('.showmsg').html(back_msg.msg)
			   		setTimeout(function(){
			   			$('.showmsg').hide();
			   			window.location.href = 'html/identity.html'
			       		},2000)
					}
				}
			})
			hides()
   	}) 
	//gps转换百度地图经纬度	   
    var r_lng = 0.011542;
    var a_lat = 0.003282;
   	//获取当前经纬度
	var thisLocation = {}
	var mk;
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(113.98118, 22.567614);
    map.centerAndZoom(point,14);
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
        	var icon = new BMap.Icon('images/loca.png', new BMap.Size(22, 22), {
			    anchor: new BMap.Size(36, 34)
			});
			icon.setImageSize(new BMap.Size(20, 20));
			var pt = new BMap.Point(r.point.lng, r.point.lat);
           	mk = new BMap.Marker(pt,{icon:icon})
            map.addOverlay(mk);
            map.panTo(r.point);
			var ln = r.point.lng*1-r_lng*1;
			var la = r.point.lat*1-a_lat*1;
            thisLocation.lng = ln;
            thisLocation.lat = la;
            thisLocation.distanceH5 = '10';     
        }
        else {
            alert('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true})
	
	//经纬度之差
    var t_lon = 0.012074;
    var t_lat = 0.003176;
    //经纬度之差
    
    //滑动地图监听事件
    map.addEventListener("moveend", showInfo);
	var centerlocat = {};
	function showInfo(){
		$('.load').show()
		center = map.getCenter();
		console.log(center)
		var lng = center.lng*1-r_lng*1;
		var lat = center.lat*1-a_lat*1;
	    centerlocat.lng = lng+'';
	    centerlocat.lat = lat+'';
	    centerlocat.distanceH5 = '3';
	    //函数调用，传参
	    console.log(centerlocat)
	    loaddata(centerlocat)
	}
    showInfo()
	//滑动地图监听事件
    
	function loaddata(thisLocation){
    	//将json转为字符串
		var aToStr=JSON.stringify(thisLocation);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
        //转为字符串，传给后台
        var data_ = str1.toString();
        map.clearOverlays()
		map.addOverlay(mk);
		//请求附近网点
	    $.ajax({
			url: adress +'/api/station/nearly/query',
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
               	var nearbyCar = netcar_.data;
               	console.log(nearbyCar)  
               	$('.load').hide()
	    		for (var i = 0; i < nearbyCar.length; i++) {
	    			var v_stype=null;
	    			var point = new BMap.Point(nearbyCar[i].lng*1+t_lon*1,nearbyCar[i].lat*1+t_lat*1);
			       	var cont = nearbyCar[i].bt;
	    			//只显示有车网点
	    			if(nearbyCar[i].ablekingLot != 0){
	    				v_stype="hascar";
	    			}else{
	    				v_stype="nocar";
	    			}
	    			addnet(point,new net_grop(nearbyCar[i].stationCode,nearbyCar[i].lng*1+t_lon*1,nearbyCar[i].lat*1+t_lat*1,nearbyCar[i].distance,v_stype))
	    		}
			},error:function(){
				console.log('出错了')
			}
		})
	    
	    //请求附近网点
	    // 默认加载地图附近车辆
	    $.ajax({
	    	url: adress +'/api/car/nearly/query',
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
               	var nearbyCar = netcar_.data;
               	console.log(nearbyCar)   
	    		for (var i = 0; i < nearbyCar.length; i++) {
			        var point = new BMap.Point(nearbyCar[i].lng*1+t_lon*1,nearbyCar[i].lat*1+t_lat*1);
			        var cont = nearbyCar[i].bt;
			        addMarker(point,new stubGroup(nearbyCar[i].carCode,nearbyCar[i].lng*1+t_lon*1,nearbyCar[i].lat*1+t_lat*1,nearbyCar[i].carCode,nearbyCar[i].distance))
			    }
	    	}
	    })
	    // 默认加载地图附近车辆
	 }    
    function stubGroup(carCode,lng,lat,carcode,distance){
        this.carCode=carCode;
        this.lng=lng;
        this.lat=lat;
        this.distance=distance;
    }
    function addMarker(point,stubGroup){
		var myIcon = new BMap.Icon("images/bf.png", new BMap.Size(30,26),{
			anchor: new BMap.Size(24, 20)
		});
		myIcon.setImageSize(new BMap.Size(24, 20));
        var marker=new BMap.Marker(point,{icon:myIcon});
        map.addOverlay(marker);
        marker.addEventListener("click",function(){
            m_selected(stubGroup,point,marker);
        })
    }
    
    //将json转为字符串
	var dtime=JSON.stringify(users);
	//加密字符串
    var time_s = encryptByDES(dtime,key);
    //转为字符串，传给后台
    var time_z = time_s.toString();
    
	// 点击地图上车辆标记获取车辆信息
    function m_selected(studGroup,point,marker){
        var carcode=studGroup.carCode;
        var lng=studGroup.lng*1-t_lon*1;
        var lat=studGroup.lat*1-t_lat*1;
 		
        var carid = {
        	"carCode": carcode,
        	"longitude" :thisLocation.lng+'',
        	"latitude" : thisLocation.lat+''
        }
    
        localStorage.removeItem('point_order');
		localStorage.setItem('car_a',JSON.stringify(carid))
		window.location.href = 'html/carone.html'		
	}

	// 点击地图网点获取车辆列表
    function net_grop(stationCode,lng,lat,distance,v_stype){
        this.stationCode=stationCode;
        this.lng=lng;
        this.lat=lat;
        this.distance=distance;
        this.v_stype=v_stype;
    }
    
    function addnet(point,net_grop){
    	var myIcon;
    	if(net_grop.v_stype=='hascar'){
    		myIcon = new BMap.Icon("images/has.png", new BMap.Size(26,26),{
    			anchor: new BMap.Size(21, 27)
    		})
    		myIcon.setImageSize(new BMap.Size(21, 27));
    	}else{
    		myIcon = new BMap.Icon("images/bj.png", new BMap.Size(26,26),{
    			anchor: new BMap.Size(21, 27)
    		})
    		myIcon.setImageSize(new BMap.Size(21, 27));
    	}
        var marker=new BMap.Marker(point,{icon:myIcon});
        map.addOverlay(marker);
        marker.addEventListener("click",function(){
            m_select(net_grop,point,marker);
        })
    }
	// 点击地图上网点标记获取车辆信息
    function m_select(studGroup,point,marker){
        var stationCode=studGroup.stationCode;
        var lng=studGroup.lng*1-t_lon*1;
        var lat=studGroup.lat*1-t_lat*1;
        //保存网点编码
        var stationid = {
        	"stationCode": studGroup.stationCode,
        	"longitude" :thisLocation.lng+'',
        	"latitude" : thisLocation.lat+''
        }
        localStorage.removeItem('point_order');
        localStorage.setItem('netcode',JSON.stringify(stationid))
  
		window.location.href = 'html/car_list.html';
    }
	// 判断是否有预约的订单
	function appoint_order(){
	    $.ajax({
	    	url: adress +'/api/tss/order/query/map',
			type:'post',
			data:time_z,
			async:true,
			withCredentials:true,
			dataType:"json",
			contentType:"application/json;charset=utf-8", 
			beforeSend: function(request) {
	      		request.setRequestHeader("token", token);
	   		},
			success:function(data){
				var times = data.data;
				var times_ing = decryptByDESModeEBC(times,key);
				var car_time = JSON.parse(times_ing);
				if(car_time.code>0){
					var orderstatus = car_time.data.orderList[0].status;
					if(orderstatus==0){
						var pointcar = JSON.stringify(car_time);
						localStorage.setItem('point_order',pointcar)
						window.location.href='html/confirm_use.html'
					}
					if(orderstatus==1){
						var cartimeing = JSON.stringify(car_time)
						localStorage.setItem('s_order',cartimeing)
						window.location.href='html/return_car.html'
					}
				}
			}
	    })
	}
	setTimeout(function(){
		appoint_order()
	},500)
	
    // 判断是否有预约的订单
    
	//点击用车，请求车辆列表,默认进来地图加载
    $('.user_car span').click(function(){
    	localStorage.setItem('location', JSON.stringify(thisLocation));
    	localStorage.removeItem('point_order');
	    window.location.href = 'html/carone_list.html'
    })
	function hides(){
      $('.person_center').css({
      "left": 0
    },100)
    }
   hides()
 	$('.person_center').css({
		"left": -100+'%'
	},100)
   //点击头像显示个人中心
   	$('.per_t').click(function(event){
   		event.stopPropagation();    //  阻止事件冒泡
   		$('.person_center').css({
         "left": 0 
        })
   	})
   	$('.person_menu').click(function(event){
   		event.stopPropagation(); 
   	})
   	//点击头像显示个人中心
   	$('.person_center').click(function(){
   		$('.person_center').css({
         "left": -100 +'%'
        })
   	})
	
})
