app.controller('ExamScoreController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $http, $location,
    $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup, $ionicLoading) {

    var refreshExamScore = function() {
      return $q(function(resolve, reject) {
      	var returnResponse = function(data) {
      		var _redata = [];
      		$(data).find(".tablebordersmaller tr").each(function (i, d) {
      			if(i > 0) {
      				_redata.push({
      					term: 'Theory Score',
      					year: $(data).find("#ctl00_cpContent_ddlPeriodYear").val(),
      					smester: $(data).find("#ctl00_cpContent_ddlPeriodSemester").val(),
      					name: $(this).find("td").eq(1).text(),
      					data: [
      						[{
      							name: 'TM',
      							value: $(this).find("td").eq(5).find("a:first").text()
      						}, {
      							name: 'MID',
      							value: $(this).find("td").eq(6).find("a:first").text()
      						}, {
      							name: 'Practicum',
      							value: $(this).find("td").eq(7).find("a:first").text()
      						}],[{
      							name: 'SKS',
      							value: $(this).find("td").eq(2).text()
      						}, {
      							name: 'Final',
      							value: $(this).find("td").eq(8).find("a:first").text()
      						}, {
      							name: 'Result',
      							value: $(this).find("td").eq(9).find("a:first").text()
      						}]
      					]
      				});
      			}
      		});

					$(data).find(".tablewithborder tr").each(function (i, d) {
      			if(i > 0) {
      				_redata.push({
      					term: 'Practicum Score',
      					year: $(data).find("#ctl00_cpContent_ddlPeriodYear").val(),
      					smester: $(data).find("#ctl00_cpContent_ddlPeriodSemester").val(),
      					name: $(this).find("td").eq(1).text(),
      					data: [
      						[{
      							name: 'MID',
      							value: $(this).find("td").eq(3).find("a:first").text()
      						}, {
      							name: 'Final',
      							value: $(this).find("td").eq(4).find("a:first").text()
      						}, {
      							name: 'Project',
      							value: $(this).find("td").eq(5).find("a:first").text()
      						}],[{
      							name: 'Project',
      							value: $(this).find("td").eq(6).find("a:first").text()
      						}, {
      							name: ' ',
      							value: ' '
      						}, {
      							name: ' ',
      							value: ' '
      						}]
      					]
      				});
      			}
      		});
      		return _redata;
      	};
      	if (typeof httpclient === "undefined") {	
          $http.get('http://localhost:2505/exam-score.html')
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
                $(d.result).find(".itemContent ul li:eq(3) > a").attr("href")
              );
            }, function() {
              return $q.reject("can't access to main frame");
            })
            .then(function(d) {
              return BinusMaya.api(
                $(d.result.result).find("#ctl00_cpContent_rptMainMenuStudent_ctl03_linkMenuStudent").attr("href"), 'get', {}, true
              );
            }, function() {
              return $q.reject("can't access to main frame");
            })
            .then(function(d) {
              return BinusMaya.api(
                $(d.result).find("#ctl00_cpContent_rptSubMenu_ctl01_linkSubMenu").attr("href"), 'get', {}, true
              );
            }, function() {
              return $q.reject("can't access to main frame");
            })
            .then(function(c) {
              resolve(returnResponse(c.result));
            }, function() {
              reject("can't access to main frame");
            });
        }
      });
  	};

  	$scope.doRefresh = function() {
      refreshExamScore()
        .then(function(done) {
          $scope.$applyAsync(function() {
            if (!localStorage.examScore || done.length > 0) {
              localStorage.examScore = JSON.stringify(done);
              $scope.examScore = done;
            }
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            
          });
        }, function(err) {
          errHandle(err);
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        });
    };

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.isAllow = false;
    BinusMaya.promptPassword('services', $scope, 'examScore')
    .then(function() {
			$scope.examScore = false;
	    if (typeof localStorage.examScore !== "undefined") {
	      $scope.examScore = JSON.parse(localStorage.examScore);
	    } else {
	    	$ionicPlatform.ready(function() {
	        $ionicLoading.show({templateUrl: 'views/module/loading.html',noBackdrop: true});
	        $scope.doRefresh();
	      });
	    }
    });

  });