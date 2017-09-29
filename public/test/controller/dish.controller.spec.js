describe('The dishController', function(){
	'use strict';

	var dishController;
    var $stateParams;
    var $rootScope;
    var mockMenuService = {};
    var mockCartService = {};
    var testData = {
    	menuItem: [{
		    _id: "5882643244347a0059fd16f0",
		    category_id: "A",
		    description: "clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas)",
		    large_portion_name: "quart",
		    name: "Garden Vegetable Soup",
		    price_large: 5,
		    price_small: 2.55,
		    short_name: "A7",
		    small_portion_name: "pint"
		}],
    	sides: {
            soup: { selected: true, price: 1 },
            salad: { selected: true, price: 1.5 },
            rice: { selected: false, price: 2 }
        }, 
        cartData: [{"dishShortName":"A7","dishName":"Garden Vegetable Soup","dishDesc":"clear chicken broth with mixed vegetables (carrots, cabbage, baby corn, mushroom, snow peas)","spicyLevel":"No Spicy","sides":{"soup":{"selected":true,"price":1},"salad":{"selected":true,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":["soup","salad"],"dishNote":"","dishPrice":7.5,"sidesNumber":2,"itemNumber":1,"totalPrice":7.5}]
    };

    beforeEach(function() {
        module('menuApp');

        inject(function($injector, $q) {
            var $controller = $injector.get('$controller');
            $stateParams = $injector.get('$stateParams');
            $rootScope = $injector.get('$rootScope');
            
            mockMenuService.getMenuItem = function(itemShortName) {
                var deferred = $q.defer();
                deferred.resolve(testData.menuItem);
                return deferred.promise;
            };

            mockCartService.addToCart = function(dishData){
            	var deferred = $q.defer();
            	deferred.resolve(testData.cartData);
            	return deferred.promise;
            };
            
            // instantiate controller
            dishController = $controller('dishController', {
                MenuService: mockMenuService,
                CartService: mockCartService,
                $stateParams: $stateParams,
                $rootScope: $rootScope
            });
        });
    });

    it('should retrieve information of the selected menu item.', function(){
    	mockMenuService.getMenuItem('A7').then(function(response){
    		expect(dishController.dishInfo).toEqual(testData.menuItem[0]);
    		expect(dishController.dishPrice).toEqual(5);
    		expect(dishController.loading).toBe(false);
    	});
    	$rootScope.$digest();
    });
    it('should add side dishes to the total price.', function(){
    	dishController.sides = testData.sides;
    	$rootScope.$digest();
    	dishController.computePrice();
		expect(dishController.dishPrice).toEqual(7.5);
		expect(dishController.sidesNumber).toEqual(2);
		expect(dishController.sidesArr).toEqual(["soup", "salad"]);
    });
    it('should submit the selected dish item to cart.', function(){
    	mockCartService.addToCart(testData.cartData[0]).then(function(response){
    		expect(response).toBe(testData.cartData);
    	});
    	$rootScope.$digest();
    });

});