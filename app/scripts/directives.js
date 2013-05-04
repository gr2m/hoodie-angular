'use strict';

angular.module('hoodieApp')
	.directive('login', [function(){
		return {
			replace: true,
			restrict: 'CA',
			templateUrl: 'views/login.html',
			scope: {
				'onLogin':'&'
			},
			link: function() {
			}
		};
	}]);