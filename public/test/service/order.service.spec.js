describe('The order service', function(){
	'use strict';

	var $httpBackend;
	var orderService;
	var basePath;

	var testData = {
		userInfo: {
			info: {
				_id: "5",
			    admin: false,
			    createdAt: "2017-01-29T01:37:38.467Z",
			    hash: "77c",
			    salt: "1e1",
			    updatedAt: "2017-01-29T01:37:38.467Z",
			    username: "mock"
			},
			token: 'mockToekn'
		},
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

	beforeEach(function(){
		module('menuApp');

		inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			orderService = $injector.get('OrderService');
			basePath = $injector.get('basePath');
		});
	});

	it('should retrieve previous orders of a user by the user\'s user id and token.', function(){
		var userInfo = testData.userInfo;
		$httpBackend.expectGET(`${basePath}/orders/${userInfo.info._id}`).respond(testData.orderData);
		orderService.getUserOrders(userInfo).then(function(response){
			expect(response).toEqual(testData.orderData);
		});
		$httpBackend.flush();
	});
	it('should allow administrator to retrieve the information of all orders.', function(){
		var userInfo = testData.userInfo;
		$httpBackend.expectGET(`${basePath}/orders/`).respond(testData.orderData);
		orderService.getAllOrders(userInfo).then(function(response){
			expect(response).toEqual(testData.orderData);
		});
		$httpBackend.flush();
	});
	it('should allow administrator to retrieve the information of the incoming orders.', function(){
		var userInfo = testData.userInfo;
		$httpBackend.expectGET(`${basePath}/orders/incoming`).respond(testData.orderData);
		orderService.getIncomingOrders(userInfo).then(function(response){
			expect(response).toEqual(testData.orderData);
		});
		$httpBackend.flush();
	});
	it('should allow administrator to update the status of a specific order.', function(){
		var userInfo = testData.userInfo;
		var orderId = 'order001';
		var orderInfo = testData.orderData;
		$httpBackend.expectPUT(`${basePath}/orders/${orderInfo.placedBy}/${orderId}`).respond(testData.orderData);
		orderService.updateOrder(orderInfo, userInfo.token).then(function(response){
			expect(response.data).toEqual(testData.orderData);
		});
		$httpBackend.flush();
	});
});