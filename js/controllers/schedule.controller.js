/**
 * Schedule Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('ScheduleController',
  function($scope, $ionicPopup, $timeout, $ionicHistory, $rootScope, $ionicPlatform, BinusMaya, $q, $http, $ionicLoading) {

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
        var getLast = m.split("-")[1].split(":"),
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

    var toJson = function(data) {
      var hasil = [];
      $(data).find('tr').each(function(i, a) {
        var ht = $(this).find('td');
        if (i > 0) {
          var match = ht.eq(3).html().match(/(.*)-(.*)/);
          hasil.push({
            date: ht.eq(0).html(),
            time: ht.eq(1).html(),
            state: ht.eq(2).html(),
            course: match[2],
            code: match[1],
            myClass: ht.eq(5).html(),
            room: ht.eq(6).html(),
            building: ht.eq(7).html()
          });
        }
      });
      return hasil;
    };

    var refreshJadwal = function() {
      return $q(function(resolve, reject) {
        var returnResponse = function(data) {
          var _schedule = $(data).find("table"),
              today = toJson(_schedule.eq(0).html()),
              next = toJson(_schedule.eq(1).html()),
              skedul = today.concat(next),
              jadwal = BinusMaya.grouping(skedul);
            if(jadwal.length > 0) {
              localStorage.jadwal = JSON.stringify(jadwal);
            }
            localStorage.lastUpdate = moment().format('D MMMM YYYY h:mm:ss');
            return {
              jadwal: jadwal, lastUpdate: localStorage.lastUpdate
            };
        };

        if(typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/schedule.html')
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
                $(d.result).find(".itemContent ul li:eq(0) > a").attr("href")
              );
            }, function() {
              reject("can't access to main frame");
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
              reject("can't access frame");
            })
            .then(function(d) {
              resolve(returnResponse(d.result));
            }, function() {
              reject("can't access schedule page");
            });
        }
      });
    };

    $scope.doRefresh = function() {
      refreshJadwal()
      .then(function(data) {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $rootScope.getLastUpdate();
        $scope.isSchedule = true;
        $scope.schedule = data.jadwal;
      }, errHandle);

      var errHandle = function(msg) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Oops !',
          template: msg
        });
        $scope.$broadcast('scroll.refreshComplete');
      };
    };

    if (localStorage.jadwal) {
      try {
        if (JSON.parse(localStorage.jadwal).length > 0) {
          $scope.isSchedule = true;
          $scope.schedule = JSON.parse(localStorage.jadwal);
        }
      } catch (e) {

      }
    } else {
      $ionicPlatform.ready(function() {
        $ionicLoading.show({templateUrl: 'views/module/loading.html',noBackdrop: true});
        $scope.doRefresh();
      });
    }

  });
