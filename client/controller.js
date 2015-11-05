var myApp = angular.module('places', []);

myApp.controller('PlacesCtrl', function ($scope, $http) {

    $scope.download = function (query) {

        $http.get('/api/places/', {params: {query: query}})
            .success(function (result) {
                $scope.result = result;
            })

    }
});