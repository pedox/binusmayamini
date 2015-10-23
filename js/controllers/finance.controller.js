/**
 * Finance Controller
 * @author Naufal <naufal@martabakang.us>
 */
app.controller('FinanceController',
  function($scope, BinusMaya, $ionicPopup, $q, $http) {

    $scope.isAllow = false;

    $scope.doRefresh = function() {
      refreshFinance()
        .then(function(done) {
          $scope.$applyAsync(function() {
            $scope.financeList = done;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }, function(err) {
          errHandle(err);
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.toMoney = function(n) {
      try {
        return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } catch (e) {
        return 0;
      }
    };

    var refreshFinance = function() {
      return $q(function(resolve, reject) {

        var returnResponse = function(data) {
          var billing = 0;
          try {
            billing = parseInt($(data).find("table:eq(0) tr td").html().match(/[0-9]+/)[0]);
          } catch (e) {}
          var hasil = [];
          $(data).find('table#rptTable tr').each(function(i, a) {
            var ht = $(this).find('td');
            if (i > 0) {
              hasil.push({
                date: ht.eq(1).html(),
                title: ht.eq(2).html(),
                term: ht.eq(3).html(),
                due: ht.eq(4).html(),
                charge: isNaN(parseInt(ht.eq(5).html())) === true ? 0 : parseInt(ht.eq(5).html()),
                payment: isNaN(parseInt(ht.eq(6).html())) === true ? 0 : parseInt(ht.eq(6).html().match(/[0-9]+/)),
                refund: isNaN(parseInt(ht.eq(7).html())) === true ? 0 : parseInt(ht.eq(7).html())
              });
            }
          });
          var final_data = {
            data: BinusMaya.grouping(hasil),
            billing: billing,
            lastUpdate: moment().format('D MMMM YYYY h:mm:ss')
          };
          localStorage.finance = JSON.stringify(final_data);
          return final_data;
        };

        if (typeof httpclient === "undefined") {
          $http.get('http://localhost:2505/finance.html')
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
            .then(function() {
              return BinusMaya.api(
                $("#ctl00_cpContent_rptMainMenuStudent_ctl06_linkMenuStudent").attr("href"), 'get', {}, true
              );
            }, function() {
              reject("can't access to main frame");
            })
            .then(function() {
              return BinusMaya.api(
                $("#ctl00_cpContent_rptSubMenu_ctl03_linkSubMenu").attr("href"), 'get', {}, true
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

    $scope.financeList = false;
    if (typeof localStorage.finance !== "undefined") {
      $scope.financeList = JSON.parse(localStorage.finance);
    }

    var errHandle = function(msg) {
      $ionicPopup.alert({
        title: 'Oops !',
        template: msg
      });
      $scope.$broadcast('scroll.refreshComplete');
    };

    BinusMaya.promptPassword('services', $scope);
  }
);