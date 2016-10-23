(function() {
    angular.module("em.addEvent.v02").controller("em.addEvent.v02.addEventController", addEventController);

    function addEventController($scope, uploadService, addEventService) {
        $scope.event = {
            isGame: false,
            report: null
        };
        $scope.place = {};
        $scope.lookFor = function() {
            $scope.apiError = false;
            $scope.search($scope.event.place)
                .then(
                    function(res) { // success
                        $scope.addMarker(res);
                        $scope.place.name = res.name;
                        $scope.place.lat = res.geometry.location.lat();
                        $scope.place.lng = res.geometry.location.lng();
                    },
                    function(status) { // error
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
        };
        $scope.upload = function() {
            uploadService.upload($scope.media).then(function(res) {
                $scope.uploaded = res.data;
            }).catch(function(error) {
                console.log(error);
            });
        };
        $scope.add = function() {
            addEventService.addEvent($scope.event);
        };
    }
    addEventController.$inject = ["$scope", "em.addEvent.v02.uploadService", "em.addEvent.v02.addEventService"];
})();
