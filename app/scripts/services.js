'use strict';

angular.module('hoodieApp')
	.value('localStorage', localStorage)
  .factory('hoodie', function () {
    return new Hoodie();
  });
