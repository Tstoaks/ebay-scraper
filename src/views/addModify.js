ngapp.controller('addModifyController', function ($scope, $state, presetService) {
    $scope.presets = presetService.getPresets();
    if ($scope.presets.length > 0) {
        $scope.presetName = $scope.presets[0].presetName;
    }

    $scope.modify = () => {
        $state.go('modifySelected', {
            presetName: $scope.presetName
        });
    };

    $scope.addNewPreset = () => {
        $state.go('modifySelected', {});
    };

    $scope.goBack = () => {
        $state.go('home', {});
    };
});

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('addModify', {
        url: '/addModify?presetName',
        templateUrl: 'views/addModify.html',
        controller: 'addModifyController'
    });
}]);