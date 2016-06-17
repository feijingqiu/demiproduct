angular.module('starter.HomeServices', ['ab-base64'])
.factory('HomeAdService',function($http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading) {
	return {
    top_ads: function(requestBody)  {
      var MR_S_Num = 'MR_S006';
      return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
    },
    bottom_ads: function(requestBody)  {
      var MR_S_Num = 'MR_S010';
      return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
    }
	};
})
.factory('HomeAddressService',function($http,base64,$q,$log,$ionicSlideBoxDelegate,$ionicPopup) {
	var request = {};
	request.head=getRequestHead_json();
	return {
		addresses:function(){
			   var deferred = $q.defer();
			     request.body={};
			     var encodeStr = base64.encode(angular.toJson(request));
			     $http.get(getRestFulHostURl()+'?action=MR_S023&params='+encodeStr)
			     .success(function(response) {
			          deferred.resolve({
			             city_data : response.data,
			 	    	 hot_city : response.data.hot_city
			          });
			       }).error(function(msg, code) {
			          deferred.reject(msg);
			          $log.error(msg, code);
			       });
			     return deferred.promise;
		},
		getLocation:function(){
			var deferred = $q.defer();
			console.log("正在定位中。。。");
			var geolocation = new BMap.Geolocation();
			var gc = new BMap.Geocoder();

			geolocation.getCurrentPosition( function(r) {   //定位结果对象会传递给r变量
				if(this.getStatus() == BMAP_STATUS_SUCCESS) {  //通过Geolocation类的getStatus()可以判断是否成功定位。
			    	var pt = r.point;
			        gc.getLocation(pt, function(rs){
			        	var addComp = rs.addressComponents;
			        	var currentCity = addComp.city;
			        	var oldLocation = $("#location").text();
						console.log(currentCity);
			        	if(oldLocation.trim()==""){

			        		deferred.resolve({mrLocation : currentCity});
			        	}else if(oldLocation.trim()!=currentCity){
							// 一个确认对话框
							var confirmPopup = $ionicPopup.confirm({
								title: '提示',
								template:"系统定位到你在"+currentCity+",需要切换至"+currentCity+"吗？",
								cancelText: '取消',
								okText: '切换城市' // String (默认: 'OK')。OK按钮的文字。
							});
							confirmPopup.then(function(res) {
								if(res) {
									deferred.resolve({mrLocation : currentCity});
								} else {
								}
							});
			        	}
			        });
				}else{
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

.factory('HomeMenuService',function($http,base64,$q,$log,$ionicSlideBoxDelegate,$ionicLoading) {
	var menus = [];
	var request = {};
	request.head=getRequestHead_json();
	return {
		all: function (requestBody) {
			var MR_S_Num = 'MR_S007';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		}
  }
})
.factory('HomeStoreService',function($http,base64,$q,$ionicSlideBoxDelegate,$log,$ionicLoading) {
	var request = {};
	request.head=getRequestHead_json();
	return {
		getHotStoreList: function(requestBody)  {
			var MR_S_Num = 'MR_S008';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		},
			getStoreInfo: function(requestBody)  {
				var MR_S_Num = 'MR_S016';
				return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
			},
			getAllProductList: function(requestBody)  {
				var MR_S_Num = 'MR_S017';
				return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
			}
	};
})
.factory('HomeProductService',function($http,base64,$q,$ionicSlideBoxDelegate,$ionicLoading,$log) {
	return {
		productDetail: function (requestBody) {
			var MR_S_Num = 'MR_S014';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		},
		getHotProductList: function (requestBody) {
			var MR_S_Num = 'MR_S009';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		}
	};
})
//租赁服务
.factory('HomeLeaseService',function($http,base64,$ionicLoading,$q,$log,$ionicSlideBoxDelegate) {
	return {
		getDetail: function (requestBody) {
			var MR_S_Num = 'MR_S091_01';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		},
		allSearch: function (requestBody) {
			var MR_S_Num = 'MR_S093';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		}
	};
})
//招聘服务
.factory('HomeRecruitService',function($http,base64,$ionicLoading,$q,$log,$ionicSlideBoxDelegate) {
	return {
		recruitSearch: function (requestBody) {
			var MR_S_Num = 'MR_S098';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		},
		getRecruitDetail: function (requestBody) {
			var MR_S_Num = 'MR_S096_01';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		}
	};
})
//产品相关
.factory('HomeSelectProductService',function($http,base64,$ionicLoading,$q,$log,$ionicSlideBoxDelegate) {
	return {
		getProductList: function (requestBody) {
			var MR_S_Num = 'MR_S013';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		},
		getProduct_categoryList: function (requestBody) {
			var MR_S_Num = 'MR_S030';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
		}
	};
})
//加工厂相关
.factory('HomeProcessService',function($http,base64,$ionicLoading,$q,$log,$ionicSlideBoxDelegate) {
    return {
      getHot_processList: function (requestBody) {
        var MR_S_Num = 'MR_S084';
        return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
      },
      getMenuList: function (requestBody) {
        var MR_S_Num = 'MR_S082';
        return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
      },
      searchProcessList: function (requestBody) {
        var MR_S_Num = 'MR_S084';
        return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
      },
      getDetail:  function (requestBody) {
        var MR_S_Num = 'MR_S086';
        return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
      }
    };
  })



