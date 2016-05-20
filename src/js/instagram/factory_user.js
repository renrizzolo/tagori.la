app.factory('tagorila_user', ['$http',
	function($http) {
	
		return {
			'get': function(count, userId) {
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