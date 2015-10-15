/**
 * Schedule Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('ScheduleController',
  function($scope, $ionicPopup, $timeout, $ionicHistory, $rootScope, $ionicPlatform, BinusMaya) {

    $rootScope.noHeader = false;

    $rootScope.leftMenu = true;
    $ionicPlatform.onHardwareBackButton(function(e) {
      e.preventDefault();
    });

    $scope.getState = function(d) {
      var today = moment();
      //today
      if (moment(d).isSame(today, 'day')) {
        return 'today';
      } else
      //tomorrow
      if (moment(d).isSame(today.add(1, 'd'), 'day')) {
        return 'tomorrow';
      } else
      //lasted
      if (moment(d) < today) {
        return 'completo';
      }
    };

    $scope.getCourseState = function(d, m) {
      var now = moment(),
          getMoment = null;
      try {
        var getLast = m.split("- ")[1].split(":"),
          getHour = parseInt(getLast[0]),
          getMinute = parseInt(getLast[1]);

        getMoment = moment(d).hour(getHour).minute(getMinute);
      } catch (e) {
        getMoment = moment(d);
      }

      if (getMoment < now) {
        return 'completo';
      }
    };

    $scope.isSchedule = false;
    $scope.schedule = [];

    if (localStorage.jadwal) {
      try {
        if (JSON.parse(localStorage.jadwal).length > 0) {
          $scope.isSchedule = true;
          $scope.schedule = JSON.parse(localStorage.jadwal);
        }
      } catch (e) {

      }
    }

    $scope.doRefresh = function() {
      BinusMaya.checkLogin()
      .then(function() {
        return BinusMaya.api('/','get');
      }, function() {
        // Fail to re-login
        errHandle("can't re-auth your account");
      })
      // Load These Page
      .then(function(d) {
        return BinusMaya.frame(
          $(d.result).find(".itemContent ul li:eq(0) > a").attr("href")
        );
      }, function() {
        errHandle("can't access to main frame");
      })
      .then(function(c) {
        var data = {},
            d = c.result;
        $($(d.result).serializeArray()).each(function(i, d) {
          data[d.name] = d.value;
        });
        data.__EVENTTARGET = 'ctl00$ContentPlaceHolder1$btnSchedule';
        return BinusMaya.api(_bimay_api_url + '/LMS/MyClass.aspx', 'post', data, true);
      }, function() {
        errHandle("can't access frame");
      })
      .then(function(d) {
        $scope.$broadcast('scroll.refreshComplete');
      }, function() {
        errHandle("can't access schedule page");
      });

      var errHandle = function(msg) {
        $ionicPopup.alert({
          title: 'Oops !',
          template: msg
        });
        $scope.$broadcast('scroll.refreshComplete');
      };

      /*BinusMaya.getSchedule(
        function() {
          $scope.$broadcast('scroll.refreshComplete');
          if (localStorage.jadwal) {
            var jadwal = JSON.parse(localStorage.jadwal);
            $rootScope.getLastUpdate();
            if (jadwal.length > 0) {
              $scope.isSchedule = true;
              $scope.schedule = jadwal;
            } else {
              BinusMaya.alert("No Schedule found");
            }

          } else {
            $scope.isSchedule = false;
            $scope.schedule = [];
          }

        },
        function(err) {
          $ionicPopup.alert({
            title: err,
            template: msg
          });
          $scope.$broadcast('scroll.refreshComplete');
        });*/
      /*$timeout(function() {
      	$scope.$broadcast('scroll.refreshComplete');
      }, 3000);*/
    };
  });
