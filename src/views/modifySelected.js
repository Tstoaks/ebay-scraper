ngapp.controller('modifySelectedController', function ($scope, $state, $stateParams, presetService) {
    let editing = Boolean($stateParams.presetName);

    if (editing) {
        $scope.preset = presetService.getPreset($stateParams.presetName);
    } else {
        $scope.preset = {
            searchTerm: '',
            presetName: '',
            keywords: []
        };
    }

    $scope.keyword = '';

    $scope.addKeyword = () => {
        $scope.preset.keywords.push($scope.keyword.toLowerCase());
        $scope.keyword = '';
    };

    $scope.save = () => {
        if (!editing) {
            presetService.storeGlobalPreset($scope.preset);
        }
        $state.go('home', {});
    };

    $scope.goBack = () => {
        $state.go('addModify', {});
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('modifySelected', {
        url: '/modifySelected?presetName',
        templateUrl: 'views/modifySelected.html',
        controller: 'modifySelectedController'
    });
}]);