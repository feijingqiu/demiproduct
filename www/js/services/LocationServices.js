angular.module('starter.LocationServices', [])

.factory('Location', function() {
  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('BaiduLocationService',function($http,base64,$q,$log,$ionicSlideBoxDelegate,$ionicPopup) {
  return {
    getLatAndLng:function(){
      var deferred = $q.defer();
      console.log("正在定位中。。。");
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition( function(r) {   //定位结果对象会传递给r变量
        if(this.getStatus() == BMAP_STATUS_SUCCESS) {  //通过Geolocation类的getStatus()可以判断是否成功定位。
          deferred.resolve({data : {lat: r.latitude,lng: r.longitude,success:1}});
        }else{
          deferred.resolve({data : {lat: 0,lng: 0,success:0}});
          switch( this.getStatus() ) {
            case 2:
              alert( '位置结果未知 获取位置失败.' );
              break;
            case 3:
              alert( '导航结果未知 获取位置失败..' );
              break;
            case 4:
              alert( '非法密钥 获取位置失败.' );
              break;
            case 5:
              alert( '对不起,非法请求位置  获取位置失败.' );
              break;
            case 6:
              alert( '对不起,当前 没有权限 获取位置失败.' );
              break;
            case 7:
              alert( '对不起,服务不可用 获取位置失败.' );
              break;
            case 8:
              alert( '对不起,请求超时 获取位置失败.' );
              break;
          }
        }
      },{enableHighAccuracy: true});
      return deferred.promise;
    },
    getDetailLocation:function(){
      var deferred = $q.defer();
      var geolocation = new BMap.Geolocation();
      var gc = new BMap.Geocoder();
      geolocation.getCurrentPosition( function(r) {   //定位结果对象会传递给r变量
        if(this.getStatus() == BMAP_STATUS_SUCCESS) {  //通过Geolocation类的getStatus()可以判断是否成功定位。
          gc.getLocation(r.point, function(rs){
            deferred.resolve({
                  data : {
                  lat: r.latitude,
                  lng: r.longitude,
                  location:rs.addressComponents,
                  success:1
                  }
            });
          });
        }else{
          deferred.resolve({
            data : {
              lat: 0,
              lng: 0,
              location:{},
              success:1
            }
          });
          switch( this.getStatus() ) {
            case 2:
              alert( '位置结果未知 获取位置失败.' );
              break;
            case 3:
              alert( '导航结果未知 获取位置失败..' );
              break;
            case 4:
              alert( '非法密钥 获取位置失败.' );
              break;
            case 5:
              alert( '对不起,非法请求位置  获取位置失败.' );
              break;
            case 6:
              alert( '对不起,当前 没有权限 获取位置失败.' );
              break;
            case 7:
              alert( '对不起,服务不可用 获取位置失败.' );
              break;
            case 8:
              alert( '对不起,请求超时 获取位置失败.' );
              break;
          }
        }
      },{enableHighAccuracy: true});
      return deferred.promise;
    }
  };
})


;
