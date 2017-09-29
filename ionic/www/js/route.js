(function() {
    "use strict";

    angular.module('menuApp').config(routeConfig);

    routeConfig.$inject = ['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider', '$httpProvider'];

    function routeConfig($urlRouterProvider, $stateProvider, $ionicConfigProvider, $httpProvider) {
        // If user goes to a path that doesn't exist, redirect to home page
        $urlRouterProvider.otherwise('/');
        // Configures the routes and views
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/views/home.html'
            })
            .state('category', {
                url: '/menu/{categoryId}/{categoryName}',
                templateUrl: 'src/views/category.html',
                controller: 'menuItemsController',
                controllerAs: 'menuItemsCtrl'
            })
            .state('dish', {
                url: '/menu/{categoryId}/{categoryName}/{dish}',
                templateUrl: 'src/views/dish.html',
                controller: 'dishController',
                controllerAs: 'dishCtrl'
            })
            .state('cart', {
                url: '/cart',
                templateUrl: 'src/views/cart.html',
                controller: 'cartController',
                controllerAs: 'cartCtrl'
            })
            .state('orders', {
                url: '/orders',
                templateUrl: 'src/views/orders.html',
                controller: 'orderController',
                controllerAs: 'orderCtrl'
            })
            .state('adminCategory', {
                url:'/admin/category',
                templateUrl: 'src/views/admin/category.html',
                controller: 'adminCategoryController',
                controllerAs: 'adminCategoryCtrl'
            })
            .state('adminUpdateCategory', {
                url:'/admin/category/{categoryShortName}',
                templateUrl: 'src/views/admin/updateCategory.html',
                controller: 'adminUpdateCategoryController',
                controllerAs: 'updateCategoryCtrl'
            })
            .state('adminMenuItem', {
                url: '/admin/menuItem',
                templateUrl: 'src/views/admin/menuItem.html',
                controller: 'adminMenuItemController',
                controllerAs: 'adminMenuItemCtrl'
            })
            .state('adminUpdateMenuItem', {
                url:'/admin/menuItem/{menuItemShortName}',
                templateUrl: 'src/views/admin/updateMenuItem.html',
                controller: 'adminUpdateMenuItemController',
                controllerAs: 'updateMenuItemCtrl'
            })
            .state('adminOrder', {
                url: '/admin/orders',
                templateUrl: 'src/views/admin/orders.html',
                controller: 'adminOrderController',
                controllerAs: 'adminOrderCtrl'
            })
            .state('adminSales', {
                url: '/admin/sales',
                templateUrl: 'src/views/admin/sales.html',
                controller: 'adminSalesController',
                controllerAs: 'adminSalesCtrl'
            })
            .state('adminUser', {
                url: '/admin/users',
                templateUrl: 'src/views/admin/users.html',
                controller: 'adminUsersController',
                controllerAs: 'adminUsersCtrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'src/views/about.html',
                controller: 'aboutController',
                controllerAs: 'aboutCtrl'
            });
    }

})();
