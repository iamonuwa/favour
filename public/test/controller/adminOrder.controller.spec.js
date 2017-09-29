describe('The adminOrderController', function(){
	'use strict';

	var adminOrderController;
	var $rootScope;
	var mockOrderService = {};
	var mockUserService = {};
	var testData = {
		userInfo: {
			token: 'mockToken',
	        user: {
	            _id: "5",
	            admin: false,
	            createdAt: "2017-01-29T01:37:38.467Z",
	            hash: "77c",
	            salt: "1e1",
	            updatedAt: "2017-01-29T01:37:38.467Z",
	            username: "mock"
	        }
		},
		incomingOrders: [{
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
		}],
		orderServed: [{
		    _id: "order001",
		    contents: [
            	{"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
            	{"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95}
            ],
		    createdAt: "2017-02-14T01:38:15.990Z",
		    placedBy: "user001",
		    status: "served",
		    total: 37.9,
		    updatedAt: "2017-02-14T01:38:15.990Z"
		}]
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');

			mockUserService.getUserInfo = function(){
				return testData.userInfo;
			};

			mockOrderService.getIncomingOrders = function(userInfo){
				var deferred = $q.defer();
				deferred.resolve(testData.incomingOrders);
				return deferred.promise;
			};

			mockOrderService.updateOrder = function(orderInfo, token){
				var deferred = $q.defer();
				deferred.resolve(testData.orderServed);
				return deferred.promise;
			};

			adminOrderController = $controller('adminOrderController', {
				OrderService: mockOrderService,
				UserService: mockUserService,
				$rootScope: $rootScope
			});
		});

		spyOn(mockOrderService, 'updateOrder').and.callThrough();
	});

	it('should initalize with user information.', function(){
		expect(adminOrderController.loginUserInfo).toEqual(testData.userInfo);
	});
	it('should retrieve the list of incoming orders.', function(){
		mockOrderService.getIncomingOrders(testData.useInfo).then(function(response){
			expect(adminOrderController.orders).toEqual(testData.incomingOrders);
		});
		$rootScope.$digest();
	});
	it('should update order status to order served.', function(){
		adminOrderController.orderServed(testData.orderServed);
		expect(mockOrderService.updateOrder).toHaveBeenCalled();
	});
});