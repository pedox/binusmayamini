app.controller('ExamScheduleController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $http, $location, 
  	$stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup) {

    $scope.doRefresh = function() {
      refreshSchedule()
        .then(function(done) {
          $scope.$applyAsync(function() {
          	if(done.length > 0)
          	{
	          	localStorage.examSchedule = JSON.stringify(done);
	            $scope.examScheduleList = done;
          	}
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
      		var _data = [];
      		for (var i = 0; i < data.length; i++) {
      			var term = $(data[i]).find("table:eq(2) tr td li").text();
	      		$(data[i]).find(".tablewithborder tr").each(function(i, d) {
	      			if(i > 0) {
		      			_data.push({
		      				term: 		  term,
		      				code: 			$(d).find("td").eq(0).text(),
		      				name: 			$(d).find("td").eq(1).text(),
		      				sks: 				$(d).find("td").eq(2).text(),
		      				date: 			$(d).find("td").eq(3).text(),
		      				hour: 			$(d).find("td").eq(4).text(),
		      				room: 			$(d).find("td").eq(5).text(),
		      				campus: 		$(d).find("td").eq(6).text(),
		      				className: 	$(d).find("td").eq(7).text(),
		      				seat: 			parseInt($(d).find("td").eq(8).text())
		      			});
	      			}
	      		});
      		}
      		return BinusMaya.grouping(_.sortBy(_data, 'date'));
      	};
      	var dataSchedule = [],
      			schedule_url = "";
      	if (typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/exam.html')
            .then(function(d) {
            	dataSchedule.push(d.data);
              return $http.get('http://localhost:2505/exam-practicum.html');
            }, reject)
            .then(function(e) {
            	dataSchedule.push(e.data);
              resolve(returnResponse(dataSchedule));
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
                $(d.result.result).find("#ctl00_cpContent_rptMainMenuStudent_ctl02_linkMenuStudent").attr("href"), 'get', {}, true
              );
            }, function() {
              reject("can't access to main frame");
            })
            .then(function(d) {
            	schedule_url = d.result;
            	return BinusMaya.api($(schedule_url).find(".itemContentService li:eq(0) a").attr("href"), 'get', {}, true);
            }, function() {
              reject("can't access to main frame");
            })
            .then(function(d) {
            	dataSchedule.push(d.result);
            	return BinusMaya.api($(schedule_url).find(".itemContentService li:eq(1) a").attr("href"), 'get', {}, true);
            }, function() {
              reject("can't access to main frame");
            })
            .then(function(d) {
            	dataSchedule.push(d.result);
            	return BinusMaya.api($(schedule_url).find(".itemContentService li:eq(2) a").attr("href"), 'get', {}, true);
            }, function() {
              reject("can't access to main frame");
            })
            .then(function(d) {
            	dataSchedule.push(d.result);
            	resolve(returnResponse(dataSchedule));
            }, function() {
              reject("can't access to main frame");
            });
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