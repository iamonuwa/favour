describe('The menu service for ordinary users', function(){
	'use strict';

	var $httpBackend;
	var menuService;
	var basePath;

	// sample data
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
        },
        menuItems: [
	        {"_id":"5882643244347a0059fd16ef","category_id":"A","short_name":"A5","name":"Egg Drop with Won Ton Soup","description":"chicken soup with egg drop and won tons","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart","updatedAt":"2017-02-01T16:13:05.817Z"},
	        {"_id":"5882643244347a0059fd16f0","category_id":"A","short_name":"A7","name":"Garden Vegetable Soup","description":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas)","price_small":2.55,"price_large":5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":"5882643244347a0059fd16f1","category_id":"A","short_name":"A2","name":"Egg Drop Soup","description":"chicken broth with egg drop","price_small":2.25,"price_large":4.5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":"5882643244347a0059fd16f2","category_id":"A","short_name":"A6","name":"Chicken Noodle (or Rice) Soup","description":"clear broth and lo mein noodles or white rice, chicken pieces","price_small":2.55,"price_large":5,"small_portion_name":"pint","large_portion_name":"quart"},
	        {"_id":"5882643244347a0059fd16f3","category_id":"A","short_name":"A8","name":"Garden Vegetable Soup with Tofu","description":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas) with tofu pieces","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart"}
        ],
        searchResult: [
        	{"_id":"5882643244347a0059fd16ef","category_id":"A","short_name":"A5","name":"Egg Drop with Won Ton Soup","description":"chicken soup with egg drop and won tons","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart","updatedAt":"2017-02-01T16:13:05.817Z"},
        	{"_id":"5882643244347a0059fd16f1","category_id":"A","short_name":"A2","name":"Egg Drop Soup","description":"chicken broth with egg drop","price_small":2.25,"price_large":4.5,"small_portion_name":"pint","large_portion_name":"quart"}
        ],
        categoryItems: [
        	{"_id":"5882643244347a0059fd1708","category_id":"SP","short_name":"SP1","name":"Chinese Scallion Pancake","description":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","price_small":null,"price_large":18.95,"small_portion_name":"","large_portion_name":"","updatedAt":"2017-02-01T18:12:59.523Z"},
        	{"_id":"5882643244347a0059fd1709","category_id":"SP","short_name":"SP2","name":"Teriyaki Chicken","description":"marinated grilled chicken breast with vegetables and lo mein on the side","price_small":null,"price_large":18.95,"small_portion_name":"","large_portion_name":""}
        ], 
        menuItem: {"_id":"5882643244347a0059fd16f3","category_id":"A","short_name":"A8","name":"Garden Vegetable Soup with Tofu","description":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas) with tofu pieces","price_small":3,"price_large":6,"small_portion_name":"pint","large_portion_name":"quart"}
	};

	beforeEach(function(){
		// load module
		module('menuApp');

		// load any dependencies
		inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			menuService = $injector.get('MenuService');
			basePath = $injector.get('basePath');
		});
	});

	it('should retrieve all categories when no category id is specified.', function(){
		$httpBackend.expectGET(basePath + '/categories').respond(testData.categories);
		menuService.getCategories(null).then(function(categories){
			expect(categories).toEqual(testData.categories);
		});
		$httpBackend.flush();
	});
	it('should retrieve category information by category short name.', function(){
		var categoryShortName = 'A';
		expect(menuService.getCategoryInfo(categoryShortName)).toEqual(testData.category_A);
	});
	it('should retrieve all menu items when no category code is specified.', function(){
		$httpBackend.expectGET(basePath + '/menu_items/').respond(testData.menuItems);
		menuService.getMenuItems(null).then(function(menuItems){
			expect(menuItems).toEqual(testData.menuItems);
		});
		$httpBackend.flush();
	});
	it('should retrieve menu items under a certain category by category id.', function(){
		var category_id = 'SP';
		$httpBackend.expectGET(basePath + '/menu_items?category_id=' + category_id).respond(testData.categoryItems);
		menuService.getCategoryItems(category_id).then(function(categoryItems){
			expect(categoryItems).toEqual(testData.categoryItems);
		});
		$httpBackend.flush();
	});
	it('should identify all menu items with the search string in their descriptions.', function(){
		var searchString = 'egg';
		$httpBackend.expectGET(basePath + '/menu_items').respond(testData.menuItems);
		menuService.searchItems(searchString).then(function(searchResult){
			expect(searchResult).toEqual(testData.searchResult);
		});
		$httpBackend.flush();
	});
	it('should retrieve the information of a menu item by the item\'s short name.', function(){
		var itemShortName = 'A8';
		$httpBackend.expectGET(basePath + '/menu_items/' + itemShortName).respond(testData.menuItem);
		menuService.getMenuItem(itemShortName).then(function(menuItem){
			expect(menuItem).toEqual(testData.menuItem);
		});
		$httpBackend.flush();
	});
});

describe('The menu service for administrator', function(){
	'use strict';

	var $httpBackend;
	var menuService;
	var userService;
	var basePath;

	var testData = {
		newCategory: {
            short_name: "MK",
            name: "Mock",
            special_instructions: ""
        },
        existingCategory: {
        	_id: '60',
            short_name: "MK",
            name: "Mock",
            special_instructions: ""
        },
        newMenuItem: {
		    "category_id": "B",
		    "short_name": "B13",
		    "name": "Fried Chicken Wing (6)",
		    "description": "6 pieces of curry-flavored chicken wings",
		    "price_small": null,
		    "price_large": 4.95,
		    "small_portion_name": "",
		    "large_portion_name": ""
		},
		existingItem: {
			"_id":"5809",
			"category_id": "B",
		    "short_name": "B13",
		    "name": "Fried Chicken Wing (6)",
		    "description": "6 pieces of curry-flavored chicken wings",
		    "price_small": null,
		    "price_large": 4.95,
		    "small_portion_name": "",
		    "large_portion_name": ""
		}

	};

	beforeEach(function(){
		module('menuApp');
		inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			menuService = $injector.get('MenuService');
			basePath = $injector.get('basePath');
		});
	});

	it('should create new category.', function(){
		$httpBackend.expectPOST(`${basePath}/categories/`, testData.newCategory)
                    .respond(testData.newCategory);
        menuService.createNewCategory(testData.newCategory).then(function(response){
        	expect(response.data).toEqual(testData.newCategory);
        });
        $httpBackend.flush();
	});
	it('should update a category\'s information, using category id.', function(){
		var category_id = '60';
		$httpBackend.expectPUT(`${basePath}/categories/${category_id}`, testData.existingCategory)
                    .respond(testData.existingCategory);
        menuService.updateCategory(testData.existingCategory).then(function(response){
        	expect(response.data).toEqual(testData.existingCategory);
        });
        $httpBackend.flush();
	});
	it('should delete a category, using category id.', function(){
		var category_id = '60';
		$httpBackend.expectDELETE(`${basePath}/categories/${category_id}`)
                    .respond(testData.existingCategory);
        menuService.deleteCategory(testData.existingCategory).then(function(response){
        	expect(response.data).toEqual(testData.existingCategory);
        });
        $httpBackend.flush();
	});
	it('should create new menu item.', function(){
		$httpBackend.expectPOST(`${basePath}/menu_items/`, testData.newMenuItem)
                    .respond(testData.newMenuItem);
        menuService.createMenuItem(testData.newMenuItem).then(function(response){
        	expect(response.data).toEqual(testData.newMenuItem);
        });
        $httpBackend.flush();
	});
	it('should update a menu item\'s information, using its id.', function(){
		var menuItemId = '5809';
		$httpBackend.expectPUT(`${basePath}/menu_items/${menuItemId}`, testData.existingItem)
                    .respond(testData.existingItem);
        menuService.updateMenuItem(testData.existingItem).then(function(response){
        	expect(response.data).toEqual(testData.existingItem);
        });
        $httpBackend.flush();
	});
	it('should delete a menu item, using menu item id.', function(){
		var menuItemId = '5809';
		$httpBackend.expectDELETE(`${basePath}/menu_items/${menuItemId}`)
                    .respond(testData.existingItem);
        menuService.deleteMenuItem(testData.existingItem._id).then(function(response){
        	expect(response.data).toEqual(testData.existingItem);
        });
        $httpBackend.flush();
	});

});