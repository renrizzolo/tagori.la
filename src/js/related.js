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
            	return $http.jsonp(url, config);
            }
        };
    }
])

  			youtubeRelated.get(8,  $scope.youtube.videoId, $scope.pagination)
  			.success(function(response) {
				instagramSuccess($rootScope, response);
			});