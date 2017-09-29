describe('The adminMenuItemController', function(){
	'use strict';

	var adminMenuItemController;
	var $rootScope;
	var mockMenuService = {};
	var testData = {
		menuItems: [
	        {"_id":61,"category_id":"A","short_name":"A5","name":"Egg Drop with Won Ton Soup","description":"chicken soup with egg drop and won tons","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart","updatedAt":"2017-02-01T16:13:05.817Z"},
	        {"_id":62,"category_id":"A","short_name":"A7","name":"Garden Vegetable Soup","description":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas)","price_small":2.55,"price_large":5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":63,"category_id":"A","short_name":"A2","name":"Egg Drop Soup","description":"chicken broth with egg drop","price_small":2.25,"price_large":4.5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":64,"category_id":"A","short_name":"A6","name":"Chicken Noodle (or Rice) Soup","description":"clear broth and lo mein noodles or white rice, chicken pieces","price_small":2.55,"price_large":5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":65,"category_id":"A","short_name":"A8","name":"Garden Vegetable Soup with Tofu","description":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas) with tofu pieces","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart"}
        ]
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');

			mockMenuService.getMenuItems = function(){
				var deferred = $q.defer();
				deferred.resolve(testData.menuItems);
				return deferred.promise;
			};

			mockMenuService.deleteMenuItem = function(menuItemId){
				var deferred = $q.defer();
				deferred.resolve('item deleted');
				return deferred.promise;
			};

			adminMenuItemController = $controller('adminMenuItemController', {
				MenuService: mockMenuService,
				$rootScope: $rootScope
			});
		});

		spyOn(mockMenuService, 'deleteMenuItem').and.callThrough();
	});

	it('should initialize with the list of menu items.', function(){
		mockMenuService.getMenuItems().then(function(){
			expect(adminMenuItemController.menuItems).toEqual(testData.menuItems);
		});
		$rootScope.$digest();
	});
	it('should delete a menu item.', function(){
		adminMenuItemController.deletingAnItem(testData.menuItems[0]);
		expect(mockMenuService.deleteMenuItem).toHaveBeenCalled();
	});

});