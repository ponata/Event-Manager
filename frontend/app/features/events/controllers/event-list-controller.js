(function() {
    angular.module("em.events").controller("em.events.event-list-controller", itemEventController);

    function itemEventController($scope, $rootScope, $location, $timeout, itemEventService, $uibModal, userService, getEvents, getCurrentUser, flashService) {

        if (!userService.getUserInfo()) {
            userService.setUserInfo(getCurrentUser[0]);
        }
        $scope.currentUser = userService.getUserInfo();

        // by default button 'load more events' is visible
        $scope.haveHistory = true;

        if (!itemEventService.getCacheEvents()) {
            $rootScope.allEvents = getEvents.data;
            $rootScope.eventsIndex = getEvents.index;
        }
        $scope.events = $rootScope.allEvents;

        // cut off tags
        angular.forEach($scope.events, function(value, key) {
            $scope.events[key].desc = $scope.events[key].desc.replace(/(<([^>]+)>)/g, "")
                .substring(0, 150) + ($scope.events[key].desc.length > 100 ? "..." : "");
        });
        /**
         * Pagination
         * Called on click 'Load more events'
         */
        $scope.updateEventList = function() {
            // save
            itemEventService.getEvents($rootScope.eventsIndex).then(function(response) {
                $scope.haveHistory = response.haveHistory;
                $rootScope.eventsIndex = response.index;

                if (response.data.length > 0) {
                    $rootScope.allEvents = $rootScope.allEvents.concat(response.data);
                }
                $scope.events = $rootScope.allEvents;

                // cut off tags
                angular.forEach($scope.events, function(value, key) {
                    $scope.events[key].desc = $scope.events[key].desc.replace(/(<([^>]+)>)/g, "")
                        .substring(0, 150) + ($scope.events[key].desc.length > 100 ? "..." : "");
                });
            }, rejected);
        };

        //redirect to other page
        $scope.fullEvent = function(eventId) {
            $location.path("/events/" + eventId);
        };

        $scope.editEvent = function(eventId) {
            $location.path("/events/" + eventId + "/edit/");
        };

        //add opportunity to delete event
        $scope.deleteEventItem = function(id) {
            itemEventService.deleteEvent(id).then(function(response) {
                var eventIndex = $scope.events
                    .map(function(event) {
                        return event.id;
                    })
                    .indexOf(id);

                $scope.events.splice(eventIndex, 1);
            }, rejected);
        }

        //add modal window
        $scope.openDeleteModal = function(event, eventItem) {
            event.stopPropagation();
            $scope.currentEventTitle = eventItem.title;
            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'deleteModalContent.html',
                scope: $scope,
                controller: ['$uibModalInstance', '$scope',
                    function($uibModalInstance, $scope) {
                        $scope.delete = function() {
                            $uibModalInstance.close();
                            $scope.currentEventTitle = null;
                            $scope.deleteEventItem(eventItem.id);
                        };
                        $scope.cancel = function() {
                            $scope.currentEventTitle = null;
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                ]
            });
        };

        //opportunity to  invite friend to event
        $scope.inviteFriend = function(event, eventItem) {
            event.stopPropagation();
            userService.getAll().then(function(response) {
                $scope.users = response;
            }, rejected);

            $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'inviteFriendForEvent.html',
                scope: $scope,
                controller: ['$uibModalInstance', '$scope',
                    function($uibModalInstance, $scope) {
                        $scope.newInvitation = {
                            userSender: userService.getUserInfo(),
                            userReceiver: {full_name: ''},
                            event: eventItem
                        }

                        $scope.invite = function(invitation) {
                            itemEventService.sendInvitation($scope.newInvitation).then(function(response) {
                                flashService.success('The invitation was sent successfully', false);
                                $timeout(function () {
                                    flashService.clearFlashMessage();
                                }, 3000);
                            }, rejected);

                            $uibModalInstance.close();

                        };
                        $scope.cancel = function() {
                            $scope.newTnvitation = null;
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                ]
            });
        }

        //error handling
        function rejected(error) {
            console.log('Error: ' + error.data.status);
        }
    }

    itemEventController.$inject = [
        "$scope",
        "$rootScope",
        "$location",
        "$timeout",
        "em.events.event-list-service",
        "$uibModal",
        "userService",
        "getEvents",
        "getCurrentUser",
        "flashService"
    ];

})();
