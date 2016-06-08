'use strict';

var app = angular.module('app', ['ngAnimate', 'ngDialog', 'ngRoute', 'angular-preload-image', 'ngMaterial', 'angular-whenScrolled', 'masonry']).
	config(['$locationProvider', '$routeProvider', '$sceDelegateProvider', '$httpProvider', function($locationProvider, $routeProvider, $sceDelegateProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/search/:searchText/:order', { templateUrl: 'views/search.html', controller: 'SearchCtrl' });
        $routeProvider.when('/search/:searchText/:order/:dateAfter', { templateUrl: 'views/search.html', controller: 'SearchCtrl' });
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
   delete $httpProvider.defaults.headers.common['X-Requested-With'];

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
app.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '100%',
    playerWidth: '100%',
    state: 'stopped',
    playClass: false
  };

    $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
  //  service.bindPlayer('player-'+ $rootScope.what.lin);
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    youtube.player.loadVideoById(youtube.videoId);
    service.expandVid(youtube.playerId);
   // youtube.videoId = $rootScope.video.id;

  }

  function onYoutubeStateChange (event) {
    if (event.data == YT.PlayerState.PLAYING) {
        youtube.state = 'playing';
        console.log(youtube.state)
        youtube.playClass = true;

    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
              youtube.playClass = false;

              console.log(youtube.state)

    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
              youtube.playClass = false;

              console.log(youtube.state)

    } else if (event.data == YT.PlayerState.CUED) {
      youtube.state = 'cued';
              youtube.playClass = false;

              console.log(youtube.state)

    }
    $rootScope.$apply();
  }
  this.bindPlayer = function (elementId) {
    if (youtube.ready){
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
    } else {
        $log.error('ughh the youtube Iframe API isn\'t ready');
    }
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

    this.stop = function(){
        youtube.player.stopVideo();
    }

    this.play = function(){
        if(youtube.state == 'paused') {
        youtube.player.playVideo();
        }
        else if(youtube.state == 'playing') {
        youtube.player.pauseVideo();
        } 
        else if(youtube.state == 'cued') {
        youtube.player.playVideo();
        }
    }
    
    this.pause = function(){
        youtube.player.pauseVideo();
    }

    this.expandVid = function(eID){
        var vid = document.getElementById(eID).parentNode.parentNode;
        var oldSize = vid.getBoundingClientRect();
        var oldHeight = oldSize.height;
        var oldWidth = oldSize.width;

        var newWidth = (oldWidth * 2);

        var oldVid = document.getElementsByClassName('expand');
         console.log(oldVid);
                 //dont enlarge related videos coz it's broken
   var i;
        for (i = 0; i < oldVid.length; i++) {
            oldVid[i].style.width = "16.66666667%";
            oldVid[i].style.margin = "0";
        }  

     
        vid.className += " expand";
        console.log(newWidth);
        vid.style.width = 'calc('+newWidth+'px - 20px)';
        vid.style.margin = "10px";


        $rootScope.$broadcast('masonry.layout');

    }

    this.launchPlayer = function (id, title) {
        youtube.videoId = id;
        youtube.videoTitle = title;

    console.log(youtube);
    service.bindPlayer('player-'+ id);
    service.loadPlayer();

    return youtube;
    }
    this.launchRelated = function (id, title) {
        youtube.videoId = id;
        youtube.videoTitle = title;

    service.bindPlayer('player-'+ id);
    service.loadPlayer();

    return youtube;
    }

   this.getYoutube = function () {
    return youtube;
    };
}]);

app.factory('Instagram', ['$http',
    function($http) {
        var url = "https://www.googleapis.com/youtube/v3/search";
        var clientId = 'AIzaSyDyac0NDqikzIe07Nu0Y19MINwrxsDDPNw';
        return {
            'get': function(count, searchText, order, dateAfter, nextUrl) {

   
                    var config = {
                        'params': {
                            'order': order,
                            'pageToken': nextUrl,
                            'type': 'video',
                            'key': clientId,
                            'maxResults': count,
                            'q': searchText,
                            'publishedAfter': dateAfter,
                            'part': 'snippet',
                            'callback': 'JSON_CALLBACK'
                        }
                    }; 
            
                console.log(config);
                return $http.jsonp(url, config);

            }

        };
        
    }
]);

app.factory('youtubeRelated', ['$http',
    function($http) {
        var url = "https://www.googleapis.com/youtube/v3/search";
        var clientId = 'AIzaSyDyac0NDqikzIe07Nu0Y19MINwrxsDDPNw';
        return {
            'get': function(count, videoId, nextUrl) {
                        var config = {
                            'params': {
                                'pageToken': nextUrl,
                                'type': 'video',
                                'key': clientId,
                                'maxResults': count,
                                'relatedToVideoId': videoId,
                                'part': 'snippet',
                                'callback': 'JSON_CALLBACK'
                            }
                        }; 
                        console.log(config);
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
'use strict';