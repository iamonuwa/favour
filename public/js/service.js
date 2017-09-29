(function() {
    "use strict";

    angular.module('menuApp')
        .service('MenuService', MenuService)
        .service('UserService', UserService)
        .service('CartService', CartService)
        .service('OrderService', OrderService);

    MenuService.$inject = ['$http', 'basePath', 'UserService'];
    function MenuService($http, basePath, UserService) {
        var service = this;

        service.getCategories = function() {
            return $http.get(basePath + '/categories').then(function(response) {
                window.localStorage['categories'] = angular.toJson(response.data);
                return response.data;
            });
        };

        service.getCategoryInfo = function(categoryShortName){
            var categories = angular.fromJson(window.localStorage['categories']);
            for (var i = 0, j = categories.length; i < j; i++) {
                if (categories[i].short_name == categoryShortName) {
                    return categories[i];
                }
            }
        };

        service.getMenuItems = function(){
            return $http.get(basePath + '/menu_items/').then(function(response) {
                return response.data;
            });
        };

        service.searchItems = function(searchString){
            return $http.get(basePath + '/menu_items').then(function(response) {
                var searchResult = [];
                var data = response.data;
                for(var i=0, j=data.length; i<j; i++){
                    if(data[i].description.indexOf(searchString.toLowerCase()) !== -1)
                        searchResult.push(data[i]);
                }
                return searchResult;
            });
        };

        service.getCategoryItems = function(categoryShortName){
            return $http.get(basePath + '/menu_items?category_id=' + categoryShortName)
                    .then(function(response){
                        return response.data;
                    });
        };

        service.getSpecials = function() {
            return $http.get(basePath + '/menu_items?category_id=SP').then(function(response) {
                return response.data;
            });
        };

        service.getMenuItem = function(itemShortName){
            return $http.get(basePath + '/menu_items/' + itemShortName)
                    .then(function(response){
                        return response.data;
                    });
        };

        service.createNewCategory = function(categoryInfo){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'POST', 
                url: `${basePath}/categories/`,
                headers: {'x-access-token': token},
                data: categoryInfo
            }).then(function(response){
                return response;
            });
        };

        service.updateCategory = function(categoryInfo){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'PUT', 
                url: `${basePath}/categories/${categoryInfo._id}`,
                headers: {'x-access-token': token},
                data: categoryInfo
            }).then(function(response){
                return response;
            });
        };

        service.deleteCategory = function(categoryInfo){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'DELETE', 
                url: `${basePath}/categories/${categoryInfo._id}`,
                headers: {'x-access-token': token}
            }).then(function(response){
                return response;
            });
        };

        service.createMenuItem = function(menuItemInfo){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'POST', 
                url: `${basePath}/menu_items/`,
                headers: {'x-access-token': token},
                data: menuItemInfo
            }).then(function(response){
                return response;
            });
        };

        service.updateMenuItem = function(menuItemInfo){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'PUT', 
                url: `${basePath}/menu_items/${menuItemInfo._id}`,
                headers: {'x-access-token': token},
                data: menuItemInfo
            }).then(function(response){
                return response;
            });
        };

        service.deleteMenuItem = function(menuItemId){
            var token = UserService.getUserInfo().token;
            return $http({
                method: 'DELETE', 
                url: `${basePath}/menu_items/${menuItemId}`,
                headers: {'x-access-token': token}
            }).then(function(response){
                return response;
            });
        };
    }

    UserService.$inject = ['$http', 'basePath'];
    function UserService($http, basePath){
        var service = this;

        // login signup and logout
        service.submitLogin = function(userInfo){
            return $http.post(basePath + '/users/login', userInfo).then(function(response){
                return response;
            });
        };
        service.submitSignup = function(userInfo){
            return $http.post(basePath + '/users/register', userInfo).then(function(response){
                return response;
            });
        };
        service.userLogout = function(){
            window.sessionStorage.removeItem('userInfo');
            return 'You have logged out!'
        };

        // save and get user info
        service.saveUserInfo = function(data){
            var userInfo = {
                token: data.token,
                info: data.user 
            };
            window.sessionStorage['userInfo'] = angular.toJson(userInfo);
        };
        service.getUserInfo = function(){
            var userInfo = angular.fromJson(window.sessionStorage['userInfo']);
            if(userInfo === undefined){
                userInfo = {};
            }
            return userInfo;
        };

        // get all user info for admin
        service.getAllUsers = function(token){
            return $http({
                method: 'GET',
                url: `${basePath}/users/`,
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };
    }

    CartService.$inject = ['$http', 'UserService', 'basePath'];
    function CartService($http, UserService, basePath){
        var service = this;
        var cartItems = [];

        // get number of items in cart
        service.numInCart = function(){
            return cartItems.length;
        };
        // add item into cart
        service.addToCart = function(item){
            cartItems.push(item);
            return cartItems;
        };
        // get items from cart
        service.getCartItems = function(){
            return cartItems;
        };
        // calculate total price of all cartItems
        service.getOrderTotal = function(){
            var orderTotal = 0;
            for(var i=0, j=cartItems.length; i<j; i++){
                orderTotal += cartItems[i].totalPrice;
            }
            return orderTotal;
        };

        // modify cart
        service.addOne = function(itemIndex){
            cartItems[itemIndex].itemNumber++;
            cartItems[itemIndex].totalPrice = cartItems[itemIndex].itemNumber * cartItems[itemIndex].dishPrice;
        };
        service.minusOne = function(itemIndex){
            if(cartItems[itemIndex].itemNumber > 1){
                cartItems[itemIndex].itemNumber--;
                cartItems[itemIndex].totalPrice = cartItems[itemIndex].itemNumber * cartItems[itemIndex].dishPrice;
                return true;
            } else if(cartItems[itemIndex].itemNumber = 1){
                return false;
            }
            
        };
        service.deleteDish = function(itemIndex){
            cartItems.splice(itemIndex,1);
        };

        service.placeOrder = function(userInfo){
            var orderData = {};
            if(!userInfo){
                userInfo = UserService.getUserInfo();
            }
            if(userInfo.token && !userInfo.info.admin){
                // the user is logged in as an ordinary user
                var userId = userInfo.info._id;
                var token = userInfo.token;
                orderData = {
                    contents: cartItems,
                    total: service.getOrderTotal(),
                    placedBy: userId
                };
                return $http({
                    method: 'POST',
                    url: `${basePath}/orders/${userId}`,
                    headers: {'x-access-token': token},
                    data: orderData
                }).then(function(response){
                    cartItems = [];
                    return response;
                });
            } else if(userInfo.token && userInfo.info.admin){
                // the user is logged in as admin
                return 'admin';
            } else {
                // the user has not logged in
                return false;
            }            
        };
    }

    OrderService.$inject = ['$http', 'basePath'];
    function OrderService($http, basePath){
        var service = this;

        service.getUserOrders = function(userInfo){
            return $http({
                method: 'GET',
                url: `${basePath}/orders/${userInfo.info._id}`,
                headers: {'x-access-token': userInfo.token}
            }).then(function(response){
                return response.data;
            });
        };

        service.getAllOrders = function(userInfo){
            return $http({
                method: 'GET',
                url: `${basePath}/orders/`,
                headers: {'x-access-token': userInfo.token}
            }).then(function(response){
                return response.data;
            });
        };

        service.getIncomingOrders = function(userInfo){
            return $http({
                method: 'GET',
                url: `${basePath}/orders/incoming`,
                headers: {'x-access-token': userInfo.token}
            }).then(function(response){
                return response.data;
            });
        };

        // update order state
        service.updateOrder = function(orderInfo, token){
            // update order status
            orderInfo.status = 'complete';
            return $http({
                method: 'PUT',
                url: `${basePath}/orders/${orderInfo.placedBy}/${orderInfo._id}`,
                headers: {'x-access-token': token},
                data: orderInfo
            }).then(function(response){
                return response;
            });
        };
    }
})();
