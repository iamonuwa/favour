describe('The adminUpdateMenuItemController', function(){
	'use strict';

	var adminUpdateMenuItemController;
	var $stateParams;
	var $rootScope
	var mockMenuService = {};
	var testData = {
		menuItem:
	        [{"_id":61,"category_id":"A","short_name":"A5","name":"Egg Drop with Won Ton Soup","description":"chicken soup with egg drop and won tons","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart","updatedAt":"2017-02-01T16:13:05.817Z"}]
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');
			$stateParams = $injector.get('$stateParams');
			$stateParams.menuItemShortName = 'A5';

			mockMenuService.getMenuItem = function(menuItemShortName){
				var deferred = $q.defer();
				deferred.resolve(testData.menuItem);
				return deferred.promise;
			};

			mockMenuService.createMenuItem = function(menuItemInfo){
				var deferred = $q.defer();
				deferred.resolve(menuItemInfo);
				return deferred.promise;
			};

			mockMenuService.updateMenuItem = function(menuItemInfo){
				var deferred = $q.defer();
				deferred.resolve(menuItemInfo);
				return deferred.promise;
			};

			adminUpdateMenuItemController = $controller('adminUpdateMenuItemController', {
				MenuService: mockMenuService,
				$rootScope: $rootScope,
				$stateParams: $stateParams
			});
		});

		spyOn(mockMenuService, 'updateMenuItem').and.callThrough();
		spyOn(mockMenuService, 'createMenuItem').and.callThrough();
	});

	it('should initialize the item\'s information while updating it.', function(){
		mockMenuService.getMenuItem($stateParams.menuItemShortName).then(function(response){
			expect(adminUpdateMenuItemController.menuItemInfo).toEqual(testData.menuItem[0]);
		});
		$rootScope.$digest();
	});
	it('should update menu item information.', function(){
		adminUpdateMenuItemController.menuItemInfo = testData.menuItem[0];
		adminUpdateMenuItemController.createNew = false;
		adminUpdateMenuItemController.updateMenuItem();
		expect(mockMenuService.updateMenuItem).toHaveBeenCalled();
	});
	it('should create new menu item.', function(){
		adminUpdateMenuItemController.menuItemInfo = testData.menuItem[0];
		adminUpdateMenuItemController.createNew = true;
		adminUpdateMenuItemController.updateMenuItem();
		expect(mockMenuService.createMenuItem).toHaveBeenCalled();
	});


});