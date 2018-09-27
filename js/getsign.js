$(function(){
	
	var key = 'HL1HBF6lLND721';
	var token = "201801171503190304";
	var appid = 'wxa1913349bc1e72dd';
	var thisadress = location.href.split('#')[0];
    var urls =encodeURIComponent(thisadress);  //地址转码
    var urladress = {
        "url" : urls
    }
    //将json转为字符串
    var a_url=JSON.stringify(urladress);
    //加密字符串
    var str_url = encryptByDES(a_url,key);

    //转为字符串，传给后台
    var give_url = str_url.toString();
    $.ajax({
    //    url: 'http://hqsuas.qisu666.com/qs-uas/weChat/pile/getSign',
        url: adress +'/weChat/pile/getSign',
        type:'post',
        async:true,
        data:give_url,
        withCredentials:true,
        dataType:"json",
        contentType:"application/json;charset=utf-8", 
        beforeSend: function(request) {
            request.setRequestHeader("token", token);
        },
        success:function(res){
            var e_ord = res.data;
            var ordNum = decryptByDESModeEBC(e_ord,key);
            var allorderq = JSON.parse(ordNum)
            console.log(allorderq)
            var num = allorderq.data;
            wx.config({
                debug: false, 
                appId: 'wxa1913349bc1e72dd', // 必填，公众号的唯一标识
                timestamp: num.timestamp, // 必填，生成签名的时间戳
                nonceStr:  num.nonceStr, // 必填，生成签名的随机串
                signature: num.signature,// 必填，签名
                jsApiList : [ 'checkJsApi', 'scanQRCode','chooseWXPay','onMenuShareTimeline','onMenuShareAppMessage']
            });
            wx.error(function(res) {
                console.log("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });
        }
    })
	
	
	
	
	
	
	
	
})
