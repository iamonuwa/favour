describe('The menuItemsController', function() {
    'use strict';

    var menuItemsController;
    var basePath;
    var $stateParams;
    var $rootScope;
    var mockService = {};
    var menuItems = [{
        "id": 853,
        "short_name": "L4",
        "name": "Kung Pao Chicken",
        "description": "beef sauteed with carrots and celery, in a spicy Szechuan sauce",
        "price_small": null,
        "price_large": 9.75,
        "small_portion_name": null,
        "large_portion_name": null,
        "image_present": true
    }];
    var categoryInfo = {
        "short_name": "L",
        "name": "Lunch",
        "special_instructions": "Sunday-Friday 11:15am-3:00pm. Served with your choice of rice (Vegetable Fried RIce, Steamed Rice, Brown Rice), AND EITHER soup (Hot & Sour, Wonton, Vegetable, Egg Drop, Chicken Corn Soup) OR veggie egg roll. $1.00 extra to have both soup and egg roll."
    };

    beforeEach(function() {
        module('menuApp');

        inject(function($injector, $q) {
            var $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $rootScope = $injector.get('$rootScope');
            basePath = $injector.get('basePath');
            
            mockService.getCategoryItems = function(categoryId) {
                var deferred = $q.defer();
                deferred.resolve(menuItems);
                return deferred.promise;
            };
            mockService.getCategoryInfo = function(categoryId) {
                return categoryInfo;
            };
            
            // instantiate controller
            menuItemsController = $controller('menuItemsController', {
                MenuService: mockService,
                $stateParams: $stateParams,
                basePath: basePath,
                $rootScope: $rootScope
            });
        });
    });

    it('should initialize with category information and loading status.', function() {
        expect(menuItemsController).toBeDefined();
        expect(menuItemsController.category).toEqual($stateParams);
        expect(menuItemsController.loading).toBe(true);
    });
    it('should retrieve the menu items of the given category.', function() {
        mockService.getCategoryItems('L').then(function(response) {
            expect(menuItemsController.menuItems).toEqual(menuItems);
        	expect(menuItemsController.loading).toBe(false);
        });
        $rootScope.$digest();
    });
    it('should retrieve information of the given category.', function(){
    	mockService.getCategoryItems('L').then(function(response) {
            expect(mockService.getCategoryInfo('L')).toEqual(categoryInfo);
        });
        $rootScope.$digest();
    })
});
