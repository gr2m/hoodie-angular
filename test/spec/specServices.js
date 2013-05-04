'use strict';

describe('3rd party dependencies', function () {

	// load the module
	beforeEach(module('hoodieApp'));

	var hoodie

	beforeEach(inject(['hoodie', function(hoodieDep){
		hoodie = hoodieDep;
	}]));

	describe('Hoodie', function () {
		it('should return an instance of hoodie toolkit', function(){
			expect(hoodie).not.toBeUndefined();
		});
	});

});

