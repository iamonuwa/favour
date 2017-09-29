describe('The cart service', function(){
	'use strict';

	var $httpBackend;
	var cartService;
	var basePath;

	var testData = {
		cartItem1: {"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
		cartItem2: {"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
		cartItem3: {"dishShortName":"SP3","dishName":"Vegetable Tempura","dishDesc":"assorted vegetables breaded and fried, served with lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":true,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":["salad"],"dishNote":"","dishPrice":17.45,"sidesNumber":1,"itemNumber":1,"totalPrice":17.45},
		cartItem1Incre: {"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":2,"totalPrice":37.90},
		orderData: {
            contents: [
            	{"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
            	{"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95}
            ],
            total: 37.90,
            placedBy: 'mockid001'
        }
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			cartService = $injector.get('CartService');
			basePath = $injector.get('basePath');
		});

		cartService.addToCart(testData.cartItem1);
		cartService.addToCart(testData.cartItem2);
	});

	it('should add new item into cart.', function(){
		expect(cartService.addToCart(testData.cartItem3)).toEqual([testData.cartItem1, testData.cartItem2, testData.cartItem3]);
	});
	it('should retrieve the number of items in the shopping cart.', function(){
		expect(cartService.numInCart()).toEqual(2);
	});
	it('should retrieve all the items in the cart.', function(){
		expect(cartService.getCartItems()).toEqual([testData.cartItem1, testData.cartItem2]);
	});
	it('should calculate the total price of all items in the cart.', function(){
		expect(cartService.getOrderTotal()).toEqual(37.90);
	});
	it('should increase the quantity of a specific item, giving its index number.', function(){
		cartService.addOne(0);
		expect(cartService.getCartItems()).toEqual([testData.cartItem1Incre, testData.cartItem2]);
	});
	it('should decrease the quantity of a specific item, giving its index number.', function(){
		cartService.minusOne(0);
		expect(cartService.getCartItems()).toEqual([testData.cartItem1, testData.cartItem2]);
	});
	it('should delete a specific item, giving its index number', function(){
		cartService.deleteDish(0);
		expect(cartService.getCartItems()).toEqual([testData.cartItem2]);
	});
	it('should submit cart items and create an order.', function(){
        var userInfo = {info: {_id: 'mockid001'}, token: 'mockToken'}
		$httpBackend.expectPOST(`${basePath}/orders/${userInfo.info._id}`).respond(testData.orderData);
		cartService.placeOrder(userInfo).then(function(response){
			expect(response.data).toEqual(testData.orderData);
		});
		$httpBackend.flush();
	});
});