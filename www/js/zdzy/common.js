function getRequestHead(){
	var width = window.innerWidth;
    var height = window.innerHeight;
    return 'mr_device_screenw='+width+'&mr_device_screenh='+height+'&mr_device_type=iphone';
}
function getRequestHead_json(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	return {mr_device_screenw:width,mr_device_screenh:height,mr_device_type:'iphone',mr_encrypt_date:new Date().getTime()};
}
function getRestFulHostURl(){
	/*return "http://product.gzdemi.com/restapiController/service.do";*/
	return "http://product.gzdemi.com/restapiController/service.do";
}

/**
*
* @param percentage 宽度百分比,边距
* @param padding
* @returns {{}}
*/
function getProductPhotoSize(percentage,padding){
   var width = (window.innerWidth-padding*5)*percentage/100;
   var height = width;
   return 'width:'+width+'px;height:'+height+'px;';
}

function getPhotoDetailSize(percentage,padding){
   var width = window.innerWidth;
   var height = window.innerHeight*percentage/100;
   return 'width:'+width+'px;height:'+height+'px;';
}
function getPhotoDetailSize100(percentage,padding){
   var width = window.innerWidth;
   var height = window.innerHeight*percentage/100;
   return '&width='+parseInt(width*2)+'&height='+parseInt(height*2);
}
var IMAGE_VIEW_SIZE = {
	    CHAT_VIEW:"&width=200&height=200&quality=0.75",
	    STORE_HEARDER:"&width=300&height=300&quality=0.75",
	    IMAGE_MESSAGE_VIEW:"&width=200&height=260&quality=0.75"
	}
var WATCH_IMAGE_VIEW = '&width='+(window.innerWidth*3)+'&quality=0.75'; //图片预览压缩比例
function getPromise(requestBody, MR_S_Num, http, q, log, ionicSlideBoxDelegate, base64,ionicLoading) {
   var request = {};
   request.head = getRequestHead_json();
   var deferred = q.defer();
   request.body = requestBody;
   var encodeStr = base64.encode(angular.toJson(request));
   console.log("请求接口：");
   console.log(MR_S_Num);
   console.log("请求内容：");
   console.log(request);

   http({
      method: "post",
      url: getRestFulHostURl(),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params:{action:  MR_S_Num, params: encodeStr}
   }).success(function (response) {
      /*  var time = response.config.responseTimestamp - response.config.requestTimestamp;
       console.log('The request took ' + (time / 1000) + ' seconds.');*/
      console.log(response);
      deferred.resolve({

         resp: response
      });
   })
       .error(function (msg, code) {
          deferred.reject(msg);
          console.log(code);
          ionicLoading.hide();
          log.error(msg, code);
          ionicLoading.show({
                 template: '网络连接失败，请检查网络连接后重新提交！',
                 duration:3000
              }
          );
       }).then(function(response) {
          /*console.log(response);
           var time = response.config.responseTimestamp - response.config.requestTimestamp;*/
       });
   /*http.get(getRestFulHostURl() + '?action=' + MR_S_Num + '&params=' + encodeStr)*/
   return deferred.promise;
}
