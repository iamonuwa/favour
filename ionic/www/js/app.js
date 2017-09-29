(function() {
    "use strict";

    angular.module('menuApp', ['ionic'])
        .constant('basePath', 'https://krispy123.herokuapp.com')
        // for the outer wrap
        .controller('menuController', menuController)
        // for home page
        .component('searchMenu', {
            templateUrl: 'src/template/searchMenu.html',
            controller: searchMenuController,
            transclude: true
        })
        .component('specialMenu', {
            templateUrl: 'src/template/specialMenu.html',
            controller: specialMenuController
        })
        .component('menuCategory', {
            templateUrl: 'src/template/menuCategory.html',
            controller: menuCategoryController
        })
        // for category page
        .controller('menuItemsController', menuItemsController)
        // for dish page
        .controller('dishController', dishController)
        // for cart view
        .controller('cartController', cartController)
        // for order page (ordinary user)
        .controller('orderController', orderController)
        // for adminCategory
        .controller('adminCategoryController', adminCategoryController)
        .controller('adminUpdateCategoryController', adminUpdateCategoryController)
        // for adminMenuItem  
        .controller('adminMenuItemController', adminMenuItemController)
        .controller('adminUpdateMenuItemController', adminUpdateMenuItemController)
        // for adminOrder
        .controller('adminOrderController', adminOrderController)
        // for adminSales
        .controller('adminSalesController', adminSalesController)
        // for adminUsers
        .controller('adminUsersController', adminUsersController)
        // for about page
        .controller('aboutController', aboutController);


    // -- outer wrap --
    // for controller - menuController
    menuController.$inject = ['$scope', 'UserService', 'CartService', '$ionicSideMenuDelegate', '$ionicModal', '$ionicPopup'];
    function menuController($scope, UserService, CartService, $ionicSideMenuDelegate, $ionicModal, $ionicPopup) {
        // toggle sidebar
        $scope.toggleSidebar = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };
        $scope.closeSidebar = function() {
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        // Modal form for login and signup
        $ionicModal.fromTemplateUrl('src/views/loginModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.loginModal = modal;
        });
        $scope.openLoginModal = function() {
            $scope.loginModal.show();
        };
        $scope.closeLoginModal = function() {
            $scope.loginModal.hide();
        };

        // login and signup
        $scope.showLogin = true;
        $scope.userInfo = {};
        $scope.username;
        // switch between login and signup
        $scope.toggleForm = function() {
            $scope.showLogin = $scope.showLogin ? false : true;
        };
        // login
        $scope.login = function(userInfo) {
            UserService.submitLogin(userInfo).then(function(response) {
                // save userInfo
                UserService.saveUserInfo(response.data);
                // confirm login Successfully
                $scope.statusReport(response)
                $scope.renewLoginStatus();
            }, function(response) {
                // report unsuccessful login
                $scope.statusReport(response);
            });
        };
        // logout
        $scope.logout = function() {
            $scope.statusReport({}, '', 'confirmLogout');
        };
        // signup
        $scope.signup = function(userInfo) {
            UserService.submitSignup(userInfo).then(function(response) {
                if (response.status == 200) {
                    // confirm signup
                    $scope.statusReport(response, response.data.status);
                    // login automatically
                    UserService.submitLogin(userInfo).then(function(response) {
                        UserService.saveUserInfo(response.data);
                        $scope.renewLoginStatus();
                    });
                }
            }, function(response) {
                // report unsuccessful signup
                $scope.statusReport(response, response.data.err.message);
            });
        };
        // report status on user login etc.
        $scope.statusReport = function(response, msg, confirm) {
            var alertPopup;
            if (confirm == 'confirmLogout') {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Sure you want to logout?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.statusReport({}, UserService.userLogout());
                        $scope.renewLoginStatus();
                    }
                });
            } else if (msg) {
                alertPopup = $ionicPopup.alert({ title: msg });
            } else {
                alertPopup = $ionicPopup.alert({
                    title: response.data.status,
                    template: response.data.msg
                });
            }
            if (alertPopup)
                alertPopup.then(function(res) {
                    if (response.status == 200) {
                        // clear and close the form
                        $scope.closeLoginModal();
                        // $scope.username = $scope.userInfo.username;
                        $scope.userInfo.username = '';
                        $scope.userInfo.password = '';
                    }
                });
        };
        $scope.renewLoginStatus = function() {
            var userInfo = UserService.getUserInfo();
            $scope.loginStatus = userInfo.token;       
            if($scope.loginStatus){
                $scope.admin = userInfo.info.admin;
                $scope.username = userInfo.info.username;
            } else {
                $scope.admin = false;
            }
        };
        $scope.renewLoginStatus();

        // show number of items in cart
        $scope.itemsInCart = CartService.numInCart();
        $scope.$watch(CartService.numInCart, function(newValue, oldValue) {
            $scope.itemsInCart = newValue;
        });

        // go to git repository
        $scope.openGit = function(){
            window.location.href = 'https://github.com/antipasjiajia/menuApp';
        };
    }

    // -- homepage --
    // for component - searchMenu; to display search bar and search result
    searchMenuController.$inject = ['MenuService', 'basePath', '$element', '$document'];
    function searchMenuController(MenuService, basePath, $element, $document) {
        var $ctrl = this;
        var searchInput = $element.find('input');

        $ctrl.searchInput = '';
        $ctrl.msg = '';
        $ctrl.searching = false;
        $ctrl.basePath = basePath;

        // toggle effects on focus and blur of searchInput
        searchInput.on('focus', function() {
            this.placeholder = '';
        });
        searchInput.on('blur', function() {
            this.placeholder = 'What are you in the mood for?';
            $ctrl.searchInput = '';
        });

        // search for menuItems when searchBtn is clicked
        $ctrl.searchMenu = function() {
            $ctrl.searching = true;
            $ctrl.menuItems = [];
            $ctrl.msg = '';
            if ($ctrl.searchInput) {
                MenuService.searchItems($ctrl.searchInput).then(function(response) {
                    // try to fetch the menu data
                    if (response.length) {
                        // the search returns a result
                        $ctrl.menuItems = response;
                    } else {
                        $ctrl.msg = "Sorry, we don't have this item...";
                    }
                    $ctrl.searching = false;
                });
            } else {
                // when searchInput is empty
                $ctrl.msg = 'Please enter a search string...';
                $ctrl.searching = false;
            }
        };
    }

    // for Component - specialMenu; to display specialMenus in the home page
    specialMenuController.$inject = ['MenuService', 'basePath'];
    function specialMenuController(MenuService, basePath) {
        var $ctrl = this;
        $ctrl.loading = true;
        $ctrl.basePath = basePath;
        $ctrl.$onInit = function() {
            MenuService.getSpecials().then(function(response) {
                $ctrl.specials = response;
                $ctrl.loading = false;
            });
        };
    }

    // for Component - menuCategory; to display menuCategories
    menuCategoryController.$inject = ['MenuService', 'basePath'];
    function menuCategoryController(MenuService, basePath) {
        var $ctrl = this;
        $ctrl.loading = true;
        $ctrl.basePath = basePath;
        $ctrl.$onInit = function() {
            MenuService.getCategories().then(function(response) {
                $ctrl.categories = response;
                $ctrl.loading = false;
            });
        }
    }

    // -- for category page --
    menuItemsController.$inject = ['MenuService', '$stateParams', 'basePath'];
    function menuItemsController(MenuService, $stateParams, basePath) {
        var menuItemsCtrl = this;
        menuItemsCtrl.category = $stateParams;
        menuItemsCtrl.loading = true;
        menuItemsCtrl.basePath = basePath;

        MenuService.getCategoryItems($stateParams.categoryId).then(function(response) {
            menuItemsCtrl.menuItems = response;
            menuItemsCtrl.loading = false;
            menuItemsCtrl.categoryInfo = MenuService.getCategoryInfo($stateParams.categoryId);
        });
    }

    // -- for dish page --
    dishController.$inject = ['MenuService', 'CartService', '$stateParams', '$ionicPopup', '$state'];
    function dishController(MenuService, CartService, $stateParams, $ionicPopup, $state) {
        var dishCtrl = this;
        dishCtrl.loading = true;

        // properties for form data
        dishCtrl.dishPrice = 0;
        dishCtrl.spicyLevel = '';
        dishCtrl.sides = {
            soup: { selected: false, price: 1 },
            salad: { selected: false, price: 1.5 },
            rice: { selected: false, price: 2 }
        };
        dishCtrl.dishNote = '';

        // store category info 
        dishCtrl.categoryId = $stateParams.categoryId;
        dishCtrl.categoryName = $stateParams.categoryName;

        // get dish info 
        MenuService.getMenuItem($stateParams.dish).then(function(response) {
            dishCtrl.dishInfo = response[0];
            dishCtrl.dishPrice = dishCtrl.dishInfo.price_large;
            dishCtrl.loading = false;
        });

        // add side dishes price to the dish's total price
        dishCtrl.computePrice = function() {
            var sidesPrice = 0;
            var sidesNumber = 0;
            var sidesArr = [];
            var item = {};
            for (item in dishCtrl.sides) {
                if (dishCtrl.sides[item].selected) {
                    sidesPrice += dishCtrl.sides[item].price;
                    sidesArr.push(item);
                    sidesNumber++;
                }
            }
            dishCtrl.dishPrice = dishCtrl.dishInfo.price_large + sidesPrice;
            dishCtrl.sidesNumber = sidesNumber;
            dishCtrl.sidesArr = sidesArr;
        };

        // when the "addToCart" button is clicked
        dishCtrl.addToCart = function() {
            if (!dishCtrl.spicyLevel) {
                // the required field is not completed
                // popup dialog box and ask user to complete the required field
                incompleteAlert();

                function incompleteAlert() {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Required Field Left Out',
                        template: 'Please select the desired spicy level for your dish ^-^'
                    });
                }
            } else {
                // submit dishShortName and form information
                var dishData = {};
                dishData.dishShortName = $stateParams.dish;
                dishData.dishName = dishCtrl.dishInfo.name;
                dishData.dishDesc = dishCtrl.dishInfo.description;
                dishData.spicyLevel = dishCtrl.spicyLevel;
                dishData.sides = dishCtrl.sides;
                dishData.sidesArr = dishCtrl.sidesArr ? dishCtrl.sidesArr : [];
                dishData.dishNote = dishCtrl.dishNote;
                dishData.dishPrice = dishCtrl.dishPrice;
                dishData.sidesNumber = dishCtrl.sidesNumber ? dishCtrl.sidesNumber : 0;
                dishData.itemNumber = 1;
                dishData.totalPrice = dishData.dishPrice * dishData.itemNumber;
                // add to cart (an array in the UserService)
                CartService.addToCart(dishData);
                // popup dialog box to confirm submition
                confirmAddToCart();

                function confirmAddToCart() {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Dish Added Successfully!',
                        template: 'Do you want to go your cart now?'
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            $state.go('cart');
                        } else {
                            return;
                        }
                    });
                }
            }
        }
    }

    // -- for cart view -- 
    cartController.$inject = ['CartService', '$ionicPopup', '$ionicActionSheet', '$state', '$scope'];
    function cartController(CartService, $ionicPopup, $ionicActionSheet, $state, $scope) {
        var cartCtrl = this;

        cartCtrl.cartItems = CartService.getCartItems();
        $scope.$watch(CartService.getCartItems, function(newValue, oldValue) {
            cartCtrl.cartItems = CartService.getCartItems();
        });
        // calculate and track oderTotal
        cartCtrl.orderTotal = CartService.getOrderTotal();
        $scope.$watch(CartService.getOrderTotal, function(newValue, oldValue) {
            cartCtrl.orderTotal = newValue;
        });

        // change item number
        cartCtrl.addOne = function(itemIndex) {
            CartService.addOne(itemIndex);
        };
        cartCtrl.minusOne = function(itemIndex) {
            var flag = CartService.minusOne(itemIndex);
            if (!flag) {
                // only one item left, alert on deletion
                deletionAlert();
            }

            function deletionAlert() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Delete this item?',
                    template: `Are you sure you want to delete ${cartCtrl.cartItems[itemIndex].dishName}?`,
                    okText: 'Yes'
                });

                confirmPopup.then(function(res) {
                    if (res) CartService.deleteDish(itemIndex);
                });
            }
        };

        // show the actionsheet from the bottom 
        cartCtrl.showContrl = function(itemIndex) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'View' },
                    { text: 'Edit' }
                ],
                destructiveText: 'Delete',
                titleText: 'Check and modify this dish',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                destructiveButtonClicked: function() {
                    CartService.deleteDish(itemIndex);
                    hideSheet();
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            cartCtrl.viewDetails(itemIndex);
                            break;
                        case 1:
                            cartCtrl.editDish(itemIndex);
                            break;
                    }
                    return true;
                }
            });
        };
        // show dish detail in a popup
        cartCtrl.viewDetails = function(itemIndex) {
            var sidesStr = cartCtrl.cartItems[itemIndex].sidesArr.length ? cartCtrl.cartItems[itemIndex].sidesArr.join(', ') : 'None';
            var alertPopup = $ionicPopup.alert({
                title: `<b>${cartCtrl.cartItems[itemIndex].dishName}</b>`,
                template: `<p><b>Description: </b>${cartCtrl.cartItems[itemIndex].dishDesc}</p>
                     <p><b>Spicy Level: </b>${cartCtrl.cartItems[itemIndex].spicyLevel}</p>
                     <p><b>Sides: </b>${sidesStr}</p>
                     <p><b>Number: </b>${cartCtrl.cartItems[itemIndex].itemNumber}</p>
                     <p><b>Total price: </b>${cartCtrl.cartItems[itemIndex].totalPrice}</p>
                    `
            });
        };
        // allow user to edit the options of the current dish
        cartCtrl.editDish = function(itemIndex) {
            $state.go('dish', { dish: cartCtrl.cartItems[itemIndex].dishShortName });
            CartService.deleteDish(itemIndex);
        };

        // place a order
        cartCtrl.placeOrder = function() {
            var response = CartService.placeOrder();
            // report on result
            if (response && response != 'admin' ) {
                orderStatus('Your order is successfully placed!');
            } else if (response && response == 'admin' ) {
                orderStatus('Please do NOT place order with the admin account!');
            } else {
                orderStatus('Please login before placing any order ^-^');
            }
            function orderStatus(resp) {
                var alertPopup = $ionicPopup.alert({ title: resp });
            };
        };
    }

    // -- for order page (ordinary user) --
    orderController.$inject = ['OrderService', 'UserService', 'basePath'];
    function orderController(OrderService, UserService, basePath){
        var orderCtrl = this;

        orderCtrl.loading = true;
        orderCtrl.basePath = basePath;
        // assume the user has logged in
        orderCtrl.token = true;
        orderCtrl.userInfo = UserService.getUserInfo();

        if(orderCtrl.userInfo.token){
            OrderService.getUserOrders(orderCtrl.userInfo).then(function(response){
                orderCtrl.orders = response;
                orderCtrl.token = orderCtrl.userInfo.token;
                orderCtrl.loading = false;
            });
        } else {
            // the user hasn't login yet
            orderCtrl.token = false;
            orderCtrl.loading = false;
        }
    }

    // -- for adminCategory --
    adminCategoryController.$inject = ['MenuService', '$ionicPopup'];
    function adminCategoryController(MenuService, $ionicPopup){
        var adminCategoryCtrl = this;
        adminCategoryCtrl.loading = true;
        // get category info list
        MenuService.getCategories().then(function(response) {
            adminCategoryCtrl.categories = response;
            adminCategoryCtrl.loading = false;
        });
        // to delete a category
        adminCategoryCtrl.deleteCategory = function(category) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'You are deleting a category',
                template: `Sure that you want to delete category - ${category.name}?`
            });
            confirmPopup.then(function(res) {
                if (res) {
                    MenuService.deleteCategory(category).then(function(response){
                        if(response.status == 200){
                             MenuService.getCategories().then(function(response) {
                                adminCategoryCtrl.categories = response;
                            });
                        }
                    });
                } 
            });
        };
    }

    adminUpdateCategoryController.$inject = ['MenuService', '$stateParams', 'basePath','$ionicPopup'];
    function adminUpdateCategoryController(MenuService, $stateParams, basePath, $ionicPopup){
        var updateCategoryCtrl = this;
        if($stateParams.categoryShortName != 'NEW'){
            updateCategoryCtrl.createNew = false;
            updateCategoryCtrl.type = 'Update';
            updateCategoryCtrl.categoryInfo = MenuService.getCategoryInfo($stateParams.categoryShortName);
        } else {
            updateCategoryCtrl.createNew = true;
            updateCategoryCtrl.type = 'Create New';
            updateCategoryCtrl.categoryInfo = {
                short_name: '',
                name: '',
                special_instructions: ''
            }
        }
        
        updateCategoryCtrl.updateCategory = function(){
            if(updateCategoryCtrl.createNew){
                // create new category
                MenuService.createNewCategory(updateCategoryCtrl.categoryInfo).then(function(response){
                    if(response.status == 200){
                        showAlert('You have successfully created a category!');
                    }
                });
            } else {
                // update category
                MenuService.updateCategory(updateCategoryCtrl.categoryInfo).then(function(response){
                    if(response.status == 200){
                        showAlert('You have successfully updated this category!');
                    }
                });
            }
        };

        function showAlert(msg) {
            var alertPopup = $ionicPopup.alert({
                title: msg
            });
        };
    }

    // -- for adminMenuItem -- 
    adminMenuItemController.$inject = ['MenuService', '$ionicPopup'];
    function adminMenuItemController(MenuService, $ionicPopup){
        var adminMenuItemCtrl = this;
        adminMenuItemCtrl.loading = true;
        // get category info list
        MenuService.getMenuItems().then(function(response) {
            adminMenuItemCtrl.menuItems = response;
            adminMenuItemCtrl.loading = false;
        });
        // to delete a category
        adminMenuItemCtrl.deleteItem = function(menuItem) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'You are deleting an item',
                template: `Sure that you want to delete item - ${menuItem.name}?`
            });
            confirmPopup.then(function(res) {
                if (res) {
                    MenuService.deleteMenuItem(menuItem._id).then(function(response){
                        if(response.status == 200){
                             MenuService.getMenuItems().then(function(response) {
                                adminMenuItemCtrl.menuItems = response;
                            });
                        }
                    });
                } 
            });
        };
    }

    adminUpdateMenuItemController.$inject = ['MenuService', '$ionicPopup', 'basePath', '$stateParams',];
    function adminUpdateMenuItemController(MenuService, $ionicPopup, basePath, $stateParams){
        var updateMenuItemCtrl = this;
        updateMenuItemCtrl.basePath = basePath;

        if($stateParams.menuItemShortName != 'NEW'){
            updateMenuItemCtrl.createNew = false;
            updateMenuItemCtrl.type = 'Update';
            MenuService.getMenuItem($stateParams.menuItemShortName).then(function(response){
                updateMenuItemCtrl.menuItemInfo = response[0];
                console.log(updateMenuItemCtrl.menuItemInfo);
            });
        } else {
            updateMenuItemCtrl.createNew = true;
            updateMenuItemCtrl.type = 'Create New';
            updateMenuItemCtrl.menuItemInfo = {
                short_name: '',
                category_id: '',
                name: '',
                description: '',
                price_large: 0
            };
        }
        
        updateMenuItemCtrl.updateMenuItem = function(){
            if(updateMenuItemCtrl.createNew){
                // create new category
                console.log(updateMenuItemCtrl.menuItemInfo);
                MenuService.createMenuItem(updateMenuItemCtrl.menuItemInfo).then(function(response){
                    console.log(response);
                    if(response.status == 200){
                        showAlert('You have successfully created a menu item!');
                    }
                });
            } else {
                // update category
                MenuService.updateMenuItem(updateMenuItemCtrl.menuItemInfo).then(function(response){
                    if(response.status == 200){
                        showAlert('You have successfully updated this item!');
                    }
                });
            }
        };

        function showAlert(msg) {
            var alertPopup = $ionicPopup.alert({
                title: msg
            });
        };
    }

    // -- for adminOrder --
    adminOrderController.$inject = ['OrderService', 'UserService', 'basePath', '$interval'];
    function adminOrderController(OrderService, UserService, basePath, $interval){
        var adminOrderCtrl = this;

        adminOrderCtrl.loading = true;
        adminOrderCtrl.basePath = basePath;
        // assume the user has logged in
        adminOrderCtrl.token = true;
        adminOrderCtrl.loginUserInfo = UserService.getUserInfo();

        // request incomingOrders
        if(adminOrderCtrl.loginUserInfo.token){
            OrderService.getIncomingOrders(adminOrderCtrl.loginUserInfo).then(function(response){
                adminOrderCtrl.orders = response;
                adminOrderCtrl.token = adminOrderCtrl.loginUserInfo.token;
                adminOrderCtrl.loading = false;
            });
            // update incomingOrders every min
            var timer = $interval(function(){
                OrderService.getIncomingOrders(adminOrderCtrl.loginUserInfo).then(function(response){
                    adminOrderCtrl.orders = response;
                });
            }, 60000);
        } else {
            // the user hasn't login yet
            adminOrderCtrl.token = false;
            adminOrderCtrl.loading = false;
            if(timer){cancel(timer);}
        }

        // update order served
        adminOrderCtrl.orderServed = function(orderInfo){
            OrderService.updateOrder(orderInfo, adminOrderCtrl.token);
        };
    }

    // -- for adminSales --
    adminSalesController.$inject = ['OrderService', 'UserService', 'basePath', '$interval'];
    function adminSalesController(OrderService, UserService, basePath, $interval){
        var adminSalesCtrl = this;

        adminSalesCtrl.loading = true;
        adminSalesCtrl.basePath = basePath;
        // assume the user has logged in
        adminSalesCtrl.token = true;
        adminSalesCtrl.loginUserInfo = UserService.getUserInfo();

        // request incomingOrders
        if(adminSalesCtrl.loginUserInfo.token){
            OrderService.getAllOrders(adminSalesCtrl.loginUserInfo).then(function(response){
                adminSalesCtrl.orders = response;
                adminSalesCtrl.token = adminSalesCtrl.loginUserInfo.token;
                adminSalesCtrl.loading = false;
                adminSalesCtrl.totalSales = caculateTotalSales(adminSalesCtrl.orders);
            });
            // update incomingOrders every 5 min
            var timer = $interval(function(){
                OrderService.getAllOrders(adminSalesCtrl.loginUserInfo).then(function(response){
                    adminSalesCtrl.orders = response;
                    adminSalesCtrl.totalSales = caculateTotalSales(adminSalesCtrl.orders);
                });
            }, 300000);
        } else {
            // the user hasn't login yet
            adminSalesCtrl.token = false;
            adminSalesCtrl.loading = false;
            if(timer){cancel(timer);}
        }

        function caculateTotalSales(orders){
            var total = 0;
            for(var i=0, j=orders.length; i<j; i++){
                total += orders[i].total;
            }
            return total;
        }
    }

    adminUsersController.$inject = ['OrderService', 'UserService', 'basePath'];
    function adminUsersController(OrderService, UserService, basePath){
        var adminUsersCtrl = this;

        adminUsersCtrl.loading = true;
        adminUsersCtrl.basePath = basePath;
        // assume the user has logged in
        adminUsersCtrl.token = true;
        adminUsersCtrl.usersObj = {};
        adminUsersCtrl.usersArr = [];

        adminUsersCtrl.loginUserInfo = UserService.getUserInfo();

        // request incomingOrders
        if(adminUsersCtrl.loginUserInfo.token){
            UserService.getAllUsers(adminUsersCtrl.loginUserInfo.token).then(function(users){
                OrderService.getAllOrders(adminUsersCtrl.loginUserInfo).then(function(orders){
                    adminUsersCtrl.token = adminUsersCtrl.loginUserInfo.token;
                    adminUsersCtrl.loading = false;
                    parseUserInfo(users, orders);
                });
            });
        } else {
            // the user hasn't login yet
            adminUsersCtrl.token = false;
            adminUsersCtrl.loading = false;
        }

        function parseUserInfo(users, orders){
            // parse user info into usersObj
            for(var i=0, j=users.length; i<j; i++){
                if(!users[i].admin){
                    adminUsersCtrl.usersObj[users[i]._id] = {
                        id: users[i]._id,
                        name: users[i].username,
                        registerTime: users[i].createdAt,
                        count: 0,
                        total: 0,
                        lastOrder: 'N.A.'
                    };
                }
            }
            // add order info into userObj
            for (var i = 0, j = orders.length; i < j; i++) {
                var userObj = adminUsersCtrl.usersObj[orders[i].placedBy];
                userObj.count++;
                userObj.total += orders[i].total;
                if (userObj.lastOrder == 'N.A.' || userObj.lastOrder < orders[i].createdAt) {
                    userObj.lastOrder = orders[i].createdAt;
                }
            }
            // push usersObj into usersArr
            for(var key in adminUsersCtrl.usersObj){
                adminUsersCtrl.usersArr.push(adminUsersCtrl.usersObj[key]);
            }
        }
    }

    // -- for about page --   
    aboutController.$inject = ['$scope', '$state', '$ionicSlideBoxDelegate'];
    function aboutController($scope, $state, $ionicSlideBoxDelegate) {
        $scope.options = {
            loop: true,
            effect: 'flip',
            speed: 500,
        }

        $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
            // data.slider is the instance of Swiper
            $scope.slider = data.slider;
        });

        $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
            // console.log('Slide change is beginning');
        });

        $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
            // note: the indexes are 0-based
            $scope.activeIndex = data.slider.activeIndex;
            $scope.previousIndex = data.slider.previousIndex;
        });
    }

})();


