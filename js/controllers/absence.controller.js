app.controller('AbsenceController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $http, $location,
    $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup) {

    $scope.doRefresh = function() {
      refreshAbsence()
        .then(function(done) {
          $scope.$applyAsync(function() {
            if (done.length > 0) {
              localStorage.absence = JSON.stringify(done);
              $scope.absence = done;
            }
            $scope.$broadcast('scroll.refreshComplete');
          });
        }, function(err) {
          errHandle(err);
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    var refreshAbsence = function() {
      return $q(function(resolve, reject) {
        var returnResponse = function(data) {
          var _data = [], count = 0;
          function getStatus(str) {
						if(/baik/.test(str)) {
							return 'balanced';
						} else if(/warning/.test(str)) {
							return 'calm';
						} else if(/maximum/.test(str)) {
							return 'energized';
						} else if(/overlimit/.test(str)) {
							return 'assertive';
						}
					}
          $(data).find('#rptTable tr').each(function(i, a) {
            var ht = $(this).find('td');
            if (i > 0) {
              if (ht.length >= 8) {
                _data[count] = {
                  name: ht.eq(0).html(),
                  absence: [{
                    max: ht.eq(3).html(),
                    total: ht.eq(4).html(),
                    component: ht.eq(2).text(),
                    status: getStatus(ht.eq(5).find("img").attr("src"))
                  }]
                };
                count++;
              } else {
                _data[count - 1].absence.push({
                  max: ht.eq(2).html(),
                  total: ht.eq(3).html(),
                  component: ht.eq(1).text(),
                  status: getStatus(ht.eq(4).find("img").attr("src"))
                });
              }
            }
          });
          return _data;
        };
        if (typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/absence.html')
            .then(function(d) {
              resolve(returnResponse(d.data));
            }, reject);
        } else {
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
              $(d.result).find(".itemContent ul li:eq(3) > a").attr("href")
            );
          }, function() {
            reject("can't access to main frame");
          })
          .then(function(d) {
            return BinusMaya.api(
              $(d.result.result).find("#ctl00_cpContent_rptMainMenuStudent_ctl01_linkMenuStudent").attr("href"), 'get', {}, true
            );
          }, function() {
            reject("can't access to main frame");
          })
          .then(function(d) {
            return BinusMaya.api(
              $(d.result).find("#ctl00_cpContent_rptSubMenu_ctl02_linkSubMenu").attr("href"), 'get', {}, true
            );
          }, function() {
            reject("can't access to main frame");
          })
          .then(function(c) {
            resolve(returnResponse(c.result));
          }, function() {
            reject("can't access to main frame");
          });
        }
      });
    };

    $scope.absence = false;
    if (typeof localStorage.absence !== "undefined") {
      $scope.absence = JSON.parse(localStorage.absence);
    }

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

  });