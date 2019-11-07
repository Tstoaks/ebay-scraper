ngapp.controller('modifySelectedController', function ($scope, $state, $stateParams, presetService) {
    $scope.searchTerm = '';
    $scope.presetName = '';
    $scope.keyword = '';
    $scope.storedKeywords = [];
    $scope.addKeyword = () => {
        $scope.storedKeywords.push($scope.keyword.toLowerCase());
        $scope.keyword = '';
    };
    $scope.save = () => {
        let preset = {
            searchTerm: $scope.searchTerm,
            presetName: $scope.presetName,
            keywords: $scope.storedKeywords
        };

        presetService.storeGlobalPreset(preset);
        $state.go('home', {});
    };
    $scope.goBack = () => {
        $state.go('addModify', {});
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('modifySelected', {
        url: '/modifySelected',
        templateUrl: 'views/modifySelected.html',
        controller: 'modifySelectedController'
    });
}]);