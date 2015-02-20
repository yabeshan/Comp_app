define([],
    function() {

        var isLocal = location.hostname == 'localhost';

        return {
            server: {
                url: isLocal ? 'http://localhost:54533/v1/' : 'http://api.cyberianconcepts.com/v1/',
                version: 1,
                domain: location.hostname,
                protocol: location.protocol
            }
        };
    });