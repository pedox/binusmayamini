/**
 * My Class Inside
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('MyClassDetailController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $location,
    $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup, dataset) {

    $scope.classData = (typeof localStorage.myClass !== "undefined" ? JSON.parse(localStorage.myClass) : false);
    $scope.state = {
      isData: false,
      loading: true
    };
    $scope.data = $scope.classData[dataset];
    $scope.isPageTopic = false;

    var getClassDetail = function(url) {
      return $q(function(resolve, reject) {
        BinusMaya.checkLogin()
          .then(function() {
            return BinusMaya.api('/', 'get');
          }, function() {
            // Fail to re-login
            reject("can't re-auth your account");
          })
          // Load These Page
          .then(function(d) {
            return BinusMaya.frame(
              $(d.result).find(".itemContent ul li:eq(0) > a").attr("href")
            );
          }, function() {
            reject("can't access to main frame");
          })
          .then(function(c) {
            return BinusMaya.api(_bimay_api_url + '/LMS/' + url, 'get', {}, true);
          }, function() {
            reject("can't access to my class");
          })
          .then(function(d) {
            var done = d.result;
            var desc_main = $(done).find("#desc_course_desc > span").html(),
              desc_grad = $(done).find("#desc_grad_compete > span").html(),
              course = [];

            $(done).find("#ctl00_ContentPlaceHolder1_pnlContentTheory table tbody tr").each(function(i, d) {
              if (i !== 0) {
                course.push({
                  session: parseInt($(d).find("td:eq(0) > span").html()),
                  mode: $(d).find("td:eq(1) > span").html(),
                  topics: $(d).find("td:eq(2) > a").html(),
                  date: $(d).find("td:eq(3) > span").html(),
                  links: $(d).find("td:eq(4) > input").attr('name')
                });
              }
            });

            var _reData = {
              main_description: desc_main,
              grad_description: desc_grad,
              course: course
            };
            resolve(_reData);
          }, function() {
            reject("can't access to course page");
          });
      });
    };

    if (typeof $scope.classData[dataset].detail == "undefined") {
      getClassDetail($scope.classData[dataset].url)
        .then(function(data) {
          $scope.classData[dataset].detail = data;
          localStorage.myClass = JSON.stringify($scope.classData);
          $scope.$applyAsync(function() {
            $scope.state.loading = false;
            $scope.state.isData = $scope.classData[dataset].detail;
          });
          $scope.$broadcast('scroll.refreshComplete');
        }, errHandle);
    } else {
      $scope.state.loading = false;
      $scope.state.isData = $scope.classData[dataset].detail;
    }

    if ($scope.isPageTopic === false) {
      $scope.infoTab = 'active';
      $scope.topicsTab = '';
    } else {
      $scope.infoTab = '';
      $scope.topicsTab = 'active';
    }

    $scope.switchTab = function(state) {
      if (state === 0) {
        $scope.isPageTopic = false;
        $scope.infoTab = 'active';
        $scope.topicsTab = '';
      }
      if (state === 1) {
        $scope.isPageTopic = true;
        $scope.infoTab = '';
        $scope.topicsTab = 'active';
      }
    };

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };


  });
