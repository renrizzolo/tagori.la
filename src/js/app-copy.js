'use strict';

var app = angular.module('app', ['ngAnimate', 'ngDialog', 'ngRoute', 'angular-preload-image', 'ngMaterial', 'angular-whenScrolled', 'masonry']).
	config(['$locationProvider', '$routeProvider', '$sceDelegateProvider', function($locationProvider, $routeProvider, $sceDelegateProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/search/:searchText', { templateUrl: 'views/search.html', controller: 'SearchCtrl' });
        $routeProvider.when('/media/:itemId', { templateUrl: 'views/user.html', controller: 'SearchCtrl' });
        $routeProvider.when('/search/', { templateUrl: 'views/search.html', controller: 'SearchCtrl' });
        $routeProvider.when('/user/', { templateUrl: 'views/user.html', controller: 'SearchCtrl' });
        $routeProvider.when('/user/:username', { templateUrl: 'views/user.html', controller: 'SearchCtrl' });
        $routeProvider.when('/tos/', { templateUrl: 'views/tos.html'});
        $routeProvider.otherwise({ redirectTo: '/search/' });
        $sceDelegateProvider.resourceUrlWhitelist([

    'self',

    'https://scontent.cdninstagram.com/**'
  ]);
  }]).
    run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
           
            });
     
        }
        return original.apply($location, [path]);
    };
}]);


app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {

        // This scrolling function 
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});

app.factory('Instagram', ['$http',
    function($http) {
        var base = "https://api.instagram.com/v1";
        var clientId = '1ca7d98f346549fc95641d0b04307f82';
        return {
            'get': function(count, searchText) {
                    //  searchText =  encodeURIComponent(searchText);

                var request = '/tags/' + searchText + '/media/recent';
                var url = base + request;
                var config = {
                    'params': {
                        'client_id': clientId,
                        'count': count,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);
            }

        };
        
    }
]);
app.factory('Instagram2', ['$http',
    function($http) {
    
        return {

            'get': function(count, nextUrl) {
                    var url = nextUrl;
            var config = {
                    'params': {
                        'count': count,
                        'callback': 'JSON_CALLBACK'
                    }
                    
                };          
                return $http.jsonp(url, config);
            }
        }; 
        
    }

]);
app.factory('Instagram3', ['$http',
    function($http) {
    
        return {
            'get': function(count, userId) {
                var base = "https://api.instagram.com/v1";
        
                var clientId = '1ca7d98f346549fc95641d0b04307f82';
                var userRequest = '/users/' + userId + '/media/recent'
                var url = base + userRequest;           
                var config = {
                    'params': {
                        'client_id': clientId,
                        'count': count,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);
            }
        };
    }
]);
app.factory('instaLink', ['$http',
    function($http) {
    
        return {
            'get': function(shortLink) {
                var base = "https://api.instagram.com/oembed?url=http://instagram.com/p/";
        
                var clientId = '1ca7d98f346549fc95641d0b04307f82';
                var mediaRequest = shortLink
                var url = base + mediaRequest;

                var config = {
                    'params': {
                        'client_id': clientId,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);

            }
        };
    }
]);
app.factory('instaMedia', ['$http',
    function($http) {
    
        return {
            'get': function(picId) {
                var base = "https://api.instagram.com/v1";
        
                var clientId = '1ca7d98f346549fc95641d0b04307f82';
                var mediaRequest = '/media/' + picId
                var url = base + mediaRequest;

                var config = {
                    'params': {
                        'client_id': clientId,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);

            }
        };
    }
]);
app.factory('tagorila_user', ['$http',
    function($http) {
    
        return {
            'get': function(userId) {
                var base = "https://api.instagram.com/v1";
        
                var clientId = '1ca7d98f346549fc95641d0b04307f82';
                var userRequest = '/users/' + userId;
                var url = base + userRequest;           
                var config = {
                    'params': {
                        'client_id': clientId,
                        'callback': 'JSON_CALLBACK'
                    }
                };
                return $http.jsonp(url, config);
            }
        };
    }
]);
'use strict';