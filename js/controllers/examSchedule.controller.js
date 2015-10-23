app.controller('ExamScheduleController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $http, $location, 
  	$stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup) {

    $scope.doRefresh = function() {
      refreshSchedule()
        .then(function(done) {
          $scope.$applyAsync(function() {
            $scope.examScheduleList = done;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }, function(err) {
          errHandle(err);
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    var refreshSchedule = function() {
      return $q(function(resolve, reject) {
      	var returnResponse = function(data) {
      		return data;
      	};
      	if (typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/exam.html')
            .then(function(d) {
              resolve(returnResponse(d.data));
            }, reject);
        } else {

        }
      });
    };

    $scope.examScheduleList = false;
    if (typeof localStorage.examSchedule !== "undefined") {
      $scope.examScheduleList = JSON.parse(localStorage.examSchedule);
    }

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

  });