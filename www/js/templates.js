angular.module('starter.templates',[])
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('templates/common/area-chooseWindow.html',
            '<ion-modal-view ng-controller="CommonAreaChooseWindowCtrl">\n' +
            '<ion-header-bar class="bar-stable bar bar-header disable-user-behavior " align-title="center">\n' +
            '<button class="button back-button buttons button-clear header-item" ng-click="closeChooseWindow()">\n' +
            '<i class="icon ion-ios-arrow-back mr-header-title-color"></i>\n' +
            '</button>\n' +
            '<div class="title title-center header-item" style="transform: translate3d(0px, 0px, 0px); left: 60px; right: 60px;font-weight:bold;">\n' +
            '<span class="nav-bar-title mr-header-title-color" >\n' +
            '地区选择</span>\n' +
            '</div>\n' +
            '</ion-header-bar>\n' +
            '<ion-content scroll="false">\n' +
            '<div >\n' +
            '<div class="first-open first-first-roll" >\n' +
            '<ul class="first-first">\n' +
            '<li ng-class="{chooseColor_1: chooseAreaWindowDate.first_1_button === -1}"ng-click="chooseFirst_first(defaultLine)" >不限</li>\n' +
            '<li ng-repeat="first_1 in chooseAreaWindowDate.firstList_1" ng-class="{chooseColor_1: chooseAreaWindowDate.first_1_button === first_1.id}"ng-click="chooseFirst_first(first_1)" ng-bind="::first_1.name"></li>\n' +
            '</ul>\n' +
            '<ul class="first-second">\n' +
            '<li ng-class="{chooseColor_1: chooseAreaWindowDate.first_2_button === -1}"ng-click="chooseFirst_second(defaultLine)" >不限</li>\n' +
            '<li ng-repeat="first_2 in chooseAreaWindowDate.firstList_2"ng-class="{chooseColor_1: chooseAreaWindowDate.first_2_button === first_2.id }"ng-click="chooseFirst_second(first_2)" ng-bind="::first_2.name"></li>\n' +
            '</ul>\n' +
            '<ul class="first-third">\n' +
            '<li ng-class="{chooseColor_1: chooseAreaWindowDate.first_3_button === -1}"ng-click="chooseFirst_third(defaultLine)" >不限</li>\n' +
            '<li ng-repeat="first_3 in chooseAreaWindowDate.firstList_3" ng-class="{chooseColor_1: chooseAreaWindowDate.first_3_button === first_3.id }"ng-click="chooseFirst_third(first_3)" ng-bind="::first_3.name"></li>\n' +
            '</ul>\n' +
            '</div>\n' +
            '</div>\n' +
            '</ion-content>\n' +
            '</ion-modal-view>\n' +
            '');
    }])
 /*   .run(['$templateCache', function($templateCache) {
        $templateCache.put('templates/common/tabs.html',
            '<ion-view>\n' +
        '<ion-tabs class="tabs-icon-top tabs-color-active-positive {{$root.hideTabs}}" >\n' +
        '<ion-tab title="主页" icon-off="ion-ios-home-outline" icon-on="ion-ios-home" href="#/tab/home">\n' +
        '<ion-nav-view name="tab-home"></ion-nav-view>\n' +
        '</ion-tab>\n' +
        '<ion-tab title="供应" icon-off="ion-ios-cart-outline" icon-on="ion-ios-cart" href="#/tab/supply">\n' +
        '<ion-nav-view name="tab-supply"></ion-nav-view>\n' +
        '</ion-tab>\n' +
        '<ion-tab title="商铺" icon-off="custom-dianpu" icon-on="custom-dianpu" href="#/tab/store">\n' +
        '<ion-nav-view name="tab-store"></ion-nav-view>\n' +
        '</ion-tab>\n' +
        '<ion-tab title="消息" icon-off="ion-ios-chatbubble-outline" badge="($root.messageNoReadCount+$root.newFriendNoReadCount)" icon-on="ion-ios-chatbubble" href="#/tab/chats">\n' +
        '<ion-nav-view name="tab-chats"></ion-nav-view>\n' +
        '</ion-tab>\n' +
        '<ion-tab title="个人中心" icon-off="ion-ios-person-outline" icon-on="ion-ios-person" href="#/tab/account">\n' +
        '<ion-nav-view name="tab-account"></ion-nav-view>\n' +
        '</ion-tab>\n' +
        '</ion-tabs>\n' +
        '<ion-view>\n' +
            '');
    }])*/

;