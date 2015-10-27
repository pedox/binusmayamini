/**
 * My Class Inside
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('MyClassDetailController',
  function($scope, BinusMaya, $ionicNavBarDelegate, $state, $location, $http, $ionicScrollDelegate,
    $stateParams, $timeout, $rootScope, $ionicPlatform, $q, $ionicPopup, dataset, $timeout, $ionicLoading) {

    $scope.classData = (typeof localStorage.myClass !== "undefined" ? JSON.parse(localStorage.myClass) : false);
    $scope.state = {
      isData: false,
      loading: true
    };
    $scope.data = $scope.classData[dataset];
    $scope.showpage = 0;

    $scope.linksSetAssigment = [];
    $scope.linksSet = [];

    var getClassDetail = function(url) {
      return $q(function(resolve, reject) {
        var returnResponse = function(data) {
          var desc_main = $(data).find("#desc_course_desc > span").html(),
              desc_grad = $(data).find("#desc_grad_compete > span").html(),
              course = [], 
              assigment = [];
          $(data).find("#ctl00_ContentPlaceHolder1_pnlContentTheory table tbody tr").each(function(i, d) {
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
          $(data).find("#ctl00_ContentPlaceHolder1_pnlMainAssignment table tbody tr").each(function(i, d) {
            if (i !== 0) {
              assigment.push({
                term: 'Main Assignment',
                session: parseInt($(d).find("td").eq(0).text()),
                topics: $(d).find("td").eq(1).text(),
                title: $(d).find("td").eq(2).text(),
                desc: $(d).find("td").eq(3).text(),
                deadline: $(d).find("td").eq(4).text(),
                upload: $(d).find("td").eq(5).find("img").length ? true : false,
                checked: $(d).find("td").eq(6).find("img").length ? true : false,
                link: $(d).find("td").eq(7).find("input:eq(0)").attr('name')
              });
            }
          });
          $(data).find("#ctl00_ContentPlaceHolder1_pnlAdditionalAssignment2 table tbody tr").each(function(i, d) {
            if (i !== 0) {
              assigment.push({
                term: 'Additional Assignment',
                session: parseInt($(d).find("td").eq(0).text()),
                topics: $(d).find("td").eq(1).text(),
                title: $(d).find("td").eq(2).text(),
                desc: $(d).find("td").eq(3).text(),
                deadline: $(d).find("td").eq(4).text(),
                upload: $(d).find("td").eq(5).find("img").length ? true : false,
                checked: $(d).find("td").eq(6).find("img").length ? true : false,
                link: $(d).find("td").eq(7).find("input:eq(0)").attr('name')
              });
            }
          });

          return {
            main_description: desc_main,
            grad_description: desc_grad,
            assigment: assigment.length > 0 ? assigment : false,
            course: course
          };
        };

        if (typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/myclass-inside.html')
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
              return BinusMaya.api(_bimay_api_url + '/LMS/' + url, 'get', {}, true);
            }, function() {
              return $q.reject("can't access to my class");
            })
            .then(function(d) {
              resolve(returnResponse(d.result));
            }, function() {
              reject("can't access to course page");
            });
        }
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

    $scope.switchTab = function(state) {
      $scope.showpage = state;
      setTimeout(function() {
        $ionicScrollDelegate.resize();
      }, 100);
    };

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.downloadCourse = function(index, links) {
      $scope.linksSet[index] = {isLoading: true};
      downloadMaterial(links)
      .then(function(d) {
        window.open(d, '_system');
        $scope.linksSet[index] = {isLoading: false};  
      }, function() {
        $scope.linksSet[index] = {isLoading: false};
      });
    };

    $scope.downloadAssigment = function(index, links) {
      $scope.linksSetAssigment[index] = {isLoading: true};
      downloadMaterial(links)
      .then(function(d) {
        window.open(d, '_system');
        $scope.linksSetAssigment[index] = {isLoading: false};
      }, function() {
        $scope.linksSetAssigment[index] = {isLoading: false};
      });
    };


    var downloadMaterial = function(links)
    {
      return $q(function(resolve, reject) {
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
            return BinusMaya.download($scope.classData[dataset].url, links);
          }, function() {
            return $q.reject("can't access to my class");
          })
          .then(function(d) {
            resolve(d.header.Location);
          }, function(e) {
            reject(e);
          });
      });
    };

    $scope.refresh = function() {
      
      $ionicLoading.show({template: '<ion-spinner icon="android" class="overlay-spinner"></ion-spinner> Loading...'});

      getClassDetail($scope.classData[dataset].url)
        .then(function(data) {
          $scope.classData[dataset].detail = data;
          localStorage.myClass = JSON.stringify($scope.classData);
          $scope.$applyAsync(function() {
            $scope.state.loading = false;
            $scope.state.isData = $scope.classData[dataset].detail;
          });
          $ionicLoading.hide();
          $ionicScrollDelegate.resize();
        }, function(msg) {
          $ionicLoading.hide();
          errHandle(msg);
        });
    };


  });
