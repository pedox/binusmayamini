/**
 * My Class Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('MyClassController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $location, $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup, $ionicLoading, $http) {
    $rootScope.noHeader = false;
    $rootScope.leftMenu = true;
    $ionicPlatform.onHardwareBackButton(function(e) {
      e.preventDefault();
    });

    $scope.classData = (typeof localStorage.myClass !== "undefined" ? JSON.parse(localStorage.myClass) : false);

    var refreshMyClass = function() {
      return $q(function(resolve, reject) {
        var returnResponse = function(data) {
          var _reData = [];
          $(data).find("#ctl00_ContentPlaceHolder1_pnlTeori ul li").each(function(i, d) {
            var name = $(d).find("a").html(),
              reg = name.match(/^(.*)-(.*) \((.*)\)/i);
            _reData.push({
              indexItem: i,
              name: reg[2],
              url: $(d).find("a").attr('href'),
              code: reg[1],
              className: reg[3]
            });
          });
          localStorage.myClass = JSON.stringify(_reData);
          return _reData;
        };

        if(typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/myclass.html')
          .then(function(d) {
            resolve(returnResponse(d.data));
          }, reject);
        } else {
          BinusMaya.checkLogin()
            .then(function() {
              return BinusMaya.api('/', 'get');
            }, function() {
              // Fail to re-login
              return $q.reject("can't re-auth your account");
            })
            // Load These Page
            .then(function(d) {
              return BinusMaya.frame(
                $(d.result).find(".itemContent ul li:eq(0) > a").attr("href")
              );
            }, function() {
              return $q.reject("can't access to main frame");
            })
            .then(function(c) {
              resolve(returnResponse(c.result.result));
            }, function() {
              reject("can't access to my class");
            });
        }
      });
    };

    $scope.doRefresh = function() {
      refreshMyClass()
        .then(function(done) {
          $scope.classData = done;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }, function(e) {
          errHandle(e);
        });

      var errHandle = function(msg) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Oops !',
          template: msg
        });
        $scope.$broadcast('scroll.refreshComplete');
      };
    };

    if(!$scope.classData) {
      $ionicLoading.show({templateUrl: 'views/module/loading.html',noBackdrop: true});
      $scope.doRefresh();
    }

  });