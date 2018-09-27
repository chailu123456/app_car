$(function(){
	var geturl = window.location.href;  //获取当前链接
	var ary = geturl.split('?')[1];  //将当前链接分割为俩部分,获取后面的部分
	var orderCode = ary.split('=')[1];
	console.log(orderCode)
	
	var ordId = {
	  "orderCode" : orderCode
	}
	var token ='201801171503190304';
	//加密的私钥
	var key = 'HL1HBF6lLND721';
	//将json转为字符串
	var aToStr=JSON.stringify(ordId);
	//加密字符串
    var strord = encryptByDES(aToStr,key);
    //转为字符串，传给后台
    var ordID = strord.toString();
	$.ajax({
		url: adress +'/api/tss/order/list',
		type:'post',
		data:ordID,
		async:true,
		withCredentials:true,
		dataType:"json",
		contentType:"application/json;charset=utf-8", 
		beforeSend: function(request) {
      		request.setRequestHeader("token", token);
   		},
   		success:function(res){
   				$('.load').hide()
   			var d_bg= res.data;
			var d_back = decryptByDESModeEBC(d_bg,key);
            var md_back = JSON.parse(d_back);
           	console.log(md_back)
           	if(md_back.code>0){
           		var ord = md_back.data.oneOrder;
           		$('.stat_time').html(ord.borrowTime)
           		$('.last_time').html(ord.returnTime)
           		if(ord.borrowType ==0){
           			$('.ordtype').html('分时租赁')
           		}else{
           			$('.ordtype').html('按日租赁')
           		}
           		if(ord.driverType ==0){
           			$('.usetype').html('自驾租车')
           		}else{
           			$('.usetype').html('代驾租车')
           		}
           		$('.ord_code').html(ord.outTradeNo)
           		$('.kilimF').html(ord.mileageConsum/100+'元')
           		$('.timeF').html(ord.timeConsum/100 +'元')
           		$('.ncarF').html(ord.parkedConsum/100+'元')
           		$('.elec_free').html(ord.electricConsum/100 +'元')
           		var allkil = ord.endMileage-ord.beginMileage
           		$('.kil_free').html('('+allkil+'公里)')
           		$('.allmoney em').html(ord.totalConsum/100+'元')
           		$('.autopay em').html(ord.payAmount/100+'元')
           		$('.discount').html(ord.remark)
           	
           	}else {
           		$('.showmsg').show()
           		$('.showmsg').html(md_back.msg)
           		setTimeout(function(){
           			$('.showmsg').hide();
           		},2000)
           	}
   		}
	})
	
	
	
	
	
})
