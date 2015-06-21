/**
 * Created by Daniel on 19.06.2015.
 */

var xmlmonitServices = angular.module('xmlmonitServices', []);

var serverLocation = "http://xmlmonit.koding.io:8080/exist/positiontrack";

xmlmonitServices.factory('userService', ['$http',
    function ($http) {
        var userService = {
            registerUser : function(user, password) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/createUser",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            },
            login: function(user, password) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/login",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            }
        };

        return userService;
    }
]);

xmlmonitServices.factory('positionService', ['$http',
    function ($http) {
        var positionService = {
            readAllDevices: function (username, password) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/readDevice",
                    data: "<data><user><username>" + username + "</username><userpassword>" + password + "</userpassword></user><device></device></data>",
                    headers: {
                        "Content-Type": "application/xml"
                    }
                });
            },
            readDevice: function (username, password, mac) {

            },
            readPath: function (username, password, client) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/readPath",
                    data: "<data><user><username>" + username + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + client.mac + "</clientMac></device></data>",
                    headers: {
                        "Content-Type": "application/xml"
                    }
                });
            },
            createDevice : function(user, password, mac, devicename, color) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/createDevice",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac><name>" + devicename + "</name><color>" + color + "</color></device></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            },
            updateDevice : function(user, password, mac, devicename, color) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/updateDevice",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac></device><update><name>" + devicename + "</name><color>" + color + "</color></update></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            },
            deleteDevice : function(user, password, client) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/deleteDevice",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + client.mac + "</clientMac></device></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            }
        };

        return positionService;
    }
]);

xmlmonitServices.factory('zonenService', ['$http',
    function ($http) {
        var zonenService = {
            createZone : function(user, password, mac, name, longitude, latitude, restricted, radius) {
                return $http({
                    method: "POST",
                    url: serverLocation + "/createZone",
                    data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac></device><zone><name>" + name + "</name><restricted>" + restricted + "</restricted><longitude>" + longitude +"</longitude><latitude>" + latitude +"</latitude><radius>" + radius + "</radius></zone></data>",
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            },
            updateZone : function(user, password, mac, name, oldname, longitude, latitude, restricted, radius) {
                var data;

                if (name == oldname) {
                    data = "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac></device><zone><name>" + oldname + "</name></zone><update><restricted>" + restricted + "</restricted><longitude>" + longitude +"</longitude><latitude>" + latitude +"</latitude><radius>" + radius + "</radius></update></data>";
                } else {
                    data = "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac></device><zone><name>" + oldname + "</name></zone><update><name>" + name + "</name><restricted>" + restricted + "</restricted><longitude>" + longitude +"</longitude><latitude>" + latitude +"</latitude><radius>" + radius + "</radius></update></data>";
                }

                return $http({
                    method: "POST",
                    url: serverLocation + "/updateZone",
                    data: data,
                    headers: {
                        "Content-Type" : "application/xml"
                    }
                });
            },
            deleteZone : function(user, password, mac, name) {
            return $http({
                method: "POST",
                url: serverLocation + "/deleteZone",
                data: "<data><user><username>" + user + "</username><userpassword>" + password + "</userpassword></user><device><clientMac>" + mac + "</clientMac></device><zone><name>" + name + "</name></zone></data>",
                headers: {
                    "Content-Type" : "application/xml"
                }
            });
        }
        };

        return zonenService;
    }
]);