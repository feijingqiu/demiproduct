angular.module('starter.CommonControllers', ['starter.CommonServices'])
//图片查看大图
.controller('CommonWatchPictureCtrl', function ($scope,$ionicModal,$controller,$ionicActionSheet, $stateParams,$timeout,$ionicLoading, $ionicSlideBoxDelegate) {
       $scope.mr_width = getRequestHead_json().mr_device_screenw;
       $scope.mr_height = getRequestHead_json().mr_device_screenh;
       $scope.allWindow_style={
           top:'100 px',
           width:$scope.mr_width +'px',
           height: ($scope.mr_height-60) + 'px'
       };
       $scope.screenImageStyle = "width:"+$scope.mr_width+"px;height:"+$scope.mr_height+"px;";
       $scope.pictureImageStyle = WATCH_IMAGE_VIEW;
       $scope.img_style = {
           width:$scope.mr_width
       };
       $scope.clickShowHeader = false;
       $scope.pageNum = {
           currentIndexPicture:0
       };
       $scope.showHeader = function(){
           $scope.clickShowHeader = true;
       };
       $scope.storeImageFromProduct = function(pictureuri) {
           $ionicActionSheet.show({
               titleText: '',
               buttons: [
                   { text: '保存图片' },
               ],
               cancelText: '取消',
               cancel: function() {
                   console.log('CANCELLED');
               },
               buttonClicked: function(index) {
                   if(index==0){ //图片保存
                       $scope.storeImageGallery(pictureuri);
                   }else if(index==1){
                   }
                   return true;
               }
           });
       };
       $scope.openWatchPictureWindow = function (index){
           $scope.pageNum.currentIndexPicture = index;
           $ionicLoading.show();
           $timeout(function() {
               $ionicLoading.hide();
           },500);
           $ionicModal.fromTemplateUrl('common_watchPictureWindow', {
               scope: $scope,
           }).then(function (filterModal) {
               $scope.watchPictureWindow = filterModal;
               if (index!=0){
                   setTimeout(function() {
                        $ionicSlideBoxDelegate.slide(index);
                       $scope.$apply();
                   },100);
               };
               $scope.watchPictureWindow.show();
           });
       };
       $scope.setWatchPictureInfoList = function (infoList) {
           $scope.watchPictureInfoList = infoList;
       }

       //隐藏关闭浏览页面
       $scope.endLoolPicture = function () {
           $scope.watchPictureWindow.remove();
           //mengran_hide();
       };
   })






//多栏列表控制父ctrl，分页、刷新
.controller('CommonLoadMoreParentCtrl', function ($scope,$ionicPopup,$ionicSlideBoxDelegate,$timeout,$ionicLoading,$ionicScrollDelegate) {
    //多列表数据集合，下标与showIndex 相对应
    $scope.resultList = [];
    $scope.showIndex = 0;
    //多栏数据的具体请求信息、是否能翻页的标识 以及请求的方法
    //respondBody 的对象必须有 currentPage 当前页 和 pageSize 每页大小 两个基本属性
    $scope.pageDataList= [

    ];
    $scope.moreDataCanBeLoaded = false;
    //根据条件改变对应的当前页数，
    $scope.setCurrentPage = function(index,currentPageNum){
        console.log($scope.pageDataList[index].respondBody);
        $scope.pageDataList[index].respondBody.currentPage = currentPageNum;
    };
    //根据条件改变是否能够翻页情况
    $scope.setLoadMore = function(index,isTrue){
        $scope.pageDataList[index].canLoadMore = isTrue;
        $scope.moreDataCanBeLoaded = isTrue  ;
    };
    //查看当前
    $scope.getLoadMore = function(index){
        return $scope.pageDataList[index].canLoadMore;
    };
    //初始化 对应 的 请求函数
    $scope.setServiceFunction = function(serviceFunctionList){
        for(var i=0;i<serviceFunctionList.length;i++){
            $scope.pageDataList[i].serviceFunction = serviceFunctionList[i];
            /*  console.log($scope.pageDataList);*/
        }
    };
    //获取  对应 的 请求函数
    $scope.getServiceFunction = function(index){
        return $scope.pageDataList[index].serviceFunction;
    };

    //初始化 请求参数对象， 每次 条件 改变时应对应初始化
    $scope.setRespondBody = function(index,respondBody){
        $scope.pageDataList[index].respondBody = respondBody;
        console.log($scope.pageDataList[index]);
    };

    $scope.getRespondBody = function(index){
        return $scope.pageDataList[index].respondBody;
    };
    $scope.getRespondBodyList = function(index){
        return $scope.pageDataList[index];
    };

    //  当前结果集合 与 翻页得到的结果的集合的  集合 '并'
    $scope.respondResultJoin = function(index,data){
        $scope.resultList[index] = $scope.resultList[index].concat(data);
        mr_slideBoxUpdate();
    };

    $scope.getRespondResult =  function (index) {
        $ionicLoading.show();
        $scope.showIndex = index;
        $scope.setCurrentPage(index,1);
        console.log($scope.getRespondBody(index));
        var respondBody = angular.extend({
            currentPage:1
        },$scope.getRespondBody(index));
        $ionicScrollDelegate.scrollTop();
        $scope.getServiceFunction(index)(respondBody).then(function(response){
                if(response.resp.success ==0){
                    $ionicLoading.hide();
                }else{
                    $scope.resultList[index] = response.resp.data.datas;
                    $scope.mengran_img_style=response.resp.data.mengran_img_style;
                    mr_slideBoxUpdate();
                    if($scope.getRespondBody(index).pageSize > $scope.resultList[index].length){
                        $scope.setLoadMore(index,false);
                        /*$scope.moreDataCanBeLoaded = false;*/
                    }else{
                        setTimeout(function() {
                            $scope.setLoadMore(index,true);
                            $scope.$apply();
                        },2000);
                    }
                    $ionicLoading.hide();
                }

            },
            function(errorMessage){
                $scope.error=errorMessage;
            }
        );
    };

    //初始化 各栏目 列表 数据
    //参数为二位数组，
    $scope.setResultList = function(resultList){
        $scope.resultList = resultList;
        for(var i=0;i<resultList.length;i++){
            $scope.pageDataList[i] = {
                serviceFunction :{},
                canLoadMore:true,
                respondBody:{}
            };
        }
    };
    // 刷新
    $scope.refresh = function(index){
        $ionicLoading.hide();
        $scope.showIndex = index;
        $scope.setCurrentPage(index,1);
        var respondBody = angular.extend({
            currentPage:1
        },$scope.getRespondBody(index));
        /*$ionicScrollDelegate.scrollTop();*/
        $scope.getServiceFunction(index)(respondBody).then(function(response){
                $ionicLoading.hide();
                if(response.resp.success ==0){
                    $scope.$broadcast('scroll.refreshComplete');
                }else{
                    $scope.resultList[index] = response.resp.data.datas;
                    $scope.mengran_img_style=response.resp.data.mengran_img_style;
                    mr_slideBoxUpdate();
                    if($scope.getRespondBody(index).pageSize > $scope.resultList[index].length){
                        $scope.setLoadMore(index,false);
                    }else{
                        setTimeout(function() {
                            $scope.setLoadMore(index,true);
                            $scope.$apply();
                        },500);
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }

            },
            function(errorMessage){
                $scope.error=errorMessage;
                $scope.$broadcast('scroll.refreshComplete');
            }
        );

    };
    //点击切换栏目
    $scope.showListBy = function(index){
        $scope.setLoadMore(index,false);
        $ionicLoading.show();
        $timeout(function () {
            $ionicLoading.hide();
        },1000);
        if($scope.showIndex != index){
            if($scope.resultList[index].length==0){
                $ionicScrollDelegate.scrollTop();
                $scope.getRespondResult(index);
            }else{
                if($scope.resultList[$scope.showIndex].length > $scope.resultList[index].length){
                    $ionicScrollDelegate.scrollTop();
                }
                $scope.showIndex = index;
                mr_slideBoxUpdate();
                $ionicLoading.hide();
                $timeout(function () {
                    $scope.setLoadMore(index,true);
                },1000)
            }
        }

    };
    //页翻
    $scope.commonParentLoadMore = function (index) {
        var pageSize = $scope.pageDataList[index].respondBody.pageSize;
        if ($scope.resultList[index].length ==0 || $scope.resultList[index].length % pageSize!=0 ) {
            console.log("无下一页");
            $scope.setLoadMore(index,false);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        } else {
            var getPageNum = $scope.resultList[index].length / pageSize+1;
            console.log("有下一页");
            $scope.setCurrentPage(index,getPageNum);//下一页
            console.log($scope.getRespondBody(index));
            $scope.getServiceFunction(index)($scope.getRespondBody(index)).then(function (response) {
                    if (response.resp.success != 1) {
                        $scope.setLoadMore(index,false);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        /*$ionicPopup.alert({
                         template: response.resp.error
                         });*/
                    } else {
                        if (angular.isDefined(response.resp.data.datas) && response.resp.data.datas.length > 0) {
                            console.log("下一页有数据,当前查到数据");
                           /* console.log(response.resp.data.datas);*/
                            $scope.respondResultJoin(index,response.resp.data.datas);
                            if (response.resp.data.datas.length == pageSize) {
                                console.log("新的一页满页数据");
                                $scope.setLoadMore(index,true);
                            } else {
                                //当前获取数据不足一页
                                console.log("新的一页不满数据");
                                $scope.setLoadMore(index,false);
                            }
                        } else {
                            console.log("下一页无数据");
                            $scope.setLoadMore(index,false);
                        }
                        console.log("-----翻页后翻页状态--------");
                        console.log($scope.moreDataCanBeLoaded);
                        setTimeout(function() {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$apply();
                        },1000);

                    }
                },
                function (errorMessage) {
                    $scope.error = errorMessage;
                }
            );
        }
    };
    $scope.setDeleteServiceFunction = function(deleteServiceFunction){
        $scope.deleteServiceFunction = deleteServiceFunction;
    }
    $scope.delete = function(deleteBody,remindText){
        // 一个确认对话框
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: remindText,
            cancelText: '取消',
            okText: '确定' // String (默认: 'OK')。OK按钮的文字。
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.deleteServiceFunction(deleteBody).then(function(response){
                        console.log(response);
                        $scope.refresh($scope.showIndex);
                    },
                    function(errorMessage){
                        $scope.error=errorMessage;
                    }
                );
            } else {
                console.log('console');
            }
        });
    };

    function mr_slideBoxUpdate(){
        setTimeout(function() {
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.update();
            $scope.$apply();
        });
    };
})

//地区数据选择
.controller('CommonAreaChooseWindowCtrl', function ($scope,$ionicModal, CommonAreaService, $stateParams,CommonAddressDataService, $ionicLoading, $ionicPopup) {
        $scope.openChooseAreaWindow = function () {
            $ionicLoading.show();
            if (angular.isUndefined($scope.allAreaList)) {
                $scope.areaInfo = {info: []};
                $scope.defaultLine = {id:-1,name:'不限'};
                $scope.chooseAreaWindowDate = {
                    firstList_1:[],
                    first_1_button:'',
                    firstList_2:[],
                    first_2_button:'',
                    firstList_3:[],
                    first_3_button:''
                };
                $scope.allAreaList = CommonAddressDataService.getAddressData();
                $scope.chooseAreaWindowDate.firstList_1 = CommonAddressDataService.getAddressData();
                if($scope.allAreaList==null){
                    CommonAreaService.getAll({}).then(function (response) {
                            console.log(response);
                            CommonAddressDataService.updateAddressData(response.resp.data.datas);
                            $scope.chooseAreaWindowDate.firstList_1 = response.resp.data.datas;
                            //加载地区选择模板窗口
                            $ionicModal.fromTemplateUrl('templates/common/area-chooseWindow.html', {
                                scope: $scope,
                                animation: 'slide-in-up'
                            }).then(function (filterModal) {
                                $scope.chooseAreaWindow = filterModal;
                                $scope.chooseAreaWindow.show();
                            });
                            $ionicLoading.hide();
                        },
                        function (errorMessage) {
                            $scope.error = errorMessage;
                            $ionicLoading.hide();
                        }
                    );
                }else{
                    //加载地区选择模板窗口
                    $ionicModal.fromTemplateUrl('templates/common/area-chooseWindow.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (filterModal) {
                        $scope.chooseAreaWindow = filterModal;
                        $scope.chooseAreaWindow.show();
                        $ionicLoading.hide();
                    });
                }
            } else {
                $scope.chooseAreaWindow.show();
                $ionicLoading.hide();
            }
        };
        //选择栏目一的选项后弹出对应的下级
        $scope.chooseFirst_first = function (result) {
            $scope.chooseAreaWindowDate.first_1_button = result.id;
            if ($scope.areaInfo.info.length>0) {
                for(var i=$scope.areaInfo.info.length;i>0;i--){
                    $scope.areaInfo.info.pop();
                }
            }
            $scope.areaInfo.info.push({id:result.id,name:result.name});
            if (result.id==-1|| result.children.length < 1) {
                $scope.$emit('$fromChooseAreaResult', $scope.areaInfo);
                $(".first-third").css("left", "100%");       //隐藏第三行
                $(".first-second").css("left", "100%");//显示打开第二层选项
                $scope.chooseAreaWindow.hide();
            } else {
                $scope.chooseAreaWindowDate.firstList_2 = result.children;
                $(".first-third").css("left", "100%");       //隐藏第三行
                $(".first-second").css("left", "33.48%");//显示打开第二层选项
            }
        };
        //选择栏目二的选项结果处理
        $scope.chooseFirst_second = function (result) {
            $scope.chooseAreaWindowDate.first_2_button = result.id;
            if ($scope.areaInfo.info.length>1) {
                for(var i=$scope.areaInfo.info.length;i>1;i--){
                    $scope.areaInfo.info.pop();
                }
            }
            $scope.areaInfo.info.push({id:result.id,name:result.name});
            if (result.id==-1|| result.children.length < 1) {
                $scope.$emit('$fromChooseAreaResult', $scope.areaInfo);
                $(".first-third").css("left", "100%");
                $scope.chooseAreaWindow.hide();
            } else {
                $scope.chooseAreaWindowDate.firstList_3 = result.children;//显示打开第三层选项
                $(".first-third").css("left", "66.52%");
            }
        };
        //选择栏目三的选项结果处理
        $scope.chooseFirst_third = function (result) {
            $scope.chooseAreaWindowDate.first_3_button = result.id;
            if ($scope.areaInfo.info.length>2) {
                for(var i=$scope.areaInfo.info.length;i>2;i--){
                    $scope.areaInfo.info.pop();
                }
            }
            $scope.areaInfo.info.push({id:result.id,name:result.name});
            $scope.$emit('$fromChooseAreaResult', $scope.areaInfo);
            $scope.chooseAreaWindow.hide();
        };
        $scope.closeChooseWindow = function () {
            $scope.chooseAreaWindow.hide();
        };
    })
    //城市地区选择 定位
.controller('CommonCitySelectWindowCtrl', function ($scope, $ionicModal,$timeout,$q,$location,BaiduLocationService,CommonAddressDataService,$anchorScroll,$ionicSlideBoxDelegate, $ionicLoading, $ionicPopup){
        //继承 后 使用 $scope.openCitySelectWindow() 方法打开 地址选择窗口，
        //重写  $scope.selectLocation 方法 接收 选择的地址数据
        // $scope.setlocationCity 初始化当前城市、默认获取 本次存的 历史 城市地址
        //子 controler 具体 实现该方法获得数据
        $scope.selectLocation = function(item){
            $scope.$emit('$fromCitySelectWindow',item);
            $scope.choseCity = item.name;  //  重写 时必须同时赋予已选城市
            $scope.closeCitySelectWindow(); //  必要时选择后关闭
        };
        $scope.items = {
            hot_city:[],
            citys:[]
        };
        $scope.openCitySelectWindow = function(choseCity){
            $scope.choseCity = choseCity;
            $ionicLoading.show();
            if($scope.items.hot_city.length==0){
                CommonAddressDataService.getCityData({}).then(function(response){
                            $scope.items.citys = response.resp.data.citys;
                            $scope.items.hot_city = response.resp.data.hot_city;
                            //加载选择城市窗口模板
                            $ionicModal.fromTemplateUrl('templates/common/commonwindows/location-city-chooseWindow.html', {
                                scope: $scope,
                                animation: 'slide-in-up'
                            }).then(function (filterModal) {
                                $scope.citySelectWindow = filterModal;
                                $scope.citySelectWindow.show();
                                $ionicLoading.hide();
                            });
                    },
                    function(errorMessage){
                        $ionicLoading.hide();
                        $scope.error=errorMessage;
                    }
                );
            }else{
                $ionicLoading.hide();
                $scope.citySelectWindow.show();
            }
        };
        $scope.goto = function (id) {
            $location.hash(id);
            $anchorScroll();
        };
        $scope.locationButtonText = "点击定位";
        $scope.locationButtonClick = false;
        //重新定位
        $scope.resetLocation = function(){
            $scope.locationButtonText = "定位中...";
            $scope.locationButtonClick = true;
            //$scope.query.city_name = '潮州市';
            /*$scope.query.city_name = $scope.locationCity;*/
            $scope.locationCityFunction();
        };

        $scope.setChoseCity = function(cityName){
            $scope.choseCity = cityName;
        };
        $scope.getChoseCity = function(){
            return $scope.choseCity;
        };

        $scope.closeCitySelectWindow =function(){
            $scope.citySelectWindow.hide();
        };
        $scope.locationCityFunction = function(){
            $scope.locationButtonClick = true;
            $scope.locationCity = "定位中...";
            $timeout(function(){
                $scope.locationButtonText = "重新定位";
                $scope.locationButtonClick = false;
            },5000);
            BaiduLocationService.getDetailLocation().then(function(response){
                if(response.data.success==1){
                    $scope.locationButtonText = "重新定位";
                    $scope.locationButtonClick = false;
                    $scope.locationCity = response.data.location.city;
                }else{
                    $scope.locationCity = "定位失败";
                }
            },function(errorMessage){
                $scope.locationCity = "定位失败";
                $scope.error=errorMessage;
            });
        };
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

//进入历史搜索关键字窗口
.controller('HistorySearchWindowCtrl',function($scope,$state,$stateParams,$stateParams,$ionicModal,CommonSearchHistoryService,$ionicScrollDelegate,$ionicLoading){
    $scope.openHistorySearchWindow = function(search_type,init_keyword,placeholderInfo){
        $ionicLoading.show();
        $scope.searchType = search_type;
        $scope.placeholderInfo = placeholderInfo;
        $scope.keywordInfo = {keyword:init_keyword};

        if(CommonSearchHistoryService.getHistoryKeywordList($scope.searchType)!=null){
            $scope.historySearchWordList = CommonSearchHistoryService.getHistoryKeywordList($scope.searchType).keywordList;
        }else{
            $scope.historySearchWordList = [];
        }
        if(angular.isUndefined($scope.keyword_searchHistoryWindow)){
            $ionicModal.fromTemplateUrl('templates/common/commonwindows/keyword-searchHistoryWindow.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (filterModal) {
                $scope.keyword_searchHistoryWindow = filterModal;
                $scope.keyword_searchHistoryWindow.show();
                $ionicLoading.hide();
            });
        }else{
            $scope.keyword_searchHistoryWindow.show();
            $ionicLoading.hide();
        }
    };
    $scope.toSearch = function(keyword){
        $scope.keywordInfo.keyword = keyword;
        if(keyword!=''){
            CommonSearchHistoryService.updateHistoryKeyword($scope.searchType,keyword);
        }
        $scope.$emit('$fromChooseKeywordResult', $scope.keywordInfo);
        $scope.closeHistorySearchWindow();
        $ionicScrollDelegate.$getByHandle('historySearchScroll').scrollTo(0,0,true);
    };
    $scope.clearHistoryKeyword = function(){
        if($scope.historySearchWordList.length>0){
            CommonSearchHistoryService.clearHistoryKeywordList($scope.searchType);
            $scope.historySearchWordList=[];
            $ionicScrollDelegate.$getByHandle('historySearchScroll').scrollTo(0,0,true);
        }
    };
    $scope.deleteOneKeyword = function(index){
        if($scope.historySearchWordList.length>0){
            CommonSearchHistoryService.deleteOneKeyword($scope.searchType,index);
            $scope.historySearchWordList.splice(index,1);
        }
    };
    $scope.closeHistorySearchWindow = function(){
        $scope.keyword_searchHistoryWindow.hide();
    };
    function mr_slideBoxUpdate(){
        setTimeout(function() {
            $ionicSlideBoxDelegate.slide(0);
            $ionicSlideBoxDelegate.update();
            $scope.$apply();
        });
    }
})

//进入历史搜索状态页面
    .controller('CommonSearchHistoryCtrl',function($scope,$state,$stateParams,$location,CommonSearchHistoryService,$ionicScrollDelegate){
        $scope.searchType = $stateParams.searchType;
        console.log($stateParams.searchType);
        $scope.$on("$ionicView.beforeEnter", function () {
            if(CommonSearchHistoryService.getHistoryKeywordList($scope.searchType)!=null){
                $scope.historySearchWordList = CommonSearchHistoryService.getHistoryKeywordList($scope.searchType).keywordList;
            }else{
                $scope.historySearchWordList = [];
            }
            console.log($scope.historySearchWordList);
        });

        $scope.getHotProductSearch =  function () {
            if($scope.searchType=='product'){

                CommonSearchHistoryService.getHotProductSearch({}).then(function(response){
                    $scope.productSearchWordList = response.resp.data.datas;
                }, function(response) {  // 错误回调
                    console.log('请求失败'+response);
                });
            }
        };
        $scope.getHotProductSearch();
        $scope.product = {keyword:''};
        $scope.search = function(keyword){
            $scope.product.keyword = keyword;
            console.log(keyword!='');
            if(keyword!=''){
                CommonSearchHistoryService.updateHistoryKeyword($scope.searchType,keyword);
            }
            if($scope.searchType =='product'){
                $state.go('tab.home-product-selection', {keyword:keyword});
            }else if($scope.searchType =='purchase'){
                $state.go('tab.supply-menu-detail',{keyword:keyword});
            }else if($scope.searchType =='process'){
                $state.go('tab.home-process-selection',{keyword:keyword});
            }else if($scope.searchType =='store'){
                $state.go('tab.store-selection',{keyword:keyword});
            }/*else if($scope.searchType =='recruit'){
             $state.go('tab.home-recruit',{keyword:keyword});
             }*/
        };
        $scope.clearHistoryKeyword = function(){
            if($scope.historySearchWordList.length>0){
                CommonSearchHistoryService.clearHistoryKeywordList($scope.searchType);
                $scope.historySearchWordList=[];
                $ionicScrollDelegate.scrollTop();
            }
        };
        $scope.deleteOneKeyword = function(index){
            if($scope.historySearchWordList.length>0){
                CommonSearchHistoryService.deleteOneKeyword($scope.searchType,index);
                $scope.historySearchWordList.splice(index,1);
            }
        };
        function mr_slideBoxUpdate(){
            setTimeout(function() {
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
                $scope.$apply();
            });
        }
    })



;

