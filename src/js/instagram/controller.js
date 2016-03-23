'use strict';


app.controller('SearchCtrl', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$anchorScroll', 'Instagram', 'Instagram2', 'Instagram3', 'instaMedia', 'instaLink', 'ngDialog', 'anchorSmoothScroll', '$window', '$mdDialog',
	function($scope, $rootScope, $route, $routeParams, $location, $anchorScroll, Instagram, Instagram2, Instagram3, instaMedia, instaLink, ngDialog, anchorSmoothScroll, $window, $mdDialog) {
	  $rootScope.what = [];
	  $rootScope.modal = [];
	  $rootScope.modal.yo = [];
	  $scope.location = $location;

	  //modal hashtag links
	  $rootScope.tagLink = function(tag){
	  	 window.open("http://tagori.la/search/" + tag +"", "_self");	
	  };
	  //close modal on swipe
 	$rootScope.swipe = function(){
	 	ngDialog.close();
	 };

	//setTimeout(function(){ $rootScope.$broadcast('masonry.reload'); }, 1000);

	
	//magic media url on modal open
 $rootScope.modalOpen = function (itemUrl) {
 
	$scope.what.iUrl = itemUrl;
	var shortPath = $scope.what.iUrl.split('/');
 	$scope.what.instaUrl = shortPath[4];

	$location.path('/media/' + $scope.what.instaUrl, false);
	};
	// Modal //
	 $rootScope.openPlain = function(item, media) {


	 //	item.images.standard_resolution.url, item.link, item.caption.text, item.user.username, item.created_time, item.videos.standard_resolution.url, item.likes.count, item.tags, item.user.id
		$scope.what.enl = (item.images ? item.images.standard_resolution.url : '' );
 		$scope.what.lin = item.link;	
 		$scope.what.cap = item.caption.text;	
 		$scope.what.usern = item.user.username; 
 		$scope.what.daty = item.created_time;
 		$scope.what.commentCount = item.comments.count;
 		$scope.what.video = (item.videos ? item.videos.standard_resolution.url : '' );
 		$scope.what.likes = item.likes.count;
 		$scope.what.tags = item.tags;
 		$scope.what.uId = item.user.id;
 		$scope.what.mediaId = media;

	//	$scope.what.cap = $scope.what.cap.replace(/([#]+[A-Za-z0-9-_]+)/g, '');
		
				$rootScope.theme = 'ngdialog-theme-plain';
				var dialog = ngDialog.open({

					template: 	
			
					'<div class="ngdialog-message col-md-8 col-md-push-2" md-swipe-left="swipe()"  md-swipe-right="swipe()">'+
            				
                                       		
			                    '<div class="panel-body row">'+  

                            	'<video class="vid col-md-8" ng-show="what.video.length>1" width="100%" height="auto" controls  src="{{what.video}}"  type="video/mp4">'+
                                           	
                                '</video>'+  
				                    '<div class="modal-pic col-md-8" ng-hide="what.video.length>1">'+                
				                       '<a ng-href="{{what.enl}}" target="_blank">'+
				                            '<img preload-image ng-src="{{what.enl}}" default-image="img/loading-bubbles.svg" src="" alt="">'+
				                            '</a>'+
				                    '</div>'+
				                    '<div class="modal-text col-md-4">'+                
            								'<h1><a ng-href="http://tagori.la/user/{{what.uId}}">{{what.usern}}</a></h1>'+

				                             '<div class="pull-right modal-likes"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span> {{what.likes}}</div>'+
				                             	'<div class="date">{{what.daty*1000 | date}} | {{what.commentCount}} comments</div>'+
				                              	'<p class="modal-close">*swipe to close</p>'+

				                            	'<p>{{what.cap}}</p>'+
				                            	'<p><strong>Tags:</strong></p>'+
				                            	'<div class="tag-container"><md-button ng-click="tagLink(tag)" ng-repeat="tag in what.tags" class="tags md-raised md-primary"> #{{tag}} </md-button></div>'+
				                            	'<md-button class="md-primary" aria-label="Open in Instagram" style="display:block;text-align:right;" ng-href="{{what.lin}}">'+
				                        'Open in Instagram <span class="glyphicon glyphicon-share-alt"></md-button>'+
				                        				                       '<a ng-href="{{what.enl}}.jpg.html" target="_blank">ASCII version</a>'+

				                        	
									'</div>'+
			        			'</div>',
					
					className: 'ngdialog-theme-plain',
					plain: true
					
				});

dialog.closePromise.then(function (data) {
    if ($route.current.scope.view === "search"){
    $location.path('/'+ $route.current.scope.view + '/' + $route.current.params.searchText, false);
    }
     if ($route.current.scope.view === "user") {
    $location.path('/'+ $route.current.scope.view + '/' + $route.current.params.username, false);
}

});
			};

		

// use search query in url for instagram.get //

$scope.$watch('$routeChangeStart', function(){
		
			var pathParts = $location.path().split('/');
 	        $scope.search = pathParts[2];
 	        $scope.view = pathParts[1];
 	        $scope.modal = pathParts[3];
 	        $rootScope.items=null;
 	        $rootScope.pagination=null;

	 if ($scope.view === "media" && $scope.search.length > 9){

	instaLink.get($scope.search).success(function(response) {

				
	
			$scope.shortLink = response.media_id;


			instaMedia.get($scope.shortLink).success(function(response2) {
				if (response2.meta.code !== 200) {

				$scope.error = response2.meta.error_type + ' | ' + response2.meta.error_message;

			return;

			} else{ 
	
			$scope.medias = response2.data;
			$scope.medias.img = response2.data.images;

			}

			Instagram3.get(6,  $scope.medias.user.id).success(function(response) {
			instagramSuccess($rootScope, response);
		});
		document.title = $scope.medias.user.username + "'s media | TAGORI.LA";
			if ($scope.medias.videos){
				$rootScope.openPlain($scope.medias.img.standard_resolution.url, $scope.medias.link, $scope.medias.caption.text, $scope.medias.user.username, $scope.medias.created_time, $scope.medias.videos.standard_resolution.url, $scope.medias.likes.count, $scope.medias.tags, $scope.medias.user.id, $scope.medias.id);
				} else{
				$rootScope.openPlain($scope.medias.img.standard_resolution.url, $scope.medias.link, $scope.medias.caption.text, $scope.medias.user.username, $scope.medias.created_time, [], $scope.medias.likes.count, $scope.medias.tags, $scope.medias.user.id, $scope.medias.id);

				}

			});

				});

			

		 }

	//search
	  if    ($scope.view === "search" && $scope.search.length > 1) {
	  		Instagram.get(24,  $scope.search).success(function(response) {
			instagramSuccess($rootScope, response);
			
			document.title = "#" + $scope.search + " | TAGORI.LA";
			

			});
	  		
   	}
   	//default view
   	  if    ($scope.view === "search" && $scope.search.length < 1) {
	  		$scope.items=null;
	  		$scope.error = null;
			document.title = "TAGORI.LA | Instagram viewer";
			
	  	}

	//user page
	  if    ($scope.view === "user" && $scope.search.length > 1) {
	  		Instagram3.get(24,  $scope.search).success(function(response) {
			instagramSuccess($rootScope, response);
			$scope.gotoElement('hashtext');

			document.title = $scope.items[0].user.username+"'s feed' | TAGORI.LA";
			});
   	} 
   	// default (/user)
   	  if    ($scope.view === "user" && $scope.search.length < 1) {
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

		$scope.loading = false;
		$scope.itemsDisplayedInList = 24;
	  $scope.loadMore = function() {

	  	 if (!$scope.loading) {
				$scope.noMore = false;
				$scope.loading = true;
				Instagram2.get(24, $scope.pagination)
				.success(function(response) {
			if (response.meta.code !== 200) {
				$scope.error = response.meta.error_type + ' | ' + response.meta.error_message;
				return;
			}
			if (response.data.length > 0) {
				$scope.pagination = response.pagination.next_url;
				$scope.items = response.data.concat($scope.items);
								$scope.loading = false;

				if($scope.itemsDisplayedInList <= $scope.items.length){
         		$scope.itemsDisplayedInList = $scope.itemsDisplayedInList + 24;
         		$scope.loading = false;

      }

			if (response.data.length < 1) {

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


 // scrollto element //

 $scope.gotoElement = function (eID){
      anchorSmoothScroll.scrollTo(eID);
      
    };

	

// get the stuff // 

		var instagramSuccess = function(scope, res) {

			if (res.meta.code !== 200) {
				scope.error;
				
				$scope.$watch('scope.error', function(ev) { 
 				$mdDialog.show(
      			$mdDialog.alert()
        
			        .title('Error')
			        .content(res.meta.error_type + ' | ' + res.meta.error_message)
			        .ariaLabel('Error')
			        .ok('Ok')
			        .targetEvent(ev)
			        );
	      
				 });
			scope.error='';
			return;
							
			}

			if (res.data.length > 0) {
				scope.error = '';
				scope.items = res.data;
					if (res.pagination) {
				scope.error = '';
				scope.items = res.data;
				scope.pagination = res.pagination.next_url;
			
				
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