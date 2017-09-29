describe('The adminUpdateCategoryController', function(){
	'use strict';

	var adminUpdateCategoryController;
	var $stateParams;
	var mockMenuService = {};
	var testData = {
		category_A: {
            id: 62,
            short_name: "A",
            name: "Soup",
            special_instructions: ""
        },
        updated_A: {
        	id: 62,
            short_name: "A",
            name: "Soup(updated)",
            special_instructions: "some more instructions"
        },
        newCategory: {
        	id: 63,
            short_name: "AB",
            name: "New Category",
            special_instructions: ""
        }
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$stateParams = $injector.get('$stateParams');
			$stateParams.categoryShortName = 'A';

			mockMenuService.getCategoryInfo = function(){
				return testData.category_A;
			};

			mockMenuService.createNewCategory = function(categoryInfo){
				var deferred = $q.defer();
				deferred.resolve(categoryInfo);
				return deferred.promise;
			};

			mockMenuService.updateCategory = function(categoryInfo){
				var deferred = $q.defer();
				deferred.resolve(categoryInfo);
				return deferred.promise;
			};

			adminUpdateCategoryController = $controller('adminUpdateCategoryController', {
				MenuService: mockMenuService,
				$stateParams: $stateParams
			});
		});

		spyOn(mockMenuService, 'updateCategory').and.callThrough();
		spyOn(mockMenuService, 'createNewCategory').and.callThrough();
	});

	it('should initialize category information while updating the category.', function(){
		expect(adminUpdateCategoryController.categoryInfo).toEqual(testData.category_A);
	});
	it('should update category information.', function(){
		adminUpdateCategoryController.categoryInfo = testData.update_A;
		adminUpdateCategoryController.createNew = false;
		adminUpdateCategoryController.updateCategory();
		expect(mockMenuService.updateCategory).toHaveBeenCalled();
	});
	it('should create new category.', function(){
		adminUpdateCategoryController.categoryInfo = testData.newCategory;
		adminUpdateCategoryController.createNew = true;
		adminUpdateCategoryController.updateCategory();
		expect(mockMenuService.createNewCategory).toHaveBeenCalled();
	});


});