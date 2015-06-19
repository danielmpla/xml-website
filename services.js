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
            }
        };

        return positionService;
    }
]);