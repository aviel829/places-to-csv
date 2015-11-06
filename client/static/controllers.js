(function () {
    'use strict';

    var app = angular.module('places');

    app.controller('PlacesCtrl', function ($scope, $http, searchService) {

        $scope.roles = searchService.roles;
        $scope.streets = searchService.streets;
        var selectedStreets = $scope.selectedStreets = {};
        var selectedRoles = $scope.selectedRoles = {};


        $scope.download = function () {

            var roles = [];
            var streets = [];

            angular.forEach(selectedRoles, function (value, key) {

                if (value) {
                    roles.push(key);
                }

            });

            angular.forEach(selectedStreets, function (value, key) {

                if (value) {
                    streets.push(key);
                }

            });


            searchService.download(roles, streets);
        };

        $scope.isStreetSelected = function (street) {
            return selectedStreets[street];
        };

        $scope.toggleStreet = function (street) {
            selectedStreets[street] = !selectedStreets[street];
        };

        $scope.isRoleSelected = function (role) {
            return selectedRoles[role];
        };

        $scope.toggleRole = function (role) {
            selectedRoles[role] = !selectedRoles[role];
        };


    });


})();