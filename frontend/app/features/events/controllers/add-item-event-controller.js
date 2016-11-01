(function() {
    angular.module("em.events").controller("em.events.add-item-event-controller", itemEventController);

    function itemEventController($scope, $rootScope, $location, itemEventService, $uibModal, userService, getEvents) {
        if ($rootScope.allEvents.length === 0) {
            $rootScope.allEvents = getEvents.data;
            $rootScope.eventsIndex = getEvents.index;

        }


        $scope.events = $rootScope.allEvents;

        for (var i = 0; i < $scope.events.length; i++) {
            $scope.events[i].desc = $scope.events[i].desc.replace(/(<([^>]+)>)/g, "").substring(0, 57) + ($scope.events[i].desc.length > 100 ? "..." : "");
        }

        // by default
        $scope.haveHistory = true;

        $scope.getCurrentUser = function() {
            if (userService.getUserInfo()) {
                $scope.currentUser = userService.getUserInfo();
                return;
            }
            if (localStorage.getItem("userId")) {
                userService.getById(localStorage.getItem("userId"))
                    .then(function(response) {
                        if (Array.isArray(response) && response.length > 0) {
                            userService.setUserInfo(response[0]);
                            $scope.currentUser = userService.getUserInfo();
                        }
                    });
            };
        };

        $scope.getCurrentUser();

        /**
         * Update event list.
         * Called when init controller and update button on click
         */
        $scope.updateEventList = function() {
            console.log($rootScope.eventsIndex);
            itemEventService.getEvents($rootScope.eventsIndex).then(function(response) {
                console.log(response.haveHistory);
                $scope.haveHistory = response.haveHistory;
                $rootScope.eventsIndex = response.index;

                if (response.data.length > 0) {
                    $rootScope.allEvents = $rootScope.allEvents.concat(response.data);
                }
                $scope.events = $rootScope.allEvents;

                for (var i = 0; i < $scope.events.length; i++) {
                    $scope.events[i].desc = $scope.events[i].desc.replace(/(<([^>]+)>)/g, "").substring(0, 57) + ($scope.events[i].desc.length > 100 ? "..." : "");
                }
            }, rejected);
        };
        // $scope.updateEventList();

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
                controller: function($uibModalInstance, $scope) {
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
            });
        };

        //opportunity to subscribe and invite friend to event
        $scope.subscribeOnEvent = function() {
            event.stopPropagation();
        };

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
                controller: function($uibModalInstance, $scope) {
                    $scope.newInvitation = {
                        userSender: userService.getUserInfo(),
                        userReceiver: null,
                        event: eventItem
                    }

                    $scope.getSelectedUser = function() {
                        $scope.newInvitation.userReceiver = $scope.selectedFriend;
                    };

                    $scope.invite = function(invitation) {
                        itemEventService.sendInvitation($scope.newInvitation).then(function(response) {
                            // TODO: add user notification about success
                        }, rejected);

                        $uibModalInstance.close();
                    };

                    $scope.cancel = function() {
                        $scope.newTnvitation = null;
                        $uibModalInstance.dismiss('cancel');
                    };
                }
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
        "em.events.add-item-event-service",
        "$uibModal",
        "userService",
        "getEvents"
    ];

})();
