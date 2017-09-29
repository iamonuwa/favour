describe('The orderController', function(){
	'use strict';

	var orderController;
	var basePath;
	var $rootScope;
	var mockUserService = {};
	var mockOrderService = {};
	var testData = {
		userInfo: {
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
		userOrders: [{
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
		}]
	}

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');
			basePath = $injector.get('basePath');

			mockUserService.getUserInfo = function(){
				return testData.userInfo;
			};

			mockOrderService.getUserOrders = function(userInfo){
				var deferred = $q.defer();
				deferred.resolve(testData.userOrders);
				return deferred.promise;
			};

			orderController = $controller('orderController', {
				UserService: mockUserService,
				OrderService: mockOrderService,
				basePath: basePath,
				$rootScope: $rootScope
			});
		});
	});

	it('should initialize with user information.', function(){
		expect(orderController.userInfo).toEqual(testData.userInfo);
	});
	it('should retrieve the previous orders of the user, if the user has logged in.', function(){
		var userInfo = {
			token: 'mockToken',
			user:orderController.userInfo
		};
		mockOrderService.getUserOrders(userInfo).then(function(response){
			expect(response).toEqual(testData.userOrders);
		});
		$rootScope.$digest();
	});
	it('should not retrieve any information, if the user has not logged in.', function(){
		expect(orderController.token).toBe(false);
		expect(orderController.loading).toBe(false);
	});
});