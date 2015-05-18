var monitoring = angular.module('monitoring', ['uiGmapgoogle-maps']);

monitoring.config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'geometry,visualization'
        });
    }
);

monitoring.controller("controller", function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.

    $scope.map = { center: { latitude: 51.1493459, longitude: 14.9978427 }, zoom: 13 };
    $scope.loggedIn = false;
    $scope.registering = false;

    $scope.register = function() {
        $scope.registering = true;
    };

    $scope.login = {
        username: "",
        password: ""
    };

    $scope.registerData = {
        username: "",
        password: "",
        password2: ""
    };

    $scope.doLogin = function() {
        $scope.loggedIn = true;
        $scope.login.password = md5($scope.login.password);
    };

    $scope.doRegister = function() {
        if ($scope.registerData.password === $scope.registerData.password2) {
            $scope.login.password = md5($scope.registerData.password);
            $scope.login.username = $scope.registerData.username;
            $scope.loggedIn = true;
        } else {
            alert("Die beiden Passwörter stimmen nicht überein!");
        }
    };

    $scope.markers = [{
        id: 1,
        coords: {latitude: 51.1489846, longitude: 14.9977131}
    }];

    $scope.circles = [{
        center: {latitude: 51.1489846, longitude: 14.9977137},
        radius: 100,
        draggable: true,
        editable: true
    }];

    uiGmapGoogleMapApi.then(function(maps) {

    });
});