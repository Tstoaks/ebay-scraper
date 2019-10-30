ngapp.controller('homeController', function ($scope, $state, urlService, dbService) {
    urlService.init();
    dbService.connect().then(function () {
        $scope.$applyAsync(function () {
            $scope.connected = true
        });
    }, function () {
        alert(`Failed to connect to database!`);
        close();
    });

    $scope.searchTerm = '';
    $scope.keywords = '';
    $scope.numPages = '1';
    $scope.performSearch = () => {
        $state.go('searching', {
            searchTerm: $scope.searchTerm,
            keywords: $scope.keywords,
            numPages: $scope.numPages
        });
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
        url: '',
        templateUrl: 'views/home.html',
        controller: 'homeController'
    });
}]);
