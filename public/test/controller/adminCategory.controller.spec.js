describe('The adminCategoryController', function(){
	'use strict';

	var adminCategoryController;
	var $rootScope;
	var mockMenuService = {};
	var testData = {
		categories: [
	    	{
	            id: 61,
	            short_name: "L",
	            name: "Lunch",
	            special_instructions: "Sunday-Friday 11:15am-3:00pm. Served with your choice of rice (Vegetable Fried RIce, Steamed Rice, Brown Rice), AND EITHER soup (Hot & Sour, Wonton, Vegetable, Egg Drop, Chicken Corn Soup) OR veggie egg roll. $1.00 extra to have both soup and egg roll."
	        }, 
	        {
	            id: 62,
	            short_name: "A",
	            name: "Soup",
	            special_instructions: ""
	        }, 
	        {
	            id: 63,
	            short_name: "B",
	            name: "Appetizers",
	            special_instructions: ""
	        }
	    ],
	    category_A: {
            id: 62,
            short_name: "A",
            name: "Soup",
            special_instructions: ""
        }
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');

			mockMenuService.getCategories = function(){
				var deferred = $q.defer();
				deferred.resolve(testData.categories);
				return deferred.promise;
			};

			mockMenuService.deleteCategory = function(categoryInfo){
				var deferred = $q.defer();
				for(var i=0, j=testData.categories.length; i<j; i++){
					if(testData.categories[i].id === categoryInfo.id){
						testData.categories.splice(i, 1);
						break;
					}
				}
				deferred.resolve(testData.categories);
				return deferred.promise;
			};

			adminCategoryController = $controller('adminCategoryController', {
				MenuService: mockMenuService,
				$rootScope: $rootScope
			});
		});
	});

	it('should retrieve the list of all categories.', function(){
		mockMenuService.getCategories().then(function(){
			expect(adminCategoryController.categories).toEqual(testData.categories);
		});
		$rootScope.$digest();
	});
	it('should delete a category.', function(){
		mockMenuService.deleteCategory(testData.category_A).then(function(response){
			expect(response).toEqual(testData.categories);
		});
		$rootScope.$digest();
	});
});