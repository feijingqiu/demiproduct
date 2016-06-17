// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionicLazyLoad','starter.templates','starter.services','starter.HomeServices', 'starter.controllers', 'starter.HomeControllers','ionic-fancy-select'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  /*  $cordovaStatusbar.styleColor('red');*/
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      /*StatusBar.hide();*/
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
/*  .state('tab.home-menu-detail', {
      url: '/home/menus/:menuid/:keyword',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/home-menu-detail.html',
          controller: 'MenuDetailCtrl'
        }
      }
    })*/
    .state('tab.home-search-productHistory', {
    	url: '/home/home-search-productHistory?searchType',
    	views: {
    		'tab-home': {
    			templateUrl: 'templates/common/common-search-history.html',
    			controller: 'CommonSearchHistoryCtrl'
    		}
    	}
    })
    .state('tab.home-product-selection', {
    	url: '/home/product-selection?menu_id&menu_name&keyword',
    	views: {
    		'tab-home': {
              templateUrl: 'templates/home/home-product-selection.html',
              controller: 'ProductSelectionCtrl'
    		}
    	}
    })
    .state('tab.home-product-detail', {
    	url: '/home/products/:product_id',
    	views: {
    		'tab-home': {
    			templateUrl: 'templates/home/home-product-detail.html',
    			controller: 'ProductDetailCtrl'
    		}
    	}
    })
      .state('tab.home-store-detail', {
        url: '/home/home-store-detail?product_store_id&userid',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-store-detail.html',
            controller: 'StoreDetailCtrl'
          }
        }
      })

      /*--------------------------- 加工厂-----------------------------*/
      //加工厂主页
      .state('tab.home-process', {
        url: '/home/process',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-process.html',
            controller: 'HomeProcessCtrl'
          }
        }
      })
      //详情
      .state('tab.home-process-detail', {
        url: '/home/process-detail/:lease_id',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-lease-detail.html',
           /* controller: 'LeaseDetailCtrl'*/
          }
        }
      })

      //详情
      .state('tab.home-process-selection', {
        url:'/home/home-process-selection?searchType',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-process-selection.html',
             controller: 'ProcessSelectionCtrl'
          }
        }
      })

    /*---------- ----------------- 租赁-----------------------------*/
    //列表
    .state('tab.home-lease', {
      url: '/home/lease',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/home-lease.html',
          controller: 'HomeLeaseCtrl'
        }
      }
    })
    //详情
    .state('tab.home-lease-detail', {
      url: '/home/leaseDetail/:lease_id',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/home-lease-detail.html',
          controller: 'LeaseDetailCtrl'
        }
      }
    })
    /* -------------------------招聘-------------------------*/
    //招聘主页
      .state('tab.home-recruit', {
        url: '/home/recruit?keyword',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/home-recruit.html',
            controller: 'HomeRecruitCtrl'
          }
        }
      })

      .state('tab.common-iframe', {
        url: '/home/common-iframe?url_type',
        views: {
          'tab-home': {
            templateUrl: 'templates/home/common-iframe.html',
            controller: 'CommonIframeCtrl'
          }
        }
      })
    /* -------------------------色卡-------------------------*/
    .state('tab.home-color-card', {
      url: '/home/home-color-card',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/home-color-card.html',
          controller: 'ColorCardCtrl'
        }
      }
    })
  // Each tab has its own nav history stack:

  .state('tab.supply', {
	  url: '/supply',
	  views: {
		  'tab-supply': {
			  templateUrl: 'templates/tab-supply.html',
			  controller: 'SupplyCtrl'
		  }
	  }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
  $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
  $ionicConfigProvider.navBar.alignTitle('center');
});
