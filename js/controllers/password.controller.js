/**
 * Password Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('PasswordController',
  function($scope, BinusMaya, $ionicPopup, $q, $http, $ionicLoading) {

  	$scope.input = {};

  	$scope.change = function() {
  		var data = JSON.parse(localStorage.loginId),
  			oldPass = localStorage.code ? localStorage.code : data.password;
  		
  		if($scope.input.oldPassword !== oldPass) {
  			$ionicPopup.alert({title: 'Oops !',template: 'Incorrect Code'});
  		} else if(!$scope.input.newPassword || !$scope.input.rePassword) {
  			$ionicPopup.alert({title: 'Oops !',template: 'Please Insert new Code'});
  		} else if($scope.input.newPassword !== $scope.input.rePassword) {
				$ionicPopup.alert({title: 'Oops !',template: 're code is not same as new code'});
  		} else {
  			$ionicPopup.alert({title: 'Success !',template: 'Code has been changed'});
  			localStorage.code = $scope.input.newPassword;
  			$scope.input = {};
  		}
  	};



  });