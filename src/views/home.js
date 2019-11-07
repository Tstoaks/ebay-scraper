ngapp.controller('homeController', function ($scope, $state, urlService, dbService, presetService) {
    urlService.init();
    presetService.loadPresets();
    dbService.connect().then(function () {
        $scope.$applyAsync(function () {
            $scope.connected = true
        });
    }, function () {
        alert(`Failed to connect to database!`);
        close();
    });

    $scope.presets = presetService.getPresets();
    if ($scope.presets.length > 0) {
        $scope.presetName = $scope.presets[0].presetName;
    }

    $scope.numPages = '1';

    $scope.performSearch = () => {
        $state.go('searching', {
            presetName: $scope.presetName,
            numPages: $scope.numPages
        });
    };

    $scope.modify = () => {
        $state.go('addModify', {
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
