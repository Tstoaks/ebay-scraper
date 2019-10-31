ngapp.controller('addModifyController', function ($scope, $state, $stateParams) {
    $scope.addNewPreset = () => {
        $state.go('modifySelected', {});
    };
    $scope.goBack = () => {
        $state.go('home', {});
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addModify', {
        url: '/addModify?preset',
        templateUrl: 'views/addModify.html',
        controller: 'addModifyController'
    });
}]);