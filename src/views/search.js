ngapp.controller('searchController', function ($scope, $state, $stateParams, ebayService) {
        $scope.resultsFound = 0;
        $scope.loaded = false;

        ebayService.onResultsFound = function (num) {
            $scope.$applyAsync(function () {
                $scope.resultsFound += num;
            });
        };

        ebayService.search($stateParams).then(function (results) {
            $scope.$applyAsync(function () {
                $scope.loaded = true;
                $scope.results = results;
            });
        });

        let sortResults = (reverse, getSortValue) => {
            $scope.results.sort(function compare(a, b) {
                let aValue = getSortValue(reverse ? b : a);
                let bValue = getSortValue(reverse ? a : b);

                if (aValue > bValue) return 1;
                if (aValue < bValue) return -1;
                return 0;
            });
        };

        $scope.sortAlphabetically = () => {
            if ($scope.sortAlpha === 'title(a-z)') {
                sortResults(false, function (item) {
                    return item.title;
                });
            }
            if ($scope.sortAlpha === 'title(z-a)') {
                sortResults(true, function (item) {
                    return item.title;
                });
            }
        };

        $scope.sortByMatched = () => {
            if ($scope.sortMatched === 'most-matched') {
                sortResults(true, function (item) {
                    return item.foundKeywords.length;
                });
            }
            if ($scope.sortMatched === 'least-matched') {
                sortResults(false, function (item) {
                    return item.foundKeywords.length;
                });
            }
        };

        $scope.sortByDate = () => {
            if ($scope.sortDate === 'newest-first') {
                sortResults(true, function (item) {
                    return new Date(item.pubDate);
                });
            }
            if ($scope.sortDate === 'oldest-first') {
                sortResults(false, function (item) {
                    return new Date(item.pubDate);
                });
            }
        };

        $scope.reset = () => {
            $state.go('home', {});
        };
    }
);

ngapp.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('searching', {
        url: '/search?presetName&numPages',
        templateUrl: 'views/searching.html',
        controller: 'searchController'
    });
}]);

