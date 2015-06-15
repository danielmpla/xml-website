var monitoring = angular.module('monitoring', ['uiGmapgoogle-maps', 'colorpicker.module']);

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

    $scope.iconURL = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|';
    $scope.forbidden = "#ff0303";
    $scope.notForbidden = "#08B21F";

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

    $scope.clients = [{
        id: 1,
        name: "Name",
        mac: "Test MAC",
        color: "ff0303",
        edit: false,
        visible: true,
        new: false,
        coords: {latitude: 51.1489846, longitude: 14.9977131},
        zones: [{
            name: "test",
            center: {latitude: 51.1489846, longitude: 14.9977137},
            radius: 100,
            editable: false,
            visible: true,
            forbidden: "#ff0303"
        }]
    }];

    $scope.path = {
        visible: false,
        path: [
        {latitude: 51.1489846, longitude: 14.9977131},
        {latitude: 51.2, longitude: 14.9977131},
        {latitude: 51.1489846, longitude: 15.0}
    ]};

    $scope.addButton = function() {
        var mac = prompt("Geben Sie bitte die MAC-Adresse des neuen Geräts ein!", "00:00:00:00:00");
        if (mac != null) {
            $scope.addClient(mac);
        }
    };

    $scope.addZone = function(id) {
        for (var i = 0; i < $scope.clients.length; i++) {
            if ($scope.clients[i].id == id) {
                $scope.clients[i].zones.push({'name': "Neue Zone", 'center': $scope.clients[i].coords, 'radius': 100, 'editable': true, 'visible': true, 'forbidden': "#ff0303"})
            }
        }
    };

    $scope.addClient = function(mac) {
        var newId = $scope.clients[$scope.clients.length - 1].id + 1;
        $scope.clients.push({'id': newId, 'name': "neuer Client", 'mac': mac, 'color': "ff0303", 'edit': true, 'visible': false, 'new': true, 'coords': {'latitude': 1.0, 'longitude': 1.0}, 'zones': [] });
    };

    uiGmapGoogleMapApi.then(function(maps) {

    });

    $scope.collapse = function (c) {
        $("#" + c).collapse('toggle');
        if ($("#" + c +  "-icon").hasClass("glyphicon-triangle-top")) {
            $("#" + c +  "-icon").removeClass("glyphicon-triangle-top");
            $("#" + c +  "-icon").addClass("glyphicon-triangle-bottom");
        } else {
            $("#" + c +  "-icon").addClass("glyphicon-triangle-top");
            $("#" + c +  "-icon").removeClass("glyphicon-triangle-bottom");
        }

        return false;
    }
});