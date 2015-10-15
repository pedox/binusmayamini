app.controller('LoginController',
function($scope, $ionicPopup, $timeout, $ionicHistory, $ionicNavBarDelegate, $rootScope, BinusMaya) {

    $rootScope.noHeader = true;
    $ionicNavBarDelegate.showBar(false);

    $scope.loading = false;
    $scope.loginClass = '';

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $scope.submit = function() {
      if (!($scope.binusid && $scope.password)) {
        $ionicPopup.alert({
          title: 'Oops !',
          template: 'Please Input Binusian ID and Password'
        });
      } else {
        $scope.loginClass = 'on-loading';
        $scope.loading = true;
        BinusMaya.api('/', 'get')
        .then(function(d) {
          if(d.code !== 200) handleError(d);
          var data = {};
          $($(d.result).serializeArray()).each(function(i, d) {
            data[d.name] = d.value;
          });
          data.txtUserId = $scope.binusid;
          data.txtPassword = $scope.password;
          data.btnLogin = "Log In ";
          return BinusMaya.api('/', 'post', data);
        }, handleError)
        .then(function(d) {
          var name = $(d.result).find("#content #topbar .right strong");
          // When Success
          if(d.code !== 200)
            handleError(d);
          if(name.length <= 0) {
            handleError(d, $(d.result).find("#lblError").text());
          } else {
            $scope.loading = false;
            $scope.loginClass = '';

            /**
             * I Think that not best method
             * @todo make it hash
             */
            localStorage.loginId = JSON.stringify({
              binusid: $scope.binusid,
              password: $scope.password
            });

            localStorage.islogin = true;
            localStorage.fname = name.text();
            $rootScope.login = true;
            $rootScope.loginName = localStorage.fname.toLowerCase();
            $scope.loginClass = '';
            $scope.loading = false;
            window.location.hash = '#/schedule';
            $ionicHistory.clearHistory();
            $ionicNavBarDelegate.showBackButton(false);
          }

        }, handleError);

        var handleError = function(data, text) {
          typeof text !== "undefined" ? text : null;
          $scope.loading = false;
          $scope.loginClass = '';
          $ionicPopup.alert({
            title: 'Oops !',
            template: text ? text : 'Something wrong !'
          });
        };
      }
    };
  }
);
