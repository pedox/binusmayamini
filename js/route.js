angular.module('listRoute', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('index', {
      url: '/',
      views: {
        'main-view': {
          templateUrl: view_path + 'login.html'
        }
      }
    })
    .state('schedule', {
      url: '/schedule',
      views: {
        'main-view': {
          templateUrl: view_path + 'schedule.html',
          controller: 'ScheduleController'
        }
      }
    })
    .state('about', {
      url: '/about',
      views: {
        'main-view': {
          templateUrl: view_path + 'about.html'
        }
      }
    })
    .state('forum', {
      url: '/forum',
      views: {
        'main-view': {
          templateUrl: view_path + 'forum.html',
          controller: 'ForumController'
        }
      }
    })
    .state('services', {
      url: '/services',
      views: {
        'main-view': {
          templateUrl: view_path + 'services/index.html',
          controller: 'ServicesController'
        }
      }
    })
    .state('myclass', {
      url: '/myclass',
      views: {
        'main-view': {
          templateUrl: view_path + 'myclass.html',
          controller: 'MyClassController'
        }
      }
    })
    .state('myclassDetail', {
      url: '/myclass-detail/:code',
      resolve: {
        dataset: function($q, $stateParams, $location) {
          var _got = false;
          var deferred = $q.defer();
          var classData = (typeof localStorage.myClass !== "undefined" ? JSON.parse(localStorage.myClass) : false);
          for (var d in classData) {
            if (classData[d].code == $stateParams.code) {
              _got = d;
            }
          }
          if (_got) {
            deferred.resolve(_got);
          } else {
            $location.path('/myclass').replace();
          }
          return deferred.promise;
        }
      },
      views: {
        'main-view': {
          templateUrl: view_path + 'myclassInside.html',
          controller: 'MyClassDetailController'
        }
      }
    })
    .state('examSchedule', {
      url: '/exam-schedule',
      views: {
        'main-view': {
          templateUrl: view_path + 'services/exam-schedule.html',
          controller: 'ExamScheduleController'
        }
      }
    })
    .state('examScore', {
      url: '/exam-score',
      views: {
        'main-view': {
          templateUrl: view_path + 'services/exam-score.html',
          controller: 'ExamScoreController'
        }
      }
    })
    .state('financeStatus', {
      url: '/finance-status',
      views: {
        'main-view': {
          templateUrl: view_path + 'services/billing.html',
          controller: 'FinanceController'
        }
      }
    })
    .state('absence', {
      url: '/absence',
      views: {
        'main-view': {
          templateUrl: view_path + 'services/absence.html',
          controller: 'AbsenceController'
        }
      }
    })
    .state('settings', {
      url: '/settings',
      views: {
        'main-view': {
          templateUrl: view_path + 'settings/index.html',
        }
      }
    })
    .state('permissions', {
      url: '/settings/permissions',
      views: {
        'main-view': {
          templateUrl: view_path + 'settings/permissions.html',
          controller: 'PermissionController'
        }
      }
    })
    .state('password', {
      url: '/settings/password',
      views: {
        'main-view': {
          templateUrl: view_path + 'settings/password.html',
          controller: 'PasswordController'
        }
      }
    })
    .state('coming', {
      url: '/coming',
      views: {
        'main-view': {
          templateUrl: view_path + 'coming.html'
        }
      }
    });

  $urlRouterProvider.otherwise("/coming");
}]);
