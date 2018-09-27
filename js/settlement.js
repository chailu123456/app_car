$(function(){
		
	//获取结算页面的信息
	var settle = JSON.parse(localStorage.getItem('acount_money'));
	console.log(settle)
	var real_data = settle.data;
	//里程费
	$('.mileage').html(real_data.mileageConsum/100+'元');
	//里程
	$('.allmileage').html(real_data.endMileage*1-real_data.beginMileage*1+'公里')
	//时长费
	$('.time_me').html(real_data.timeConsum/100+'元')
	//电量费用
	$('.elec').html(real_data.electricConsum/100+'元')
	//挪车服务
	$('.sever_m').html(real_data.parkedAmount/100+'元')
	//总计费用
	$('.allcount').html(real_data.totalConsum/100+'元')
	//实际付款
	$('.payment').html(real_data.payAmount/100+'元')
	$('.payments').html(real_data.payAmount/100)

	$('.discount').html(real_data.remark);
	
	$('.give_car').click(function(){
    	
    	window.location.href = '../index.html'

	})
	
	//获取使用时长
	var uesr_timing = (real_data.returnTimeLong*1-real_data.borrowTimeLong*1)/1000;
	formatSeconds(uesr_timing)
	function formatSeconds(value) {
	    var theTime = parseInt(value);// 秒
	    var theTime1 = 0;// 分
	    var theTime2 = 0;// 小时
	    if(theTime > 60) {
	        theTime1 = parseInt(theTime/60);
	        theTime = parseInt(theTime%60);
	            if(theTime1 > 60) {
	            	theTime2 = parseInt(theTime1/60);
	            	theTime1 = parseInt(theTime1%60);
	            }
	    }
	    var result = ""+parseInt(theTime)+"秒";
	    if(theTime1 > 0) {
	    	result = ""+parseInt(theTime1)+"分"+result;
	    }
	    if(theTime2 > 0) {
	    	result = ""+parseInt(theTime2)+"小时"+result;
	    }
	   	$('.alltimings').html('('+result+')')
	    return result;
	
	}
		
})
