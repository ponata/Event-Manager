(function() {
    angular.module("em.addEvent").controller("em.addEvent.addEventController", addEventController);

    function addEventController($scope, $rootScope, addEventAPIService) {

      //  $scope.event.date = new Date();
        $scope.place = {};

        $scope.search = function() {
                $rootScope.search($scope.event.place)
                    .then(function(res) { // success
                            $rootScope.addMarker(res);
                            $scope.place.name = res.name;
                            $scope.place.lat = res.geometry.location.lat();
                            $scope.place.lng = res.geometry.location.lng();
                        },
                        function(status) { // error
                            $scope.apiError = true;
                            $scope.apiStatus = status;
                        }
                    );
            }
            // map.init();

        $scope.add = function() {
            if ((typeof $scope.event.title !== "undefined") && (typeof $scope.event.date !== "undefined")) {
                addEventAPIService.add(Object.assign({
                    report: null
                }, $scope.event));
            }
        }
    }
    addEventController.$inject = ["$scope", "$rootScope", "em.addEvent.addEventAPIService"];
})();
