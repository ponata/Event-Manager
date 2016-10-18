(function() {
    angular.module("em.editEvent").controller("em.editEvent.editEventController", editEventController);

    function editEventController($scope, $rootScope, $routeParams, eventService) {


        $scope.id = $routeParams.id;

        $scope.getEventPromise = eventService.getEvent($scope.id);
        $scope.getEventPromise.then(function(response) {
            $scope.event = response.data[0];
            $scope.event.date = new Date($scope.event.date);
            $scope.search()
        }, rejected);


        function rejected(error) {
            console.log('Error: ' + error.data.status);
        }

        $scope.search = function() {
            $rootScope.search($scope.event.place)
                .then(function(res) { // success
                        $rootScope.addMarker(res);
                    },
                    function(status) { // error
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
        }


        $scope.update = function() {
            eventService.update(Object.assign({}, $scope.event));
        }


    }

    editEventController.$inject = ["$scope", "$rootScope", "$routeParams", "em.events.eventService"];

})();
