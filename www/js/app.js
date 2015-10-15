/**
 * BINUSMAYA MODULE
 * @author Pedox <naufal@martabakang.us>
 */


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var view_path = 'views/',
  pcolor = '#1C536F',
  _bimay_url = 'http://binusmaya.binus.ac.id',
  _bimay_api_url = 'http://apps.binusmaya.binus.ac.id';

var app = angular.module('BinusMaya', ['ionic', 'listRoute', 'BinusMayaFactory'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $ionicNavBarDelegate, BinusMaya) {

  $rootScope.login = (typeof localStorage.islogin == "undefined" ? false : localStorage.islogin);
  $rootScope.leftMenu = false;
  $rootScope.loginName = typeof localStorage.fname == "undefined" ? null : localStorage.fname.toLowerCase();
  $rootScope.profileImage = typeof localStorage.profileImage == "undefined" ? false : localStorage.profileImage;
  delete localStorage.cookie;
  delete localStorage.templogin;

  $ionicPlatform.ready(function() {
    $rootScope.onLoadStyle = {
      opacity: 1
    };
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.getLastUpdate = function() {
    $rootScope.lastUpdate = typeof localStorage.lastUpdate === "undefined" ? "Whatever" : localStorage.lastUpdate;
  };
  $rootScope.getLastUpdate();
  $rootScope.logout = function() {
    localStorage.clear();
    window.location.hash = '#/';
    $ionicHistory.clearHistory();
    $ionicNavBarDelegate.showBackButton(false);
    location.reload();
  };

  $rootScope.getProfileImage = function() {
    /** peform avatar **/
    BinusMaya.getProfileImage(
      function(done) {
        localStorage.profileImage = done;
        $rootScope.profileImage = done;
      },
      function() {

      });
  };

  if ($rootScope.login) {
    window.location.hash = '/schedule';
  } else {
    window.location.hash = '/';
  }
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.forwardCache(false);
  $ionicConfigProvider.views.maxCache(0);
});
