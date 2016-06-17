angular.module('starter.HomeControllers', ['ionic-modal-select','starter.CommonControllers','starter.LocationServices','starter.controllers'])
.controller('HomeCtrl',  function($scope,$rootScope,$anchorScroll,ColorCardService,$controller,$ionicLoading,Chats,$state,$ionicPopup,BaiduLocationService,$ionicScrollDelegate,HomeAdService,HomeAddressService,HomeMenuService,HomeStoreService,HomeProductService,LocalStorageService,$location, $timeout,$ionicSlideBoxDelegate) {
	//测试定位滚动
	/*	ng-click="goto()"
	$scope.num=1;
	$scope.goto = function () {
		$location.hash('tiantian'+$scope.num);
		$anchorScroll();
		$scope.num = $scope.num +10;
		console.log($scope.num);
	}*/
	$rootScope.hideTabs = ' ';
	wx.config({
	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: 'wx9d94bc35a4082e42', // 必填，公众号的唯一标识
	    timestamp: new Date().getTime(), // 必填，生成签名的时间戳
	    nonceStr: '', // 必填，生成签名的随机串
	    signature: '',// 必填，签名，见附录1
	    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	$scope.default_city = '广州市';
	$scope.mrLocation = {
			value:''
	};
	$rootScope.go = function (path) {
		$location.path(path);
	}

	//待优化，每次个菜单对应 的 状态名称 跟 菜单ID 应该直接对应
	$scope.clickMenuGo = function(menu){
		if(menu.flag == 1){
			$state.go('tab.home-product-selection',{menu_id:menu.menuid,menu_name:menu.menuname});
		}else if(menu.flag == 4){
			$state.go('tab.home-recruit');
		}else if(menu.flag == 3){
			$state.go('tab.home-lease');
		}else if(menu.flag == 2){
			$state.go('tab.home-process');
		}else if(menu.flag == 5){
			$state.go('tab.home-color-card');
		}
	};
    /**
     * 地址数据
     */
    HomeAddressService.addresses().then(function(response){
    	$scope.city_data = response.city_data;
    	$scope.hot_city = response.hot_city;
    	/*console.log($scope.city_data);*/
    },
    function(errorMessage){
    	$scope.error=errorMessage;
    });
    //首页顶部广告部分
	$scope.search_top_ads = function(){
		HomeAdService.top_ads({}).then(function(response){
        console.log(response);
				$scope.images = response.resp.data.datas;
				$scope.img_style = response.resp.data.mengran_img_style;
				mr_slideBoxUpdate();
			},
			function(errorMessage){
				$scope.error=errorMessage;
			}
		);
	}
    //首页icons部分
	$scope.search_all = function(){
		//首页icons部分
		HomeMenuService.all({"menu_type_id":"1"}).then(function(response){
				$scope.menus = response.resp.data.datas[0];
				$scope.img_style_icons = response.resp.data.mengran_img_style;
				mr_slideBoxUpdate();
			},
			function(errorMessage){
				$scope.error=errorMessage;
		});
	};

	$scope.search_hotStoreList = function(city_name){
		HomeStoreService.getHotStoreList({city_name:city_name}).then(function(response){
				$scope.stores = response.resp.data.datas;
				$scope.img_style_store = response.resp.data.mengran_img_style;
				mr_slideBoxUpdate();
			},
			function(errorMessage){
				$scope.error=errorMessage;
			});
	};

	$scope.moreDataCanBeLoaded = false;
	$scope.get_product_parms={
		city_name:'',
		currentPage:1,
		pageSize:15
	};//请求参数集合
	$scope.productImageStyle = getProductPhotoSize(33.3333,1);

	$scope.getProductList = function(city_name){
		$scope.moreDataCanBeLoaded = false;
		$scope.get_product_parms.city_name = city_name;
		HomeProductService.getHotProductList($scope.get_product_parms).then(function(response){
				$ionicLoading.hide();
				$scope.products = response.resp.data.datas;
				$scope.img_style_product = response.resp.data.mengran_img_style;
				mr_slideBoxUpdate();
				if($scope.products.length == $scope.get_product_parms.pageSize){
					$timeout(function() {
						$scope.moreDataCanBeLoaded = true;
					},2000);
				}
			},
			function(errorMessage){
				$ionicLoading.hide();
				$scope.error=errorMessage;
			}
		);
	};
	//重新定位获取数据
	$scope.reset_location = function(){
		BaiduLocationService.getDetailLocation().then(function(response){
				if(response.data.success!=1){
					if($scope.mrLocation.value == ''){
						$scope.mrLocation.value = $scope.default_city;
						$scope.doRefresh();
					}
				}else{
					if($scope.mrLocation.value == ''){
						LocalStorageService.updateData('historyCity',response.data.location.city);
						$scope.mrLocation.value = response.data.location.city;
						$scope.doRefresh();
					}else if($scope.mrLocation.value != response.data.location.city){
						// 一个确认对话框
						$ionicPopup.confirm({
							title: '提示',
							template:"系统定位到你在"+ response.data.location.city+",需要切换至"+ response.data.location.city+"吗？",
							cancelText: '取消',
							okText: '切换城市' // String (默认: 'OK')。OK按钮的文字。
						}).then(function(res) {
							if(res) {
								LocalStorageService.updateData('historyCity',response.data.location.city);
								$scope.mrLocation.value = response.data.location.city;
								$scope.doRefresh();
							} else {

							}
						});
					}
				}
			},
			function(errorMessage){
				$scope.error=errorMessage;
			});
	};
	//刷新
	$scope.doRefresh = function(){
		$scope.get_product_parms.currentPage=1;
		$scope.search_hotStoreList($scope.mrLocation.value);
		$scope.getProductList($scope.mrLocation.value);
		if(angular.isUndefined($scope.icons)||angular.isUndefined($scope.images)){
			if(angular.isUndefined($scope.menus)){
				$scope.search_all(); //查询首页菜单
			}
			if(angular.isUndefined($scope.images)){
				$scope.search_top_ads();
			}
		}
		$scope.$broadcast('scroll.refreshComplete');
	};
	//获取页面数据
	$scope.getHomePageData = function(){
		$ionicLoading.show();
		$scope.search_top_ads();
		$scope.search_all();
		if(LocalStorageService.getData('historyCity')==null){
			$timeout(function() {
				if($scope.mrLocation.value==''){
				/*	$scope.mrLocation.value = $scope.default_city;*/
					$scope.doRefresh();
					$scope.text = response.data.location.city;
					$("#location").text(response.data.location.city);
				}
			},25000);
		}else{
			$scope.mrLocation.value = LocalStorageService.getData('historyCity');
			$scope.search_hotStoreList($scope.mrLocation.value);
			$scope.getProductList($scope.mrLocation.value);

		}
		setTimeout(function() {
			$scope.reset_location();
		},2000);
	};
	$scope.getHomePageData();
	//页翻
	$scope.load_more_products = function () {
			if ($scope.products.length < $scope.get_product_parms.pageSize) {
				console.log("无下一页");
				$scope.moreDataCanBeLoaded = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			} else {
				console.log("有下一页");
				$scope.get_product_parms.currentPage += 1;//下一页
				var requestBody = $scope.get_product_parms;
				HomeProductService.getHotProductList(requestBody).then(function (response) {
						if (response.resp.success != 1) {
							$ionicLoading.hide();
							/*$ionicPopup.alert({
								template: response.resp.error
							});*/
							$timeout(function () {
								$scope.$broadcast('scroll.infiniteScrollComplete');
							},3000);
						} else {
							if (angular.isDefined(response.resp.data.datas) && response.resp.data.datas.length > 0) {
								console.log("下一页有数据");
								console.log(response.resp.data.datas.length);
								//添加到原有数据集
								$scope.products = $scope.products.concat(response.resp.data.datas);
								if (response.resp.data.datas.length == $scope.get_product_parms.pageSize) {
									console.log("新的一页满页数据");
								} else {
									//当前获取数据不足一页
									console.log("新的一页不满数据");
									$scope.moreDataCanBeLoaded = false;
								}
							} else {
								console.log("下一页无数据");
								$scope.moreDataCanBeLoaded = false;
							}
							/*mr_slideBoxUpdate();*/
							console.log("-----翻页后翻页状态--------");
							console.log($scope.moreDataCanBeLoaded);
							$timeout(function () {
								$scope.$broadcast('scroll.infiniteScrollComplete');
							},3000);
							/*$scope.$broadcast('scroll.infiniteScrollComplete');*/
						}
					},
					function (errorMessage) {
						$scope.error = errorMessage;
					}
				);
			}
		};
    /**
     * 更新slideBox
     */
    function mr_slideBoxUpdate(){
    	setTimeout(function() {
	    	$ionicSlideBoxDelegate.slide(0);
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
			$ionicScrollDelegate.resize();
    	});
    }
	angular.extend(this, $controller('CommonCitySelectWindowCtrl',{$scope: $scope}));
		$scope.$on('$fromCitySelectWindow', function (e, data) {
			if($scope.mrLocation.value !=  data.name){
				$scope.mrLocation.value =  data.name;
				$scope.doRefresh();
			}
			$scope.closeCitySelectWindow();
		});

    ColorCardService.getColor_cardList({}).then(function(response){
      if(response.resp.success==1){
        ColorCardService.updateColor_cardData(response.resp.data.datas);
      }
    },function(errorMessage){
        $scope.error=errorMessage;
    });
})
//产品筛选页面
.controller('ProductSelectionCtrl', function ($scope,$state,$controller,HomeSelectProductService,CommonSearchHistoryService, $stateParams,$ionicSlideBoxDelegate,$ionicLoading,$ionicModal,$rootScope,$ionicPopover){
		angular.extend(this, $controller('CommonLoadMoreParentCtrl',{$scope: $scope}));
		$scope.purchaseImageStyle = getProductPhotoSize(50,3);
		$scope.image_fontStyle ='width:'+(window.innerWidth*0.5 - 8)+'px';
		//排序
		$scope.productSortList = [
			{sortCode:'attentionCount',sortName:'关注度'},
			{sortCode:'browseCount',sortName:'预览量'},
			{sortCode:'create_stamp',sortName:'最新'}
		];
		$scope.category_name_show = "类目";
		if ($stateParams.menu_name != null && $stateParams.menu_name != '') {
			$scope.category_name_show = $stateParams.menu_name;
		}
		$scope.activeButton='create_stamp';
		$scope.parameters = {
			keyword:$stateParams.keyword||'',
			city_id:"",
			city_name:"",
			province_id:'',
			county_id:'',
			is_new:"",
			min_amount:"",
			product_category_id:"",
			minprice:0,
			maxprice:100,
			menuid:$stateParams.menu_id||'',
			pageSize:16,
			orderbyType:""
		};
		$scope.moreDataCanBeLoaded = false;
		//进入页面初始化 页面请求信息以及获得初始数据
		$scope.setResultList([[]]);
		$scope.setServiceFunction([HomeSelectProductService.getProductList]);
		$scope.setRespondBody(0,$scope.parameters);
		$scope.refresh_products = function () {
			console.log($scope.parameters);
			$scope.setRespondBody(0,$scope.parameters);
			$scope.getRespondResult(0);
			if($scope.parameters.keyword!=''&&angular.isDefined($scope.parameters.keyword)){
				setTimeout(function () {
					CommonSearchHistoryService.updateHistoryKeyword('product',$scope.parameters.keyword);
				},100);
			}
		};
		/**
		 * 所有的产品分类
		 */
		$scope.getProductCategoryList = function(){
			$ionicLoading.show();
			HomeSelectProductService.getProduct_categoryList({}).then(function(response){
					if(response.resp.success!=1){
						$ionicLoading.hide();
					}else{
						$scope.product_categoryList = response.resp.data.datas;
						$scope.refresh_products();
					}
				},
				function(errorMessage){
					$ionicLoading.hide();
					$scope.error=errorMessage;
				}
			);
		};
		$scope.searchProduct = function(orderbyType){
			$scope.activeButton=orderbyType;
			$scope.parameters.orderbyType=orderbyType;
			$scope.refresh_products();
		};
		$scope.getProductCategoryList();
		$scope.$on('$fromChooseAreaResult', function (e, data) {
			$scope.parameters.city_name = '';
			for(var i=0;i<data.info.length;i++){
				if(data.info[i].id!=-1){
					if(i==0){
						$scope.parameters.province_id = data.info[i].id;
						$scope.parameters.city_id = '';
						$scope.parameters.county_id = '';
					}else if(i==1){
						$scope.parameters.city_id = data.info[i].id;
						$scope.parameters.county_id = '';
					}else if(i==2){
						$scope.parameters.county_id = data.info[i].id;
					}
					if(i==data.info.length-1||data.info[i+1].id==-1){
						if($scope.last_areaName != data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name){
							$scope.refresh_products();
						}
						$scope.last_areaName = data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name;
						return ;
					}
				}else{
					if(i==0){
						if($scope.last_areaName!=''){
							$scope.parameters.province_id = '';
							$scope.parameters.city_id = '';
							$scope.parameters.county_id = '';
							$scope.refresh_products();
						}
						$scope.last_areaName ='';
					}
				}
			}
		});
		//--------------------侧边类型选择控制
		$scope.productTypeFirstChose = '';
		$scope.productTypeFirstChoose = function(index,product_category_id,category_name){
			//若无下级类型
			if($scope.product_categoryList[index].children.length<1){
				$scope.productTypeChildrenChoose(product_category_id,category_name);
				$scope.productTypeFirstChose = '';
				return;
			}
			if($scope.productTypeFirstChose == product_category_id){
				$scope.productTypeFirstChose = '';
			}else{
				$scope.productTypeFirstChose = product_category_id;
			}
		};
		$scope.productTypeChildrenChose = '';
		$scope.productTypeChildrenChoose = function(product_category_id,category_name){
			$scope.category_name_show=category_name;
			$scope.closePopover();
			if($scope.parameters.product_category_id != product_category_id){
				$scope.parameters.product_category_id = product_category_id;
				$scope.refresh_products();
			}
			$scope.productTypeChildrenChose = product_category_id;
		};
		$ionicPopover.fromTemplateUrl('templates/categoryPopover.html', {
			scope: $scope,
		}).then(function(popover) {
			$scope.popover = popover;
		});
		$scope.openPopover = function($event) {
			//document.body.classList.remove('platform-ios');
			//document.body.classList.remove('platform-android');
			//document.body.classList.add('platform-ios');
			$scope.popover.show($event);

		};
		$scope.closePopover = function() {
			$scope.popover.hide();
		};
		//Cleanup the popover when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.popover.remove();
		});
		// Execute action on hide popover
		$scope.$on('popover.hidden', function() {
			// Execute action
		});
		// Execute action on remove popover
		$scope.$on('popover.removed', function() {
			// Execute action
		});
		//页面数据刷新
		function mr_slideBoxUpdate() {
			setTimeout(function () {
				$ionicSlideBoxDelegate.slide(0);
				$ionicSlideBoxDelegate.update();
				$scope.$apply();
			});
		};
})
//首页查看商铺详情
.controller('StoreDetailCtrl', function($scope,$stateParams,HomeStoreService,$ionicScrollDelegate,$timeout,$ionicSlideBoxDelegate,$ionicLoading) {
	$scope.current_tab = 0;
	$scope.is_showed_tab = [false,false,false,false];
	$scope.moreDataCanBeLoaded = [false,false,false,false];
	$scope.getProductsRequestBody_0 =
	{
		product_store_id:$stateParams.product_store_id,
		pageSize:15,
		currentPage:1,
		is_privacy:'0',
		keyword:''
	};
	$scope.productImageStyle = getProductPhotoSize(33.3333,1);
	$scope.getStoreInfo = function(store_id){
		HomeStoreService.getStoreInfo({product_store_id:store_id}).then(function(response){
				if(response.resp.success!=1){
					$ionicLoading.hide();
				}else{
					$scope.product_store = response.resp.data.datas;
					$scope.store_img_style = response.resp.data.mengran_img_style;
					$scope.is_showed_tab[2] = true;
					/*$scope.current_tab = 2;*/
					$ionicLoading.hide();
				}
			},
			function(errorMessage){
				$scope.error=errorMessage;
		});
	};

	$scope.getProductList = function(){
		HomeStoreService.getAllProductList($scope.getProductsRequestBody_0).then(function(response){
				if(response.resp.success!=1){
					$ionicLoading.hide();
				}else{
					$scope.products_0 = response.resp.data.datas;
					$scope.img_style_0 = response.resp.data.mengran_img_style;
					$scope.is_showed_tab[0] = true;
					$scope.current_tab = 0;
					mr_slideBoxUpdate();
					$ionicLoading.hide();
				}
				$timeout(function() {
					if($scope.products_0.length==$scope.getProductsRequestBody_0.pageSize){
						$scope.moreDataCanBeLoaded[0] = true;
						$scope.$apply();
					}
				},2000);
			},
			function(errorMessage){
				$scope.error=errorMessage;
			});
	};

	$scope.getStoreInfo($stateParams.product_store_id);

	$scope.selectTab = function(index){
		if(index==2){
			$ionicScrollDelegate.$getByHandle('storeScroll').scrollTo(0,0,true);
			if($scope.is_showed_tab[index]==false){
				$ionicLoading.show();
				$scope.getStoreInfo($stateParams.product_store_id);
				$scope.current_tab = 2;
			}else{
				$scope.current_tab = index;
			}
		}else if(index==0){
			if($scope.is_showed_tab[index]==false){
				$ionicLoading.show();
				$scope.getProductList();
			}else{
				$scope.current_tab = index;
			}
		}
	};
	//默认选择显示共有产品
	$scope.selectTab(0);

	$scope.searchProductList = function(){
		console.log($scope.getProductsRequestBody_0.keyword);
    $scope.getProductsRequestBody_0.currentPage = 1;
		$scope.moreDataCanBeLoaded[0] = false;
		$ionicLoading.show();
		$scope.getProductList();
	};
	//翻页 预留多栏目翻页
	$scope.loadMore_Store_data = function(current_tab){
		if ($scope.products_0.length < $scope.getProductsRequestBody_0.pageSize) {
			console.log("无下一页");
			if(current_tab==0){
				$scope.moreDataCanBeLoaded[current_tab] = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		} else {
			console.log("有下一页");
			if(current_tab==0){
				$scope.getProductsRequestBody_0.currentPage += 1;//下一页
				var requestBody = $scope.getProductsRequestBody_0;
			}
			HomeStoreService.getAllProductList(requestBody).then(function (response) {
					if (response.resp.success != 1) {
						$ionicLoading.hide();
						$timeout(function () {
							$scope.$broadcast('scroll.infiniteScrollComplete');
						},3000);
					} else {
						if (angular.isDefined(response.resp.data.datas) && response.resp.data.datas.length > 0) {
							console.log("下一页有数据");
							console.log(response.resp.data.datas.length);
							//添加到原有数据集
							if(current_tab==0){
								$scope.products_0 = $scope.products_0.concat(response.resp.data.datas);
								mr_slideBoxUpdate();
								if (response.resp.data.datas.length == $scope.getProductsRequestBody_0.pageSize) {
									console.log("新的一页满页数据");
								} else {
									//当前获取数据不足一页
									console.log("新的一页不满数据");
									$scope.moreDataCanBeLoaded[current_tab] = false;
								}
							}
						} else {
							console.log("下一页无数据");
							$scope.moreDataCanBeLoaded[current_tab] = false;
						}
						console.log("-----翻页后翻页状态--------");
						console.log($scope.moreDataCanBeLoaded[current_tab]);
						$timeout(function () {
							$scope.$broadcast('scroll.infiniteScrollComplete');
						},3000);
					}
				},
				function (errorMessage) {
					$scope.error = errorMessage;
				}
			);
		}
	}

	/**
	 * 更新slideBox
	 */
	function mr_slideBoxUpdate(){
		setTimeout(function() {
			$ionicSlideBoxDelegate.slide(0);
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
		});
	}
})
//进入租赁
.controller('HomeLeaseCtrl',function($scope,$controller,HomeLeaseService,$ionicLoading,BaiduLocationService){
	angular.extend(this, $controller('CommonLoadMoreParentCtrl',{$scope: $scope}));
	$scope.firstLocationSuccess = false;
	$scope.last_areaName = '';
	$scope.$on('$fromChooseAreaResult', function (e, data) {
		$scope.pageDataList[0].respondBody.city_name = '';
		for(var i=0;i<data.info.length;i++){
			if(data.info[i].id!=-1){
				if(i==0){
					$scope.pageDataList[0].respondBody.province_id = data.info[i].id;
					$scope.pageDataList[0].respondBody.city_id = '';
					$scope.pageDataList[0].respondBody.county_id = '';
				}else if(i==1){
					$scope.pageDataList[0].respondBody.city_id = data.info[i].id;
					$scope.pageDataList[0].respondBody.county_id = '';
				}else if(i==2){
					$scope.pageDataList[0].respondBody.county_id = data.info[i].id;
				}
				if(i==data.info.length-1||data.info[i+1].id==-1){
					if($scope.last_areaName != data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name){
						$scope.search();
					}
					$scope.last_areaName = data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name;
					return ;
				}
			}else{
				if(i==0){
					if($scope.last_areaName!=''){
						$scope.pageDataList[0].respondBody.province_id = '';
						$scope.pageDataList[0].respondBody.city_id = '';
						$scope.pageDataList[0].respondBody.county_id = '';
						$scope.search();
					}
					$scope.last_areaName ='';
				}
			}
		}
	});
	$scope.$on('$fromChooseKeywordResult', function (e, data) {
		if($scope.pageDataList[0].respondBody.keyword != data.keyword){
			$scope.pageDataList[0].respondBody.keyword = data.keyword;
			$scope.search();
		}
	});
	//进入页面初始化 页面请求信息以及获得初始数据
	$scope.setResultList([[]]);
	$scope.setServiceFunction([HomeLeaseService.allSearch]);
	$scope.setRespondBody(0,{
		city_name:'',
		keyword:"",
		province_id:'',
		city_id:'',
		county_id:'',
		pageSize:15,
		longitude: null,
		latitude: null
	});
	/*$scope.getRespondResult(0);*/
	// 搜索
	$scope.search = function(){
		$ionicLoading.show();
		BaiduLocationService.getDetailLocation().then(function(response){
			if(response.data.success==1){
				$scope.pageDataList[0].respondBody.city_name = response.data.location.city;
				$scope.pageDataList[0].respondBody.longitude=response.data.lng;
				$scope.pageDataList[0].respondBody.latitude=response.data.lat;
				if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
					$scope.last_areaName = response.data.location.city;
					$scope.firstLocationSuccess = true;
				}
			}else{
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
			}
			$scope.getRespondResult(0);
		},function(errorMessage){
			$scope.getRespondResult(0);
			if(angular.isUndefined($scope.last_areaName)){
				$scope.last_areaName = '不限';
			}
			$scope.error=errorMessage;
		});
		/*$scope.getRespondResult(0);*/
	};
	$scope.lease_refresh = function(showIndex) {
		$ionicLoading.show();
		BaiduLocationService.getDetailLocation().then(function(response){
			if(response.data.success==1){
				$scope.pageDataList[0].respondBody.city_name = response.data.location.city;
				$scope.pageDataList[0].respondBody.longitude=response.data.lng;
				$scope.pageDataList[0].respondBody.latitude=response.data.lat;
				if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
					$scope.last_areaName = response.data.location.city;
					$scope.firstLocationSuccess = true;
				}
			}else{
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
			}
			$scope.refresh(showIndex);
		},function(errorMessage){
			$scope.refresh(showIndex);
			if(angular.isUndefined($scope.last_areaName)){
				$scope.last_areaName = '不限';
			}
			$scope.error=errorMessage;
		});

	};
	$scope.search();
})
//租赁详情
.controller('LeaseDetailCtrl',function($scope,$location,$ionicModal,$controller,$rootScope,$state,$q,HomeLeaseService,$stateParams,$ionicSlideBoxDelegate,$ionicLoading,$ionicPopup){ //租赁详情
		angular.extend(this, $controller('CommonWatchPictureCtrl',{$scope: $scope}));
		$scope.recruitInfo =  function (lease_id) {
			$ionicLoading.show();
			HomeLeaseService.getDetail({leaseid:lease_id}).then(function(response){
					$scope.setWatchPictureInfoList(response.resp.data.lease_images);
					$scope.leaseInfo = response.resp.data.data;
					$scope.lease_images = response.resp.data.lease_images;
					$scope.mengran_img_style = getPhotoDetailSize100(33,0)+response.resp.data.mengran_img_style;
					mr_slideBoxUpdate();
					$ionicLoading.hide();
				},
				function(errorMessage){
					$scope.error=errorMessage;
				}
			);
		};
		$scope.recruitInfo($stateParams.lease_id);
		//定位导航
		$scope.addressMapNavigation =  function(endLng,endLat){
			if(angular.isUndefined(endLng)||angular.isUndefined(endLat)||endLng==''||endLat==''){
				$ionicPopup.alert({
					template: "获取地址地理位置失败"
				});
				return;
			}
			$ionicLoading.show({
				duration:2000
			});
			amapLocation($q).then(function(response){
				$ionicLoading.hide();
				if(response.isSuccess){
					amapNavigation(response.longitude,response.latitude,parseFloat(endLng),parseFloat(endLat));
				}else{
					$ionicPopup.alert({
						template: response.message
					});
				}
			},function(errorMessage){
				$ionicLoading.hide();
				$ionicPopup.alert({
					template: errorMessage
				});
				$scope.error=errorMessage;
			});
		};
		// 刷新
		$scope.refreshRecruit = function(){
			$scope.recruitInfo($stateParams.lease_id);
			$scope.$broadcast('scroll.refreshComplete');
		};

		function mr_slideBoxUpdate(){
			setTimeout(function() {
				$ionicSlideBoxDelegate.slide(0);
				$ionicSlideBoxDelegate.update();
				$scope.$apply();
			});
		}
})
	//--------------------------招聘 start----------------------------//
	//进入招聘
.controller('HomeRecruitCtrl',function($scope,$controller,HomeRecruitService,$q,$ionicLoading,BaiduLocationService){
		$scope.moreDataCanBeLoaded = false;
		angular.extend(this, $controller('CommonLoadMoreParentCtrl',{$scope: $scope}));
		$scope.firstLocationSuccess = false;
		$scope.last_areaName = '';
		$scope.$on('$fromChooseAreaResult', function (e, data) {
			$scope.pageDataList[0].respondBody.city_name = '';
			for(var i=0;i<data.info.length;i++){
				if(data.info[i].id!=-1){
					if(i==0){
						$scope.pageDataList[0].respondBody.province_id = data.info[i].id;
						$scope.pageDataList[0].respondBody.city_id = '';
						$scope.pageDataList[0].respondBody.county_id = '';
					}else if(i==1){
						$scope.pageDataList[0].respondBody.city_id = data.info[i].id;
						$scope.pageDataList[0].respondBody.county_id = '';
					}else if(i==2){
						$scope.pageDataList[0].respondBody.county_id = data.info[i].id;
					}
					if(i==data.info.length-1||data.info[i+1].id==-1){
						if($scope.last_areaName != data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name){
							$scope.search();
						}
						$scope.last_areaName = data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name;
						return ;
					}
				}else{
					if(i==0){
						if($scope.last_areaName!=''){
							$scope.pageDataList[0].respondBody.province_id = '';
							$scope.pageDataList[0].respondBody.city_id = '';
							$scope.pageDataList[0].respondBody.county_id = '';
							$scope.search();
						}
						$scope.last_areaName ='';
					}
				}
			}
		});
		$scope.$on('$fromChooseKeywordResult', function (e, data) {
			if($scope.pageDataList[0].respondBody.keyword != data.keyword){
				$scope.pageDataList[0].respondBody.keyword = data.keyword;
				$scope.search(0);
			}
		});
		//进入页面初始化 页面请求信息以及获得初始数据
		$scope.setResultList([[]]);
		$scope.setServiceFunction([HomeRecruitService.recruitSearch]);
		$scope.setRespondBody(0,{
			city_name:'',
			keyword:"",
			province_id:'',
			city_id:'',
			county_id:'',
			longitude: null,
			latitude: null,
			pageSize:15
		});
		// 搜索
		$scope.search = function(showIndex){
			$ionicLoading.show();
			BaiduLocationService.getDetailLocation().then(function(response){
				if(response.data.success==1){
					$scope.pageDataList[0].respondBody.city_name = response.data.location.city;
					$scope.pageDataList[0].respondBody.longitude=response.data.lng;
					$scope.pageDataList[0].respondBody.latitude=response.data.lat;
					if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
						$scope.last_areaName = response.data.location.city;
						$scope.firstLocationSuccess = true;
					}
				}else{
					if(angular.isUndefined($scope.last_areaName)){
						$scope.last_areaName = '不限';
					}
				}
				$scope.getRespondResult(0);
			},function(errorMessage){
				$scope.getRespondResult(0);
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
				$scope.error=errorMessage;
			});
			/*amapLocation($q).then(function(response){
				if(response.isSuccess){
					*//*$scope.pageDataList[0].respondBody.city_name = response.cityName;*//*
					$scope.pageDataList[0].respondBody.longitude=response.longitude;
					$scope.pageDataList[0].respondBody.latitude=response.latitude;
					if(angular.isUndefined($scope.last_areaName)&&$scope.firstLocationSuccess==false){
						$scope.last_areaName = response.cityName;
						$scope.firstLocationSuccess = true;
					}
				}else{
					if(angular.isUndefined($scope.last_areaName)){
						$scope.last_areaName = '不限';
					}
				}
				$scope.getRespondResult(0);
			},function(errorMessage){
				$scope.getRespondResult(0);
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
				$scope.error=errorMessage;
			});*/
		};
		$scope.search(0);
		$scope.recruit_refresh = function(showIndex) {
			$ionicLoading.show();
			BaiduLocationService.getDetailLocation().then(function(response){
				if(response.data.success==1){
					$scope.pageDataList[0].respondBody.city_name = response.data.location.city;
					$scope.pageDataList[0].respondBody.longitude=response.data.lng;
					$scope.pageDataList[0].respondBody.latitude=response.data.lat;
					if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
						$scope.last_areaName = response.data.location.city;
						$scope.firstLocationSuccess = true;
					}
				}else{
					if(angular.isUndefined($scope.last_areaName)){
						$scope.last_areaName = '不限';
					}
				}
				$scope.refresh(showIndex);
			},function(errorMessage){
				$scope.refresh(showIndex);
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
				$scope.error=errorMessage;
			});
		/*	amapLocation($q).then(function(response){
				if(response.isSuccess){
					*//*$scope.pageDataList[0].respondBody.city_name = response.cityName;*//*
					$scope.pageDataList[0].respondBody.longitude=response.longitude;
					$scope.pageDataList[0].respondBody.latitude=response.latitude;
					if(angular.isUndefined($scope.last_areaName)&&$scope.firstLocationSuccess==false){
						$scope.last_areaName = response.cityName;
						$scope.firstLocationSuccess = true;
					}
				}else{
					if(angular.isUndefined($scope.last_areaName)){
						$scope.last_areaName = '不限';
					}
				}
				$scope.refresh(showIndex);
			},function(errorMessage){
				$scope.refresh(showIndex);
				if(angular.isUndefined($scope.last_areaName)){
					$scope.last_areaName = '不限';
				}
				$scope.error=errorMessage;
			});*/
		/*	$scope.refresh(showIndex);*/
		};
	})
//招聘 查看详情窗口
.controller('HomeRecruitDetailWindowCtrl',function($scope,$location,$ionicModal,$state,$q,HomeRecruitService,$stateParams,$ionicSlideBoxDelegate,$ionicLoading,$ionicPopup){
	//加载并打开 职位详细信息浏览界面
	$scope.openHomeRecruitDetailWindow = function(recruitid,lookBySelf){
		$scope.lookBySelf = lookBySelf;
		//$ionicLoading.show();
		$ionicLoading.show();
		HomeRecruitService.getRecruitDetail({recruitid:recruitid}).then(function (response) {
				$scope._recruit = response.resp.data.data;
				$scope.setRecruitDemand($scope._recruit);
				$ionicModal.fromTemplateUrl('home_recruit_detailWindow.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (filterModal) {
					$scope.recruitDetailWindow = filterModal;
					$scope.recruitDetailWindow.show();
					$ionicLoading.hide();
				});
			},
			function (errorMessage) {
				$scope.error = errorMessage;
				$ionicLoading.hide();
			}
		);
	};
	$scope.closeHomeRecruitDetailWindow = function(){
		$scope.recruitDetailWindow.remove();
	};
	//定位导航
	$scope.addressMapNavigation =  function(endLng,endLat){
		if(angular.isUndefined(endLng)||angular.isUndefined(endLat)||endLng==''||endLat==''){
			$ionicPopup.alert({
				template: "获取地址地理位置失败"
			});
			return;
		}
		$ionicLoading.show({
			duration:2000
		});
		amapLocation($q).then(function(response){
			$ionicLoading.hide();
			if(response.isSuccess){
				amapNavigation(response.longitude,response.latitude,parseFloat(endLng),parseFloat(endLat));
			}else{
				$ionicPopup.alert({
					template: response.message
				});
			}
		},function(errorMessage){
			$ionicLoading.hide();
			$ionicPopup.alert({
				template: errorMessage
			});
			$scope.error=errorMessage;
		});
	};
	/*   职位要求 显示 需要 根据设计 拼接
	 范文是这样滴： “18-30岁 5年以上的工作经验 计算机先关专业 本科以上学历”
	 年龄范围  startage、endage；-----这个我懂。。。
	 最低简历 educationid: "2" ； ---- 没错，给我的是 学历id。。。第一反应就是 幼儿园是0吗？？？
	 专业  major ；------ 这个单词我一直 翻译为 主要的。。。 理智告诉我 是 专业。。。
	 工作年限  workyears  ---------   单词 看着就怪怪的，工作 + 年 + s = 工作好多年 然后。。。就那样
	 */
	$scope.setRecruitDemand = function(recruit){
		$scope.recruitDemand ='';
		if ($scope._recruit.endage != '') {
			if ($scope._recruit.endage != '') {
				$scope.recruitDemand += $scope._recruit.startage + '-' + $scope._recruit.endage + '岁  \n';
			} else {
				$scope.recruitDemand += $scope._recruit.endage + '岁以下  \n';
			}
		}
		if ($scope._recruit.workyears == 0) {
			$scope.recruitDemand += ' 无工作经验要求  \n ';
		} else {
			$scope.recruitDemand += $scope._recruit.workyears + '年以上的工作经验  \n ';
		}
		if ($scope._recruit.major == '') {
		} else {
			$scope.recruitDemand += $scope._recruit.major+'\n';
		}
		if ($scope._recruit.educationid == '') {
			$scope.recruitDemand += '无学历要求\n';
		} else {
			$scope.recruitDemand += $scope._recruit.educationName + '以上学历\n';
		}
	}
})

  //--------------------------加工厂start----------------------------//
  //进入加工厂首页
  .controller('HomeProcessCtrl',function($scope,$location,$q,$rootScope,$state,HomeProcessService,BaiduLocationService,$ionicSlideBoxDelegate,$ionicLoading){ //加工主页
    $scope.request_params = {
      city_name:'',
      longitude:null,
      latitude:null,
      currentPage:1,
      pageSize:15,
      province_id:'',
      city_id:'',
      county_id:''
    };
    $scope.last_areaName = '';
    $scope.all_type = function(){
      HomeProcessService.getMenuList({}).then(function(response){
          console.log(response);
          $scope.icons = response.resp.data.datas;
          $scope.img_style_icons = response.resp.data.mengran_img_style;
          mr_slideBoxUpdate();
        },
        function(errorMessage){
          $scope.error=errorMessage;
        });
    };
    $scope.getHot_processList = function(requestBody){
      HomeProcessService.getHot_processList(requestBody).then(function(response){
          $scope.processList = response.resp.data.datas;
          $scope.img_style_process = response.resp.data.mengran_img_style;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          mr_slideBoxUpdate();
        },
        function(errorMessage){
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.error=errorMessage;
        }
      );
    };
    // 刷新
    $scope.doRefresh = function(){
      if(angular.isUndefined($scope.icons)||$scope.icons.length<1){
        $scope.all_type();
      }
      BaiduLocationService.getDetailLocation().then(function(response){
        if(response.data.success==1){
          $scope.request_params.city_name = response.data.location.city;
          $scope.request_params.longitude = response.data.lng;
          $scope.request_params.latitude = response.data.lat;
          if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
            $scope.last_areaName = response.data.location.city;
            $scope.firstLocationSuccess = true;
          }
        }else{
          if(angular.isUndefined($scope.last_areaName)){
            $scope.last_areaName = '不限';
          }
        }
        $scope.getHot_processList($scope.request_params);
      },function(errorMessage){
        $scope.getHot_processList($scope.request_params);
        if(angular.isUndefined($scope.last_areaName)){
          $scope.last_areaName = '不限';
        }
        $scope.error=errorMessage;
      });

      /*amapLocation($q).then(function(response){
        if(response.isSuccess){
          *//*$scope.request_params.city_name = response.cityName;*//*
          $scope.request_params.longitude=response.longitude;
          $scope.request_params.latitude=response.latitude;
          if(angular.isUndefined($scope.last_areaName)&&$scope.firstLocationSuccess==false){
            $scope.last_areaName = response.cityName;
            $scope.firstLocationSuccess = true;
          }
        }else{
          if(angular.isUndefined($scope.last_areaName)){
            $scope.last_areaName = '不限';
          }
        }
        $scope.getHot_processList($scope.request_params);
      },function(errorMessage){
        $scope.getHot_processList($scope.request_params);
        $scope.error=errorMessage;
      });*/
    };


    $scope.firstLocationSuccess = false;
    $scope.$on('$fromChooseAreaResult', function (e, data) {
      $ionicLoading.show();
      $scope.request_params.city_name = '';
      for(var i=0;i<data.info.length;i++){
        if(data.info[i].id!=-1){
          if(i==0){
            $scope.request_params.province_id = data.info[i].id;
            $scope.request_params.city_id = '';
            $scope.request_params.county_id = '';
          }else if(i==1){
            $scope.request_params.city_id = data.info[i].id;
            $scope.request_params.county_id = '';
          }else if(i==2){
            $scope.request_params.county_id = data.info[i].id;
          }
          if(i==data.info.length-1||data.info[i+1].id==-1){
            if($scope.last_areaName != data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name){
              $scope.doRefresh();
            }
            $scope.last_areaName = data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name;
            return ;
          }
        }else{
          if(i==0){
            if($scope.last_areaName!=''){
              $scope.request_params.province_id = '';
              $scope.request_params.city_id = '';
              $scope.request_params.county_id = '';
              $scope.doRefresh();
            }
            $scope.last_areaName ='';
          }
        }
      }
    });
    $ionicLoading.show();
    //$scope.all_type();
    $scope.doRefresh();
    function mr_slideBoxUpdate(){
      setTimeout(function() {
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
      });
    }
  })
  //加工厂详情
  .controller('ProcessDetailWindowCtrl',function($scope,$location,$rootScope,$ionicModal,$state,$q,$controller,HomeProcessService,$stateParams,$ionicSlideBoxDelegate,$ionicLoading,$ionicPopup){ //加工厂详情
    $scope.openProcessDetailWindow =  function (process_id) {
      angular.extend(this, $controller('CommonWatchPictureCtrl', {$scope: $scope}));
      $ionicLoading.show();
      $scope.productImageStyle = getProductPhotoSize(33.3333,2);
      HomeProcessService.getDetail({factory_process_id:process_id}).then(function(response){
          $scope.product_store = response.resp.data.factory_process;
          $scope.factory_category = response.resp.data.factory_category;
          $scope.process_images =response.resp.data.factory_process_images;
          $scope.process_img_style =  response.resp.data.mengran_img_style;
          $scope.setWatchPictureInfoList($scope.process_images);
          $ionicModal.fromTemplateUrl('templates/home/homewindows/process_processDetailWindow.html', {
            scope: $scope,
            animation: 'reverse'
          }).then(function (windowModal) {
            $scope.processDetailWindow = windowModal;
            $scope.processDetailWindow.show();
            $ionicLoading.hide();
          });

        },
        function(errorMessage){
          $ionicLoading.hide();
          $scope.error=errorMessage;
        }
      );
    };
    $scope.closeProcessDetailWindow =  function (process_id) {
      $scope.processDetailWindow.remove();
    };
    //定位导航
    $scope.addressMapNavigation =  function(endLng,endLat){
      if(angular.isUndefined(endLng)||angular.isUndefined(endLat)||endLng==''||endLat==''){
        $ionicPopup.alert({
          template: "获取地址地理位置失败"
        });
        return;
      }
      $ionicLoading.show({
        duration:2000
      });
      amapLocation($q).then(function(response){
        $ionicLoading.hide();
        if(response.isSuccess){
          amapNavigation(response.longitude,response.latitude,parseFloat(endLng),parseFloat(endLat));
        }else{
          $ionicPopup.alert({
            template: response.message
          });
        }
      },function(errorMessage){
        $ionicLoading.hide();
        $ionicPopup.alert({
          template: errorMessage
        });
        $scope.error=errorMessage;
      });
    };

    function mr_slideBoxUpdate(){
      setTimeout(function() {
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
      });
    }
  })
  //加工厂搜索
  .controller('ProcessSelectionCtrl',function($scope,$location,$q,$controller,$rootScope,$stateParams,CommonSearchHistoryService,$state,HomeProcessService,$ionicSlideBoxDelegate,$ionicLoading,BaiduLocationService){ //加工厂搜索
    $scope.process_params = {
      keyword:angular.isDefined($stateParams.keyword)?$stateParams.keyword:'',
      factory_category_id:angular.isDefined($stateParams.factory_category_id)?$stateParams.factory_category_id:''
    };
    $scope.firstLocationSuccess = false;
    $scope.last_areaName = '';
    $scope.$on('$fromChooseAreaResult', function (e, data) {

      $scope.pageDataList[0].respondBody.city_name = '';
      for(var i=0;i<data.info.length;i++){
        if(data.info[i].id!=-1){
          if(i==0){
            $scope.pageDataList[0].respondBody.province_id = data.info[i].id;
            $scope.pageDataList[0].respondBody.city_id = '';
            $scope.pageDataList[0].respondBody.county_id = '';
          }else if(i==1){
            $scope.pageDataList[0].respondBody.city_id = data.info[i].id;
            $scope.pageDataList[0].respondBody.county_id = '';
          }else if(i==2){
            $scope.pageDataList[0].respondBody.county_id = data.info[i].id;
          }
          if(i==data.info.length-1||data.info[i+1].id==-1){
            if($scope.last_areaName != data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name){
              $scope.searchProcess();
            }
            $scope.last_areaName = data.info[i].name.length>4?data.info[i].name.substr(0, 3)+'...':data.info[i].name;
            return ;
          }
        }else{
          if(i==0){
            if($scope.last_areaName!=''){
              $scope.pageDataList[0].respondBody.province_id = '';
              $scope.pageDataList[0].respondBody.city_id = '';
              $scope.pageDataList[0].respondBody.county_id = '';
              $scope.searchProcess();
            }
            $scope.last_areaName ='';
          }
        }
      }
    });
    $scope.moreDataCanBeLoaded = false;
    angular.extend(this, $controller('CommonLoadMoreParentCtrl',{$scope: $scope}));
    //进入页面初始化 页面请求信息以及获得初始数据
    $scope.setResultList([[]]);
    $scope.setServiceFunction([HomeProcessService.searchProcessList]);
    $scope.setRespondBody(0,{
      city_name:'',
      longitude: null,
      latitude: null,
      factory_category_id:$scope.process_params.factory_category_id,
      keyword:$scope.process_params.keyword,
      pageSize:15,
      province_id:'',
      city_id:'',
      county_id:''
    });
    $scope.searchProcess =  function () {
      $ionicLoading.show();
      $scope.pageDataList[0].respondBody.keyword = $scope.process_params.keyword;
      if($scope.process_params.keyword!=''){

        setTimeout(function () {
          CommonSearchHistoryService.updateHistoryKeyword('process',$scope.process_params.keyword);
        },100);
      }

      BaiduLocationService.getDetailLocation().then(function(response){
        if(response.data.success==1){
          $scope.pageDataList[0].respondBody.city_name = response.data.location.city;
          $scope.pageDataList[0].respondBody.longitude=response.data.lng;
          $scope.pageDataList[0].respondBody.latitude=response.data.lat;
          if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
            $scope.last_areaName = response.data.location.city;
            $scope.firstLocationSuccess = true;
          }
        }else{
          if(angular.isUndefined($scope.last_areaName)){
            $scope.last_areaName = '不限';
          }
        }
        $scope.getRespondResult(0);
      },function(errorMessage){
        $scope.getRespondResult(0);
        if(angular.isUndefined($scope.last_areaName)){
          $scope.last_areaName = '不限';
        }
        $scope.error=errorMessage;
      });



    /*  amapLocation($q).then(function(response){
        if(response.isSuccess){
          *//*$scope.pageDataList[0].respondBody.city_name = response.cityName;*//*
          $scope.pageDataList[0].respondBody.longitude=response.longitude;
          $scope.pageDataList[0].respondBody.latitude=response.latitude;
          if(angular.isUndefined($scope.last_areaName)&&$scope.firstLocationSuccess==false){
            $scope.last_areaName = response.cityName;
            $scope.firstLocationSuccess = true;
          }
        }else{
          if(angular.isUndefined($scope.last_areaName)){
            $scope.last_areaName = '不限';
          }
        }
        $scope.getRespondResult(0);
      },function(errorMessage){
        if(angular.isUndefined($scope.last_areaName)){
          $scope.last_areaName = '不限';
        }
        $scope.getRespondResult(0);
        $scope.error=errorMessage;
      });*/
    };
    $scope.searchProcess();
    // 刷新
    $scope.process_refresh = function(index){
      $scope.pageDataList[0].respondBody.keyword = $scope.process_params.keyword;
      if($scope.pageDataList[0].respondBody.keyword!=''&&$scope.pageDataList[0].respondBody.keyword!=$scope.process_params.keyword){
        setTimeout(function () {
          CommonSearchHistoryService.updateHistoryKeyword('process',$scope.query.keyword);
        },100);
      }
      BaiduLocationService.getDetailLocation().then(function(response){
        if(response.data.success==1){
          $scope.pageDataList[0].respondBody.city_name = response.data.location.city;
          $scope.pageDataList[0].respondBody.longitude=response.data.lng;
          $scope.pageDataList[0].respondBody.latitude=response.data.lat;
          if($scope.last_areaName==''&&$scope.firstLocationSuccess==false){
            $scope.last_areaName = response.data.location.city;
            $scope.firstLocationSuccess = true;
          }
        }else{
          if(angular.isUndefined($scope.last_areaName)){
            $scope.last_areaName = '不限';
          }
        }
        $scope.refresh(index);
      },function(errorMessage){
        $scope.refresh(index);
        if(angular.isUndefined($scope.last_areaName)){
          $scope.last_areaName = '不限';
        }
        $scope.error=errorMessage;
      });




      /*amapLocation($q).then(function(response){
        $scope.refresh(index);
      },function(errorMessage){
        $scope.locationCity = "定位失败";
        $scope.refresh(index);
        $scope.error=errorMessage;
      });*/
    };
  })

  .controller('CommonIframeCtrl',  function($scope,$sce,$ionicHistory, $stateParams) {
	$scope.goBack = function(){
		$ionicHistory.goBack();
	};
	if($stateParams.url_type==1){
		$scope.myURL = $sce.trustAsResourceUrl('http://a.app.qq.com/o/simple.jsp?pkgname=com.szmengran.mrzdzyapp');
	}
		//-----------------代码插入
		//初始化 显示参数
		$scope.startPlace_internal = "上海";
		$scope.endPlace_internal = "北京";
		$scope.startPlace_abroad = "广州";
		$scope.endPlace_abroad = "纽约";
		$scope.startFlip_abroad = false;
		$scope.startFlip_internal = false;
		$scope.exchangePlace = function (exhangeType) {
			if (exhangeType==0){
				$scope.startFlip_internal = ! $scope.startFlip_internal;
			}else{
				$scope.startFlip_abroad = ! $scope.startFlip_abroad;
			}
		};
})
.controller('ProductDetailCtrl',function($scope, $stateParams,$controller,$rootScope,$ionicSlideBoxDelegate,HomeProductService,$ionicLoading){
	angular.extend(this, $controller('CommonWatchPictureCtrl', {$scope: $scope}));
	$scope.getProductDetail = function(product_id){
		$ionicLoading.show();
		HomeProductService.productDetail({product_id:product_id}).then(function(response){
				if(response.resp.success!=1){
					$ionicLoading.hide();
				}else{
					$scope.product = response.resp.data.product;
					$scope.priceList = response.resp.data.priceList;
					$scope.product_grade = response.resp.data.product_grade;
					$scope.product_images = response.resp.data.product_images;
					$scope.product_store = response.resp.data.product_store;
					$scope.productDetailImageStyle = getPhotoDetailSize(33,0);
					$scope.img_style = getPhotoDetailSize100(33,0)+response.resp.data.mengran_img_style;
					$scope.store_img_style = IMAGE_VIEW_SIZE.STORE_HEARDER;
					$scope.setWatchPictureInfoList($scope.product_images);
					mr_slideBoxUpdate();
					$ionicLoading.hide();
				}
			},
			function(errorMessage){
				$ionicLoading.hide();
				$scope.error=errorMessage;
			}
		);
	};
	$scope.getProductDetail($stateParams.product_id);
	function mr_slideBoxUpdate(){
		setTimeout(function() {
			$ionicSlideBoxDelegate.slide(0);
			$ionicSlideBoxDelegate.update();
			$scope.$apply();
		});
	}
})
  //主页色卡模块
  .controller('ColorCardCtrl',function($state,$ionicHistory,$timeout,$controller,$ionicModal,$scope,$rootScope,$ionicLoading,ColorCardService,$ionicSlideBoxDelegate){
    $scope.totalDisplayed = 28;
    $scope.moreDataCanBeLoaded=true;
    /**
     * 色卡查询
     */
    $scope.color_card_query = function(){
      $ionicLoading.show();
      $scope.color_cardList = ColorCardService.getColor_cardData();
      if($scope.color_cardList!=null){
        $ionicLoading.hide();
      }else{
        ColorCardService.getColor_cardList({}).then(function(response){
          if(response.resp.success==1){
            ColorCardService.updateColor_cardData(response.resp.data.datas);
            $scope.color_cardList = response.resp.data.datas;
            $ionicLoading.hide();
          }else{
            $ionicLoading.hide();
          }
        },function(errorMessage){
          $scope.error=errorMessage;
          $ionicLoading.hide();
        });
      }
    };
    $scope.color_card_query();
    $scope.colorCardRefresh = function(){
      $scope.totalDisplayed = 28;
      if($scope.color_cardList!=null){
        $scope.color_cardList = ColorCardService.getColor_cardData();
      }
      if($scope.color_cardList!=null){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }else{
        ColorCardService.getColor_cardList({}).then(function(response){
          if(response.resp.success==1){
            ColorCardService.updateColor_cardData(response.resp.data.datas);
            $scope.color_cardList = response.resp.data.datas;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }else{
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        },function(errorMessage){
          $scope.error=errorMessage;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }
    };

    $scope.resetDisplayed = function (){
      $scope.totalDisplayed = 28;
    };

    $scope.loadMore = function () {
      $scope.totalDisplayed += 28;
      mr_slideBoxUpdate();
      setTimeout(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },0);
      if($scope.color_cardList && $scope.totalDisplayed>=$scope.color_cardList.length){
        $scope.moreDataCanBeLoaded = false;
      }
    };
    $ionicModal.fromTemplateUrl('templates/home/homewindows/colorCard_colorCardDetailWindow.html', {
      scope: $scope,
       animation: 'reverse'
    }).then(function (filterModal) {
      $scope.colorCardDetailWindow = filterModal;
    });
    $scope.openColorCardDetailWindow = function(colorCard_info){
      $scope.card_code = colorCard_info.card_code;
      $scope.card_value = colorCard_info.card_value;
      $scope.colorCardDetailWindow.show();
    };

    $scope.closeColorCardDetailWindow =function(){
      $scope.colorCardDetailWindow.hide();
    };

    function mr_slideBoxUpdate(){
      setTimeout(function() {
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.$apply();
      });
    }
  })
  .directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = 'tabs-item-hide';
                });
            });
            scope.$on('$ionicView.beforeLeave', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = 'tabs-item-hide';
                });
                scope.$watch('$destroy',function(){
                    $rootScope.hideTabs = false;
                })

            });
        }
    };
})
.directive('pushSearch', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;
      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('search-bar');
        }
        st = e.detail.scrollTop;
        if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, 0px, 0)';
        } else {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
      });
    }
  }
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
;

