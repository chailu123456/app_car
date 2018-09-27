$(function(){
	
	var get_per = JSON.parse(localStorage.getItem('main'));
	
	var uesrid =get_per.userId;
	var token ='201801171503190304';
	//加密的私钥
   	var key = 'HL1HBF6lLND721';
   	
	//获取钱包的钱
	var d_per = JSON.parse(sessionStorage.getItem('person_mo'));

   //	console.log(d_per.per_mon)
	//获取钱包的钱
	$('button').click(function(){
		var z_cod = $('#z_code').val();
		if(z_cod.length < 5 || z_cod ==''){
			$('.showmsg').show();
       		$('.showmsg').html('请输入正确的编码');
       		setTimeout(function(){
       			$('.showmsg').hide();
       		},2000)
		}
//		else if(d_per.per_mon<0){
//			$('.showmsg').show();
//     		$('.showmsg').html('余额不足，请充值');
//     		setTimeout(function(){
//     			$('.showmsg').hide();
//     		},2000)
//		}
		else{
			var s_cd = {
			   "userId":uesrid,
			   "gunCode":z_cod
			}
			var aredode = JSON.stringify(s_cd);
			//加密字符串
		    var strid = encryptByDES(aredode,key);
	
		    //转为字符串，传给后台
			$.ajax({
				type:'post',
				url: adress+'/weChat/pile/records/query',
				data:strid,
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
						sessionStorage.setItem('guncode', z_cod);
						window.location.href='stationdetails.html';
					}else{
						$('.showmsg').show();
	               		$('.showmsg').html(allorder.msg);
	               		setTimeout(function(){
	               			$('.showmsg').hide();
	               		},2000)
					}
		   		}
			})
		}
		
	})	
})
