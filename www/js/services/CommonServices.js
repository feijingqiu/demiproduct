angular.module('starter.CommonServices', [])
.factory('CommonAreaService', function ($http, $q, $log, $ionicSlideBoxDelegate, base64,$ionicLoading) {
	return {
		getAll: function (requestBody) {
			var MR_S_Num = 'MR_S059';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate, base64,$ionicLoading);
		}
	}
})
//地区数据获取
.factory('CommonAddressDataService',function( $http,$window, $q, $log, $ionicSlideBoxDelegate, base64,$ionicLoading) {
	var address_data_key = 'mr_addressData';
	return {
		getAddressData: function () {
			var stored = $window.localStorage.getItem(address_data_key);
			try {
				stored = angular.fromJson(stored);
			} catch (error) {
				stored = null;
			}
			if (stored === null) {
				stored = null;
			}
			return stored;
		},
		updateAddressData: function (address_data) {
      $window.localStorage.setItem(address_data_key, angular.toJson(address_data));
		},
		clearAddressData: function (history_type) {
      $window.localStorage.removeItem(address_data_key);
		},
		getCityData:function (requestBody) {//获取城市数据，包括热门城市
			var MR_S_Num = 'MR_S023';
			return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate, base64,$ionicLoading);
		}
	};
})
//搜索历史数据处理
.factory('CommonSearchHistoryService',function($http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading) {
		return {
			getHistoryKeywordList: function (history_type) {
				var stored = localStorage.getItem(history_type+'_searchHistory_'+getRequestHead_json().mr_user_id);
				try {
					stored = angular.fromJson(stored);
				} catch (error) {
					stored = null;
				}
				if (stored === null) {
					stored = null;
				}
				return stored;
			},
			updateHistoryKeyword: function (history_type, history_keyword) {
				var history_info = {
					history_keyword:history_keyword,
					insert_time:(new Date).getTime()
				};
				var searchHistory_key = history_type+ '_searchHistory_'+getRequestHead_json().mr_user_id;
				var result_info = localStorage.getItem(searchHistory_key);
				var searchHistory_keywordType = 'product';
				try {
					result_info = angular.fromJson(result_info);
				} catch (error) {
					result_info = null;
				}
				if (result_info === null) {
					result_info = {
						keywordList:[
							{
								history_keyword:history_keyword,
								insert_time:(new Date).getTime()
							}
						]
					}
				}else{
					var listLength = result_info.keywordList.length;
					if(listLength>0){
						for(var i=0;i<listLength;i++){
							if(result_info.keywordList[i].history_keyword ==history_keyword ){
								result_info.keywordList.splice(i,1);
								result_info.keywordList.unshift({
									history_keyword:history_keyword,
									insert_time:(new Date).getTime()
								});
								i=listLength;
							}else{
								if(i==listLength-1){
									if(listLength==10){
										result_info.keywordList.pop();
									}
									result_info.keywordList.unshift({
										history_keyword:history_keyword,
										insert_time:(new Date).getTime()
									});
								}

							}
						}
					}else{
						result_info.keywordList[0] ={
							history_keyword:history_keyword,
							insert_time:(new Date).getTime()
						};
					}
				}
				localStorage.setItem(searchHistory_key, angular.toJson(result_info));
			},
			clearHistoryKeywordList: function (history_type) {
				var searchHistory_key = history_type+ '_searchHistory_'+getRequestHead_json().mr_user_id;
				localStorage.removeItem(searchHistory_key);
			},
			deleteOneKeyword:function (history_type, keyword_index) {
				var searchHistory_key = history_type+ '_searchHistory_'+getRequestHead_json().mr_user_id;
				var result_info = localStorage.getItem(searchHistory_key);
				result_info = angular.fromJson(result_info);
				result_info.keywordList.splice(keyword_index,1);
				localStorage.setItem(searchHistory_key, angular.toJson(result_info));
			},
			getHotProductSearch: function (requestBody) {
				var MR_S_Num = 'MR_S020';
				return getPromise(requestBody, MR_S_Num, $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
			}
		};
	})
//本地 Storage 库数据获取
.factory('LocalStorageService',function() {
		return {
			getData: function (data_key) {
				var stored = localStorage.getItem(data_key);
				try {
					stored = angular.fromJson(stored);
				} catch (error) {
					stored = null;
				}
				if (stored === null) {
					stored = null;
				}
				return stored;
			},
			updateData: function (data_key,data_info) {
				localStorage.setItem(data_key, angular.toJson(data_info));
			},
			clearData: function (data_key) {
				localStorage.removeItem(data_key);
			}
		};
	})
//地区数据获取
  .factory('ColorCardService',function( $http,$window, $q, $log, $ionicSlideBoxDelegate, base64,$ionicLoading) {
    var colorCard_data_key = "colorCard";
    return {
      getColor_cardData: function () {
        var colorCard_data = $window.localStorage.getItem(colorCard_data_key);
        try {
          colorCard_data = angular.fromJson(colorCard_data);
        } catch (error) {
          colorCard_data = null;
        }
        if (colorCard_data === null) {
          colorCard_data = null;
        }
        return colorCard_data;
      },
      updateColor_cardData: function (colorCard_data) {
        $window.localStorage.setItem(colorCard_data_key, angular.toJson(colorCard_data));
      },
      getColor_cardList:function(requestBody){
        return getPromise(requestBody, "MR_Color_card_query", $http, $q, $log, $ionicSlideBoxDelegate,base64,$ionicLoading);
      }
    };
  })

