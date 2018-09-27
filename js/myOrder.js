$(function(){
	
	var mainUser = JSON.parse(localStorage.getItem('main'));
	console.log(mainUser)
	var token ='201801171503190304';
	//用户id
	var userCode = mainUser.userId;
	
	 $('nav span').click(function(){
	 	$('.orderlist ul').hide().eq($(this).index()).show();
	 	$('nav span').eq($(this).index()).addClass('well').siblings().removeClass('well');
	 })
	var myord = {
	 	"userCode" : userCode,
	  	"orderType" : "2",
	  	"optType" : "3,4,5",
	  	"pageNum" : "1",
	  	"pageSize" : "50" 
	}
	loaddata(myord)
	
	function loaddata(myord){
	    //加密的私钥
    	var key = 'HL1HBF6lLND721';
  
    	//将json转为字符串
		var aToStr=JSON.stringify(myord);
		//加密字符串
        var str1 = encryptByDES(aToStr,key);
       	//解密字符串
        var str2 = decryptByDESModeEBC(str1,key);
        //转为字符串，传给后台
        var data_ = str1.toString();
		console.log(data_)
		//订单查询
	    $.ajax({
			url: adress +'/api/my/order/type/query',
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
				var allorder = data.data;
				var orderNum = decryptByDESModeEBC(allorder,key);
                var orderlist = JSON.parse(orderNum).data.myOrderList;
               	console.log(orderlist)
               	
               	var f_orders = '',nf_orders='',cancle_orders = '';
               	$('.load').hide()
               	if(orderlist.length==0){
               		var cd = '<div><img class="nord" src="../images/zan.png"><div>'	
               		$('.finishorder').html(cd)
               	}else{
               		for(var i=0;i<orderlist.length;i++){
	               		if(orderlist[i].status==3 || orderlist[i].status==5){
	               			f_orders+='<li class="finish" id='+ orderlist[i].orderCode +'><p class="order_title"><img src="../images/ord.jpg"/><span>'
		               				+ orderlist[i].returnTime + '</span><em>已完成</em><img class="find" src="../images/arr.jpg"/></p><div class="adress_money"><div class="adress_l"><img src="../images/lis.jpg"/><p>起 <em>'
		               				+ orderlist[i].beginLocationTxt + '</em></p><p>终 <em>'
		               				+ orderlist[i].endLocationTxt +'</em></p></div><div class="money_r"><p>￥'
		               				+ orderlist[i].payAmount/100 +'</p><span>实付金额</span></div></div></li>'
		               		$('.finishorder').html(f_orders)
		               		
	               		}if(orderlist[i].status==0 || orderlist[i].status==1){
	               			nf_orders +='<li id='+ orderlist[i].orderCode +' class="conduct_order"><p class="order_title"><img src="../images/ord.jpg"/><span>'
	               					  + orderlist[i].returnTime + '</span><em class="inorder">进行中</em><img class="find" src="../images/arr.jpg"/></p><div class="adress_money"><img src="../images/ordl.jpg"/><span>'
	               					  + orderlist[i].beginLocationTxt +'</span></div></li>'
	               			$('.nofinish_order').html(nf_orders)
	               		}if(orderlist[i].status==4){
	               			cancle_orders +='<li id='+ orderlist[i].orderCode +' class="conduct_order cancle"><p class="order_title"><img src="../images/ord.jpg"/><span>' 
	               			+ orderlist[i].createdTime + '</span><em class="cancle">已取消</em><img class="find" src="../images/arr.jpg"/></p><div class="adress_money"><img src="../images/ordl.jpg"/><span>'
	               			+ orderlist[i].beginLocationTxt +'</span></div></li>'
	               			$('.cancle_order').html(cancle_orders)
	               		}	
	               	}
               	}
               	$('.finish').click(function(){
					$(this).each(function(){
						var orderid = $(this).attr('id');
						window.location.href = 'myOrderdetail.html?id='+orderid
					})
               	})
               	$('.cancle').click(function(){
					$(this).each(function(){
						var orderid = $(this).attr('id');
						window.location.href = 'myOrdercancle.html?id='+orderid
					})
               	}) 	
			},error:function(){
				console.log('出错了')
			}
		})
	}
		
})
