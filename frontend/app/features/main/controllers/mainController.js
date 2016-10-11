(function() {
    'use strict';

    angular.module('em.main').controller('em.main.mainController', mainController);

    function mainController($scope, eventNews, mainApiService) {

        $scope.PickEventListNews = function () {
            eventNews.getEventNews().then(function (response) {
                $scope.events = shuffleArray(response.data).slice(0, 3);                
            }, rejected);
         
        };

        $scope.PickEventListNews();

        function rejected (error) {
            console.log('Error: ' + error.data.status);
        }
    }

    function shuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    mainController.$inject = ["$scope", "em.main.event.service.news", "em.mainApiService"];
})();
