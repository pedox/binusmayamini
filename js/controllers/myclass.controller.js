/**
 * My Class Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('MyClassController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $location, $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup) {
    $rootScope.noHeader = false;
    $rootScope.leftMenu = true;
    $ionicPlatform.onHardwareBackButton(function(e) {
      e.preventDefault();
    });

    $scope.classData = (typeof localStorage.myClass !== "undefined" ? JSON.parse(localStorage.myClass) : false);

    var refreshMyClass = function() {
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
            var _reData = [],
              _promisesYou = [],
              _promisesCount = 0;
            $(c.result.result).find("#ctl00_ContentPlaceHolder1_pnlTeori ul li").each(function(i, d) {
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
            resolve(_reData);
          }, function() {
            reject("can't access to my class");
          });
      });
    };

    $scope.doRefresh = function() {
      refreshMyClass()
      .then(function(done) {
        if (done.length > 0) {
          $scope.classData = done;
        } else {
          errHandle("You don't have any class");
        }
        $scope.$broadcast('scroll.refreshComplete');
      }, errHandle);

      var errHandle = function(msg) {
        $ionicPopup.alert({
          title: 'Oops !',
          template: msg
        });
        $scope.$broadcast('scroll.refreshComplete');
      };
    };

  });
