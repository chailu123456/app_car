//接口：

//var adress=	'http://192.168.1.210:8000/qs-uas'   	//开发：

//var adress=	'http://hqsuas.qisu666.com/qs-uas'   	//灰度：

//var adress= 'http://218.17.140.195:8000/qs-uas'     //外网

var adress = 'http://qsuas.qisu666.com/qs-uas'  //生产  

//加密
function encryptByDES(message,key) {
    //把私钥转换成16进制的字符串

    var keyHex = CryptoJS.enc.Utf8.parse(key);
    //模式为ECB padding为Pkcs7
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    //加密出来是一个16进制的字符串
    return encrypted.ciphertext.toString();
}
//DES  ECB模式解密
function decryptByDESModeEBC(ciphertext,key) {
    //把私钥转换成16进制的字符串
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    //把需要解密的数据从16进制字符串转换成字符byte数组
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    //以utf-8的形式输出解密过后内容
    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}