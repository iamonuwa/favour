describe('The user service', function(){
	'use strict';

	var $httpBackend;
	var userService;
	var basePath;

	var testData = {
		loginInfo:  {username: "mock", password: "mock"},
		userInfo: {
		    _id: "5",
		    admin: false,
		    createdAt: "2017-01-29T01:37:38.467Z",
		    hash: "77c",
		    salt: "1e1",
		    updatedAt: "2017-01-29T01:37:38.467Z",
		    username: "mock"
		},
		userData: {
	        token: "mocktoken",
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
		userDataStr: '{"token":"mocktoken","info":{"_id":"5","admin":false,"createdAt":"2017-01-29T01:37:38.467Z","hash":"77c","salt":"1e1","updatedAt":"2017-01-29T01:37:38.467Z","username":"mock"}}',
		allUsers: [
			{
			    _id: "5",
			    admin: false,
			    createdAt: "2017-01-29T01:37:38.467Z",
			    hash: "77c",
			    salt: "1e1",
			    updatedAt: "2017-01-29T01:37:38.467Z",
			    username: "mock"
			},
			{
			    _id: "6",
			    admin: false,
			    createdAt: "2017-01-23T01:37:38.467Z",
			    hash: "77a",
			    salt: "1e1",
			    updatedAt: "2017-01-23T01:37:38.467Z",
			    username: "mock1"
			},
			{
			    _id: "7",
			    admin: false,
			    createdAt: "2017-01-30T01:37:38.467Z",
			    hash: "77b",
			    salt: "1e1",
			    updatedAt: "2017-01-30T01:37:38.467Z",
			    username: "mock2"
			}
		]
	};

	beforeEach(function(){
		module('menuApp');

		inject(function($injector){
			$httpBackend = $injector.get('$httpBackend');
			userService = $injector.get('UserService');
			basePath = $injector.get('basePath');
		});
	});

	it('submit login information.', function(){
		$httpBackend.expectPOST(basePath + '/users/login', testData.loginInfo).respond(testData.userInfo);
		userService.submitLogin(testData.loginInfo).then(function(response){
			expect(response.data).toEqual(testData.userInfo);
		});
		$httpBackend.flush();
	});
	it('submit signup information.', function(){
		$httpBackend.expectPOST(basePath + '/users/register', testData.loginInfo).respond(testData.userInfo);
		userService.submitSignup(testData.loginInfo).then(function(response){
			expect(response.data).toEqual(testData.userInfo);
		});
		$httpBackend.flush();
	});
	it('should save user information.', function(){
		userService.saveUserInfo(testData.userData);
		expect(window.sessionStorage['userInfo']).toEqual(testData.userDataStr);
	});
	it('should retrieve user information.', function(){
		expect(angular.toJson(userService.getUserInfo())).toEqual(testData.userDataStr);
	});
	it('logout user.', function(){
		expect(userService.userLogout()).toEqual('You have logged out!');
		expect(window.sessionStorage['userInfo']).toBeUndefined();
	});
	it('should allow administrator to retrieve the information of all users.', function(){
		var token = 'mockToken';
		$httpBackend.expectGET(basePath + '/users/').respond(testData.allUsers);
		userService.getAllUsers(token).then(function(response){
			expect(response).toEqual(testData.allUsers);
		});
		$httpBackend.flush();
	});
});