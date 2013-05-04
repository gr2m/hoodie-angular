'use strict';

describe('Controller: MainCtrl', function () {

  var hoodieMock;

  // load the controller's module
  beforeEach(module('hoodieApp'));

  beforeEach(inject(['$controller', '$rootScope', 'hoodie', function($controller, $rootScope, hoodie){

    hoodieMock = hoodie;
    spyOn(hoodieMock, 'unbind');
    spyOn(hoodieMock.store, 'on');
    spyOn(hoodieMock.store, 'findAll').andCallThrough();

    $controller('MainCtrl', { $scope: $rootScope.$new(), hoodie: hoodieMock });

  }]));

  it('should unbind store.add:todo', function () {
    expect(hoodieMock.unbind).toHaveBeenCalled();
  });

  it('should bind add and clear', function () {
    expect(hoodieMock.store.on).toHaveBeenCalledWith('add:todo', jasmine.any(Function));
    expect(hoodieMock.store.on).toHaveBeenCalledWith('clear', jasmine.any(Function));
  });

  it('should findAll todos', function () {
    expect(hoodieMock.store.findAll).toHaveBeenCalled();
  });
});
