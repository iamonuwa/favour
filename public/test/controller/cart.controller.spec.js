describe('The cartController', function(){
	'use strict';

	var cartController;
    var $rootScope;
    var scope;
    var mockCartService = {};
    var testData = {
    	itemQty: 1,
    	orderData: {
		    _id: "order001",
		    contents: [
            	{"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
            	{"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95}
            ],
		    createdAt: "2017-02-14T01:38:15.990Z",
		    placedBy: "user001",
		    status: "placed",
		    total: 37.9,
		    updatedAt: "2017-02-14T01:38:15.990Z"
		}
    };

    beforeEach(function() {
        module('menuApp');

        inject(function($injector, $q) {
            var $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            scope = $rootScope.$new();
            mockCartService.getCartItems = function(){
                return 'cartItems';
            };
            mockCartService.getOrderTotal = function(){
                return 10;
            };
            mockCartService.placeOrder = function(dishData){
            	var deferred = $q.defer();
            	deferred.resolve(testData.orderData);
            	return deferred.promise;
            };
            mockCartService.addOne = function(itemIndex){
            	testData.itemQty++;
            };
            mockCartService.minusOne = function(itemIndex){
            	testData.itemQty--;
            };

            cartController = $controller('cartController', {
                CartService: mockCartService,
                $rootScope: $rootScope,
                $scope: scope
            });
        });
    });

    it('should initialize with cart items and order total.', function(){
        expect(cartController.cartItems).toEqual('cartItems');
        expect(cartController.orderTotal).toEqual(10);
    });
	it('should change the quantity of an item.',function(){
		cartController.addOne(0);
		expect(testData.itemQty).toEqual(2);
		cartController.minusOne(0);
		expect(testData.itemQty).toEqual(1);
	});
	it('should submit cart items and place an order.', function(){
        cartController.placeOrder();
        expect(cartController.response.$$state.value).toEqual(testData.orderData);
    });
});