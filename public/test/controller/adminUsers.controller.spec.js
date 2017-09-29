describe('The adminUsersController', function(){
	'use strict';

	var adminUsersController;
	var $rootScope;
	var mockOrderService = {};
	var mockUserService = {};
	var testData = {
		loginUserInfo: {
			token: 'mockToken',
	        user: {
	            _id: "admin",
	            admin: true,
	            createdAt: "2017-01-29T01:37:38.467Z",
	            hash: "77cqe",
	            salt: "1e1fs",
	            updatedAt: "2017-01-29T01:37:38.467Z",
	            username: "mock"
	        }
		},
		users: [
			{
	            _id: "user001",
	            admin: false,
	            createdAt: "2017-01-29T01:37:38.467Z",
	            hash: "77c",
	            salt: "1e1",
	            updatedAt: "2017-01-29T01:37:38.467Z",
	            username: "mock1"
	        },
	        {
	            _id: "user002",
	            admin: false,
	            createdAt: "2017-01-20T01:37:38.467Z",
	            hash: "77ca",
	            salt: "1e1ad",
	            updatedAt: "2017-01-20T01:37:38.467Z",
	            username: "mock2"
	        }
		],
		orders: [{
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
		},
		{
		    _id: "order002",
		    contents: [
            	{"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
            	{"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95}
            ],
		    createdAt: "2017-03-14T01:38:15.990Z",
		    placedBy: "user002",
		    status: "served",
		    total: 37.9,
		    updatedAt: "2017-03-14T01:38:15.990Z"
		},
		{
		    _id: "order003",
		    contents: [
            	{"dishShortName":"SP1","dishName":"Chinese Scallion Pancake","dishDesc":"with choice of string bean, string bean chicken, string bean beef, beef onions, moo shu vegetable","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95},
            	{"dishShortName":"SP2","dishName":"Teriyaki Chicken","dishDesc":"marinated grilled chicken breast with vegetables and lo mein on the side","spicyLevel":"No Spicy","sides":{"soup":{"selected":false,"price":1},"salad":{"selected":false,"price":1.5},"rice":{"selected":false,"price":2}},"sidesArr":[],"dishNote":"","dishPrice":18.95,"sidesNumber":0,"itemNumber":1,"totalPrice":18.95}
            ],
		    createdAt: "2017-03-14T01:38:15.990Z",
		    placedBy: "user001",
		    status: "served",
		    total: 37.9,
		    updatedAt: "2017-03-14T01:38:15.990Z"
		}],
		formatedUserData: [
			{
			    count: 2,
			    id: "user001",
			    lastOrder: "2017-03-14T01:38:15.990Z",
			    name: "mock1",
			    registerTime: "2017-01-29T01:37:38.467Z",
			    total: 75.8
			},
			{
			    count: 1,
			    id: "user002",
			    lastOrder: "2017-03-14T01:38:15.990Z",
			    name: "mock2",
			    registerTime: "2017-01-20T01:37:38.467Z",
			    total: 37.9
			}
		]
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector, $q){
			var $controller = $injector.get('$controller');
			$rootScope = $injector.get('$rootScope');

			mockUserService.getUserInfo = function(){
				return testData.loginUserInfo;
			};
			mockUserService.getAllUsers = function(){
				var deferred = $q.defer();
				deferred.resolve(testData.users);
				return deferred.promise;
			};

			mockOrderService.getAllOrders = function(userInfo){
				var deferred = $q.defer();
				deferred.resolve(testData.orders);
				return deferred.promise;
			};

			adminUsersController = $controller('adminUsersController', {
				OrderService: mockOrderService,
				UserService: mockUserService,
				$rootScope: $rootScope
			});
		});
	});

	it('should initalize with user information.', function(){
		expect(adminUsersController.loginUserInfo).toEqual(testData.loginUserInfo);
	});
	it('should rank users by their total purchasings and order time.', function(){
		adminUsersController.parseUserInfo(testData.users, testData.orders);
		expect(adminUsersController.usersArr).toEqual(testData.formatedUserData);
	});
});