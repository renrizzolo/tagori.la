'use strict';


app.controller('SearchCtrl', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$anchorScroll', 'Instagram', 'Instagram2', 'Instagram3', 'instaMedia', 'instaLink', 'ngDialog', 'anchorSmoothScroll', '$window', '$mdDialog', 'VideosService','youtubeRelated'

	function($scope, $rootScope, $route, $routeParams, $location, $anchorScroll, Instagram, Instagram2, Instagram3, instaMedia, instaLink, ngDialog, anchorSmoothScroll, $window, $mdDialog, VideosService,youtubeRelated) {
	  $rootScope.what = [];
	  $rootScope.video = [];
	  $rootScope.video.id = []
	  $rootScope.modal = [];
	  $rootScope.modal.yo = [];
	  $scope.location = $location;

      $scope.youtube = VideosService.getYoutube();

	  //modal hashtag links
	  $rootScope.tagLink = function(tag){
	  	 window.open("/search/" + tag +"", "_self");	
	  };
	  //close modal on swipe
 	$rootScope.swipe = function(){
	 	ngDialog.close();
	 };

	//setTimeout(function(){ $rootScope.$broadcast('masonry.reload'); }, 1000);

//endswith polyfill
	if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
	//magic media url on modal open
 $rootScope.modalOpen = function (itemUrl) {
 
	$scope.what.iUrl = itemUrl;
	var shortPath = $scope.what.iUrl.split('/');
 	$scope.what.instaUrl = shortPath[4];

	$location.path('/media/' + $scope.what.instaUrl, false);
	};
	// Modal //
	 $rootScope.openPlain = function(item, media) {
console.log(item);

	 //	item.images.standard_resolution.url, item.link, item.caption.text, item.user.username, item.created_time, item.videos.standard_resolution.url, item.likes.count, item.tags, item.user.id
 		$scope.what.lin = item.id.videoId;	
 		$scope.what.cap = item.snippet.description;	
 		$scope.what.usern = item.snippet.channelName; 
 		$scope.what.daty = item.publishedAt;
 		$scope.what.uId = item.snippet.channelId;
 		$scope.what.mediaId = media;
 		$scope.video.id = item.id;

		var dialog = ngDialog.open({
		    template: 'modalTemplate.html',
		    className: 'ngdialog-theme-plain',
		    scope: $scope
		});

		       //   document.getElementById('player').appendChild(document.getElementById('player'));



				// 		$rootScope.theme = 'ngdialog-theme-plain';
				// var dialog = ngDialog.open({

				// 	template: 	
			
				// 	'<div class="ngdialog-message col-md-8 col-md-push-2" md-swipe-left="swipe()"  md-swipe-right="swipe()">'+
            				
                                       		
			 //                    '<div class="panel-body row">'+  
				// 					'<div id="placeholder"></div>'+
                            	
				//                     '<div class="modal-text col-md-4">'+                
    //         								'<h1><a ng-href="http://tagori.la/user/{{what.uId}}">{{what.usern}}</a></h1>'+

				//                              '<div class="pull-right modal-likes"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span> {{what.likes}}</div>'+
				//                              	'<div class="date">{{what.daty | date:"mediumDate"}}<br>'+
				//                              	'<small>{{what.daty*1000 | date:"shortTime"}}</small></div>'+
				//                               	'<p class="modal-close">*swipe to close</p>'+

				//                             	'<p>{{what.cap}}</p>'+
				//                             	'<p><strong>Tags:</strong></p>'+
				//                             	'<div class="tag-container"><md-button ng-click="tagLink(tag)" ng-repeat="tag in what.tags" class="tags md-raised md-primary"> #{{tag}} </md-button></div>'+
				                            
				                        	
				// 					'</div>'+
			 //        			'</div>',
					
				// 	className: 'ngdialog-theme-plain',
				// 	plain: true
					
				// });
dialog.closePromise.then(function (data) {
    if ($route.current.scope.view === "search"){
    $location.path('/'+ $route.current.scope.view + '/' + $route.current.params.searchText, false);
    }
     if ($route.current.scope.view === "user") {
    $location.path('/'+ $route.current.scope.view + '/' + $route.current.params.username, false);
}

});
			};
$scope.search = [];
$scope.search.results = 24;

$scope.search.date = [];


$scope.dateParse = function(difference){
	var date = new Date(new Date().setDate(new Date().getDate() - difference));
	var dateISO = date.toISOString();
	return dateISO;
};


// var year = new Date(new Date().setDate(new Date().getDate() - 365));
// var yearISO = year.toISOString();
// $scope.search.year = yearISO;

// var threeMonth = new Date(new Date().setDate(new Date().getDate() - 90));
// var threeMonthISO = threeMonth.toISOString();
// $scope.search.threeMonth = threeMonthISO;

// var month = new Date(new Date().setDate(new Date().getDate() - 30));
// var monthISO = month.toISOString();
// $scope.search.month = monthISO;

// var week = new Date(new Date().setDate(new Date().getDate() - 7));
// var weekISO = week.toISOString();
// $scope.search.sevenDays = weekISO;

// var day = new Date(new Date().setDate(new Date().getDate() - 1));
// var dayISO = day.toISOString();
// $scope.search.day = dayISO;
// use search query in url for instagram.get //

$scope.$watch('$routeChangeStart', function(){
		
			var pathParts = $location.path().split('/');
 	        $scope.search.term = pathParts[2];
 	        $scope.view = pathParts[1];
 	        if (pathParts[3] == null){
 	        $scope.search.order = 'relevance';
			}else {
 	        $scope.search.order = pathParts[3];
 	    	}
 	    	if (pathParts[4] == null){
 	        $scope.search.dateAfter = 'any';
			} else {
 	        $scope.search.dateAfter = pathParts[4];
 	    	}
 	        $rootScope.items=null;
 	        $rootScope.pagination=null;

	//  if ($scope.view === "media" && $scope.search.term.length > 9){

	// instaLink.get($scope.search.term).success(function(response) {

				
	
	// 		$scope.shortLink = response.media_id;


	// 		instaMedia.get($scope.shortLink).success(function(response2) {
	// 			if (response2.meta.code !== 200) {

	// 			$scope.error = response2.meta.error_type + ' | ' + response2.meta.error_message;

	// 		return;

	// 		} else{ 
	
	// 		$scope.medias = response2.data;
	// 		$scope.medias.img = response2.data.images;

	// 		}

	// 		Instagram3.get(1,  $scope.medias.user.id).success(function(response) {
	// 		instagramSuccess($rootScope, response);
	// 	});
	// 	document.title = $scope.medias.user.username + "'s media | TAGORI.LA";
	// 		// if ($scope.medias.videos){
	// 			$rootScope.openPlain($scope.medias, $scope.medias.id);
	// 			// } else{
	// 			// $rootScope.openPlain($scope.medias.img.standard_resolution.url, $scope.medias.link, $scope.medias.caption.text, $scope.medias.user.username, $scope.medias.created_time, [], $scope.medias.likes.count, $scope.medias.tags, $scope.medias.user.id, $scope.medias.id);

	// 			// }

	// 		});

	// 			});

			

	// 	 }

		$scope.youtueRelated = function(){
		youtubeRelated.get(8,  $scope.youtube.videoId, $scope.pagination)
  			.success(function(response) {
				instagramSuccess($scope.related, response);
			});
		};

  switch($scope.search.dateAfter){
        case 'any': $scope.search.dateAfter = '1970-05-31T03:51:07.968Z';
        break;
        case 'day': $scope.search.dateAfter = $scope.dateParse(1);
        break;
        case 'week': $scope.search.dateAfter = $scope.dateParse(7);
        break;
        case 'month': $scope.search.dateAfter = $scope.dateParse(30);
        break;
        case 'threemonths': $scope.search.dateAfter = $scope.dateParse(90);
        break;
        case 'year': $scope.search.dateAfter = $scope.dateParse(365);
     }
	//search
	  if    ($scope.view === "search" && $scope.search.term.length > 1) {
	  		Instagram.get($scope.search.results,  $scope.search.term, $scope.search.order, $scope.search.dateAfter).success(function(response) {
			instagramSuccess($rootScope, response);
			
			document.title = "#" + $scope.search.term + " | TAGORI.LA";
			

			});
	  		
   	}
   	//default view
   	  if    ($scope.view === "search" && $scope.search.term.length < 1) {
	  		$scope.items=null;
	  		$scope.error = null;
			document.title = "TAGORI.LA | Instagram viewer";
			
	  	}

	//user page
	  if    ($scope.view === "user" && $scope.search.term.length > 1) {
	  		Instagram3.get($scope.search.results,  $scope.search.term).success(function(response) {
			instagramSuccess($rootScope, response);
			$scope.gotoElement('hashtext');

			document.title = $scope.items[0].user.username+"'s feed' | TAGORI.LA";
			});
   	} 
   	// default (/user)
   	  if    ($scope.view === "user" && $scope.search.term.length < 1) {
	  		$scope.items=null;
	  		$scope.error = null;
			document.title = "TAGORI.LA | Instagram viewer";
   	} else {
   		   document.title = "TAGORI.LA | Instagram viewer";
   	}

 });


// close modal on browser back //

  	$rootScope.$on('$routeChangeStart', function(e, absNewUrl, absOldUrl){

  	if ($rootScope.modal.yo==="yarr"){
		ngDialog.close();


}  else {

	return true;
}
	  });


  	  	 	$rootScope.$on('ngDialog.opened', function (e, $dialog) {
  	  	 		$rootScope.modal.yo = "yarr";
  	  	 	});

  	  	 		$rootScope.$on('ngDialog.closing', function (e, $dialog) {
  	  	 		$rootScope.modal.yo = [];
  	  	 			

  	  	 	});
  	  	 	

// load more //
 $scope.gotoVid = function(){
 anchorSmoothScroll.scrollTo($scope.youtube['playerId']);
}

		$scope.loading = false;
		$scope.itemsDisplayedInList = 24;
	  $scope.loadMore = function() {

	  	 if (!$scope.loading) {
				$scope.noMore = false;
				$scope.loading = true;
				Instagram.get($scope.search.results, $scope.search.term, $scope.search.order, $scope.search.dateAfter, $scope.pagination)
				.success(function(response) {
			if (response.error) {
				$scope.error = response.error.code + ' | ' + response.error.message;
				return;
			}
			if (response.items.length > 0) {
				$scope.pagination = response.nextPageToken;
				$scope.items = response.items.concat($scope.items);
								$scope.loading = false;

				if($scope.itemsDisplayedInList <= $scope.items.length){
         		$scope.itemsDisplayedInList = $scope.itemsDisplayedInList + 24;
         		$scope.loading = false;

      }

			if (response.items.length < 1) {

				$scope.error = "no more results";
			}
			} else {
				$scope.error = "no results";
				
			}
				}).
			error(function(response) {
				
				$scope.noMore = true;
			});

	      }	
	       
  	  };

//launch video function
 	$scope.launch = function (id, title) {
    	VideosService.launchPlayer(id, title);
    };
 	$scope.stopVideo = function () {
   		VideosService.stop();

    };
 	$scope.playVideo = function () {
		VideosService.play();

    };

     $scope.pauseVideo = function () {
    VideosService.pause();
    };

     $scope.expandVid = function (eID){
     	VideosService.expandVid(eID);
	}

 // scrollto element //

 $scope.gotoElement = function (eID){
      anchorSmoothScroll.scrollTo(eID);

    };

	

// get the stuff // 

		var instagramSuccess = function(scope, res) {
				console.log(res);
			if (res.error) {
				scope.error;
				
				$scope.$watch('scope.error', function(ev) { 
 				$mdDialog.show(
      			$mdDialog.alert()
        
			        .title('Error')
			        .content(res.error.code + ' | ' + res.error.message)
			        .ariaLabel('Error')
			        .ok('Ok')
			        .targetEvent(ev)
			        );
	      
				 });
			scope.error='';
			return;
							
			}

			if (res.items.length > 0) {
				scope.error = '';
				scope.items = res.items;

				if (res.nextPageToken) {
				scope.error = '';
				scope.items = res.items;
				scope.pagination = res.nextPageToken;
			
				
				}
			}  
				
		 else {
				scope.error;
				
				$scope.$watch('scope.error', function(ev) { 
		 		$mdDialog.show(
		      	$mdDialog.alert()
		        
		        .title('Error')
		        .content("This hashtag has returned no results")
		        .ariaLabel('Error')
		        .ok('Ok')
		        .targetEvent(ev)
		        );
		      
		 });
			}
		};
	
			var instagramMedia = function(scope, res) {

			if (res.meta.code !== 200) {
				scope.errors;
				
				$scope.$watch('scope.errors', function(ev) { 
 				$mdDialog.show(
      			$mdDialog.alert()
        
			        .title('Error')
			        .content(res.meta.error_type + ' | ' + res.meta.error_message)
			        .ariaLabel('Error')
			        .ok('Ok')
			        .targetEvent(ev)
			        );
	      
				 });
			scope.errors='';
			return;
							
			}

			if (res.data.length > 0) {
				scope.errors = '';
				scope.medias = res.data;
					
			}  
				
		 else {
				scope.errors;
				
				$scope.$watch('scope.errors', function(ev) { 
		 		$mdDialog.show(
		      	$mdDialog.alert()
		        
		        .title('Error')
		        .content("This media has returned no results")
		        .ariaLabel('Error')
		        .ok('Ok')
		        .targetEvent(ev)
		        );
		      
		 });
			}
		};
	}
]);