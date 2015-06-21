var monitoring = angular.module('monitoring', ['uiGmapgoogle-maps', 'colorpicker.module', 'xmlmonitServices']);

monitoring.config(function (uiGmapGoogleMapApiProvider, $httpProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'geometry,visualization'
        });
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
);

monitoring.controller("controller", ['$scope', 'uiGmapGoogleMapApi', 'userService', 'positionService','zonenService' , function($scope, uiGmapGoogleMapApi, userService, positionService, zonenService) {
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
        $scope.login.password = md5($scope.login.password);

        userService.login($scope.login.username, $scope.login.password).success(function (data) {
            $scope.loggedIn = true;
            positionService.readAllDevices($scope.login.username, $scope.login.password)
                .success(
                function (data) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(data,"text/xml");

                    for (var i = 0; i < xmlDoc.getElementsByTagName("device").length; i++) {
                        var device = xmlDoc.getElementsByTagName("device")[i];

                        var zones = [];
                        var zoneNodes = device.childNodes[11].getElementsByTagName("zone");

                        for (var z = 0; z < zoneNodes.length; z++) {
                            var col;

                            if (zoneNodes[z].childNodes.item(3).firstChild.data === "true") {
                                col = $scope.forbidden;
                            } else {
                                col = $scope.notForbidden;
                            }

                            zones.push(
                                {
                                    'name': zoneNodes[z].childNodes.item(1).firstChild.data,
                                    'center': {'latitude': parseFloat(zoneNodes[z].childNodes.item(7).firstChild.data), 'longitude': parseFloat(zoneNodes[z].childNodes.item(5).firstChild.data)},
                                    'radius': parseFloat(zoneNodes[z].childNodes.item(9).firstChild.data),
                                    'forbidden': col,
                                    'editable': false,
                                    'visible': false
                                }
                            );
                        }

                        if (device.childNodes[9].hasChildNodes()) {
                            $scope.clients.push(
                                {
                                    'id': i,
                                    'name': device.childNodes.item(3).firstChild.data,
                                    'mac': device.childNodes.item(1).firstChild.data,
                                    'color': device.childNodes.item(5).firstChild.data,
                                    'coords': {'latitude': parseFloat(device.childNodes[9].childNodes[5].childNodes[0].data), 'longitude': parseFloat(device.childNodes[9].childNodes[3].childNodes[0].data)},
                                    'zones': zones,
                                    'edit': false,
                                    'visible': true,
                                    'new': false
                                });
                        } else {
                            $scope.clients.push(
                                {
                                    'id': i,
                                    'name': device.childNodes.item(3).firstChild.data,
                                    'mac': device.childNodes.item(1).firstChild.data,
                                    'color': device.childNodes.item(5).firstChild.data,
                                    'coords': {'latitude': 1, 'longitude': 1},
                                    'zones': zones,
                                    'edit': false,
                                    'visible': true,
                                    'new': true
                                });
                        }
                    }
                    poll();
                }
            )
                .error(
                function (data) {

                }
            );
        }).error(function (data) {
            alert("Bitte überprüfen Sie Benutzername und Passwort!")
        });

    };

    $scope.doRegister = function() {
        if ($scope.registerData.password === $scope.registerData.password2) {
            $scope.login.password = md5($scope.registerData.password);
            $scope.login.username = $scope.registerData.username;

            userService.registerUser($scope.login.username, $scope.login.password).success(function (data) {
                $scope.loggedIn = true;
            }).error(function (data) {
                alert("Leider ist etwas schief gelaufen, bitte versuchen Sie es später erneut!")
            });

        } else {
            alert("Die beiden Passwörter stimmen nicht überein!");
        }
    };

    $scope.clients = [/*{
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
    }*/];

    $scope.saveClient = function (client) {
        if (client.new) {
            positionService.createDevice($scope.login.username, $scope.login.password, client.mac, client.name, client.color).success(
                function (data) {
                    client.edit = false;
                }
            ).error(
                function (data) {
                    positionService.updateDevice($scope.login.username, $scope.login.password, client.mac, client.name, client.color).success(
                        function (data) {
                            client.edit = false;
                        }
                    ).error(
                        function (data) {
                            alert("Das Speichern des Clients ist fehlgeschlagen, bitte versuchen Sie später erneut!");
                        }
                    );
                }
            );
        } else {
            positionService.updateDevice($scope.login.username, $scope.login.password, client.mac, client.name, client.color).success(
                function (data) {
                    client.edit = false;
                }
            ).error(
                function (data) {
                    alert("Das Editieren des Clients ist fehlgeschlagen, bitte versuchen Sie später erneut!");
                }
            );
        }
    };

    $scope.deleteClient = function (client) {
        positionService.deleteDevice($scope.login.username, $scope.login.password, client)
            .success(
            function (data) {
                for(var i = 0; i < $scope.clients.length; i++) {
                    if ($scope.clients[i].mac == client.mac) {
                        if ($scope.clients.length == 1) {
                            $scope.clients = [];
                        } else {
                            $scope.clients.splice(i, 1);
                        }
                    }
                }
            }
        )
            .error(
            function (data) {
                alert('Das Löschen, des Clients ist fehlgeschlagen, bitte versuchen Sie es später erneut!')
            }
        );
    };

    $scope.path = {
        visible: false,
        path: [

    ]};

    $scope.addButton = function() {
        var mac = prompt("Geben Sie bitte die MAC-Adresse des neuen Geräts ein!", "00:00:00:00:00:00");
        if (mac != null) {
            $scope.addClient(mac);
        }
    };

    $scope.editZoneClick = function (zone) {
        zone.editable = true;
        zone.oldName = zone.name;
    };

    $scope.addZone = function(id) {
        for (var i = 0; i < $scope.clients.length; i++) {
            if ($scope.clients[i].id == id) {
                $scope.clients[i].zones.push({'name': "Neue Zone", 'center': $scope.map.center, 'radius': 100, 'editable': true, 'visible': true, 'forbidden': "#ff0303", 'oldName': "Neue Zone"});
                zonenService.createZone($scope.login.username, $scope.login.password, $scope.clients[i].mac, "Neue Zone", $scope.clients[i].coords.longitude, $scope.clients[i].coords.latitude, true, 100)
                    .success(function (data) {
                    })
                    .error(function (data) {
                        alert("Anlegen der Zone fehlgeschlagen, bitte versuchen Sie es später erneut!");
                    });
            }
        }
    };

    $scope.saveZone = function (zone, client) {
        zonenService.updateZone($scope.login.username, $scope.login.password, client.mac, zone.name, zone.oldName, zone.center.longitude, zone.center.latitude, zone.forbidden == $scope.forbidden, zone.radius)
            .success(
            function (data) {
                zone.editable = false;
            }
        )
            .error(
            function (data) {
                alert('Das Editieren der Zone war nicht erfolgreich, bitte versuchen Sie es später erneut!');
            }
        );
    };

    $scope.showPath = function (client) {
        positionService.readPath($scope.login.username, $scope.login.password, client)
            .success(
            function (data) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data,"text/xml");

                for (var i = 0; i < xmlDoc.getElementsByTagName("entry").length; i++) {
                    var entry = xmlDoc.getElementsByTagName("entry")[i];

                    $scope.path.path.push({'latitude': parseFloat(entry.childNodes[5].childNodes[0].data), 'longitude': parseFloat(entry.childNodes[3].childNodes[0].data)});
                }

                $scope.path.visible = true;
            }
        )
            .error();
    };

    $scope.hidePath = function () {
        $scope.path.visible = false;
        $scope.path.path = [];
    };

    $scope.logout = function () {
        $scope.clients = [];
        $scope.path = [];
        $scope.login = {};
        $scope.loggedIn = false;
    };

    var poll = function () {
        positionService.readAllDevices($scope.login.username, $scope.login.password)
            .success(
            function (data) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data,"text/xml");

                for (var i = 0; i < xmlDoc.getElementsByTagName("device").length; i++) {
                    var device = xmlDoc.getElementsByTagName("device")[i];

                    if (device.childNodes[9].hasChildNodes()) {

                    } else {
                        for (var z = 0; z < $scope.clients.length; z++) {
                            if ($scope.clients[z].mac == device.childNodes.item(1).firstChild.data) {
                                if ($scope.clients[z].coords.latitude != parseFloat(device.childNodes[9].childNodes[5].childNodes[0].data) || $scope.clients[z].coords.longitude != parseFloat(device.childNodes[9].childNodes[3].childNodes[0].data)) {
                                    $scope.clients[z].coords.latitude = parseFloat(device.childNodes[9].childNodes[5].childNodes[0].data);
                                    $scope.clients[z].coords.longitude = parseFloat(device.childNodes[9].childNodes[3].childNodes[0].data);
                                }
                            }
                        }
                    }
                }
                setTimeout(function () {poll();}, 1000)
            }
        )
            .error(
            function (data) {
                alert('Die Verbindung zum Server ist Fehlgeschlagen, bitte versuchen Sie es später erneut!')
            }
        );
    };

    $scope.deleteZone = function (zone, client) {
        zonenService.deleteZone($scope.login.username, $scope.login.password, client.mac, zone.name)
            .success(
            function (data) {
                for(var i = 0; i < $scope.clients.length; i++) {
                    if ($scope.clients[i].mac == client.mac) {
                        for (var z = 0; z < client.zones.length; z++) {
                            if (client.zones[z].name == zone.name) {
                                if ($scope.clients[i].zones.length == 1) {
                                    $scope.clients[i].zones = [];
                                } else {
                                    $scope.clients[i].zones.splice(z, 1);
                                }
                            }
                        }
                    }
                }
            }
        )
            .error(
            function (data) {
                alert("Das Löschen der Zone ist fehlgeschlagen, bitte versuchen Sie es später erneut!")
            }
        );
    };

    $scope.addClient = function(mac) {
        var newId;

        if ($scope.clients.length == 0) {
            newId = 1;
        } else {
            newId = $scope.clients[$scope.clients.length - 1].id + 1;
        }

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
}]);