/**
 * Permission Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('PermissionController',
  function($scope, BinusMaya, $ionicPopup, $q, $http, $ionicLoading) {
    $scope.isAllow = false;
    $scope.permission = JSON.parse(localStorage.permission);

    $scope.change = function() {
    	localStorage.permission = JSON.stringify($scope.permission);
    };

    BinusMaya.promptPassword('settings', $scope)
    .then(function() {
      
    });
  });