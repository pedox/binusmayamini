angular.module('BinusMayaFactory', [])

.factory('BinusMaya', function($q) {
  return {

    _bimay_url: 'http://binusmaya.binus.ac.id',
    _bimay_api_url: 'http://apps.binusmaya.binus.ac.id',

    headers: function() {
      var _t = this;
      return  {
        Cookie: localStorage.cookie ? localStorage.cookie : null,
        Origin: _t._bimay_url,
        Referer: _t._bimay_url
      };
    },
    checkLogin: function() {
      var _t = this;
      var login = JSON.parse(localStorage.loginId);
      return $q(function(resolve, reject) {
        if(localStorage.templogin === true) {
          resolve(true);
        } else {
          return _t.api('/', 'get')
          .then(function(d) {
            if(d.code !== 200) reject(d);
            var data = {};
            $($(d.result).serializeArray()).each(function(i, d) {
              data[d.name] = d.value;
            });
            data.txtUserId = login.binusid;
            data.txtPassword = login.password;
            data.btnLogin = "Log In ";
            return _t.api('/', 'post', data);
          }, reject)
          .then(function(d) {
            localStorage.templogin = true;
            resolve(true);
          }, reject);
        }
      });
    },
    api: function(endpoint, method, params, noEndpoint) {
      var _t = this;
      typeof noEndpoint !== "undefined" ? false : true;
      if (localStorage.cookie === undefined) {
        return _t._getCookie()
        .then(function() {
          return _t.api(endpoint, method, params);
        });
      } else {
        return $q(function(resolve, reject) {
          if (method === "get") {
            httpclient.get((noEndpoint ? endpoint : _t._bimay_url + endpoint), resolve, reject, {
              headers: _t.headers()
            });
          } else {
            httpclient.post((noEndpoint ? endpoint : _t._bimay_url + endpoint), params, resolve, reject, {
              headers: _t.headers()
            });
          }
        });
      }
    },

    frame: function(url) {
      var _t = this,
         _url = '';
      return $q(function(resolve, reject) {
        return _t.api(url, 'get')
        .then(function(d) {
          return _t.api($(d.result).find("#ctl00_cp1_ifrApp").attr("src"), 'get');
        }, reject)
        .then(function(d) {
          _url = $(d.result).find("#ifrApp").attr("src");
          return _t.api(_url, 'get', {}, true);
        }, reject)
        .then(function(d) {
          resolve({
            url: _url,
            result: d
          });
        }, reject);
      });
    },

    _getCookie: function() {
      var _t = this;
      return $q(function(resolve, reject) {
        httpclient.get(_t._bimay_url, function(data) {
          if (data.code == 200) {
            localStorage.cookie = data.header['Set-Cookie'];
            resolve(true);
          } else {
            reject(data);
          }
        }, resolve);
      });
    },
    _requestError: function(data) {

    }
  };
});