define(
    function () {
        var SELF = null;

        var ajax = {
            getData: function (url, callback) {
                var httpRequest = new XMLHttpRequest();

                httpRequest.onreadystatechange = function (e) {
                    if (this.readyState === 4) {
                        callback(e);
                    }
                };

                httpRequest.open('GET', url, true);
                httpRequest.send();
            }

            //postData: function (myData, url) {
            //    var httpRequest = new XMLHttpRequest();
            //    httpRequest.onreadystatechange = _events.postComplete;
            //    httpRequest.open('POST', url, true);
            //    httpRequest.setRequestHeader('Content-Type', 'application/json');
            //    httpRequest.send(JSON.stringify(myData));
            //}
        };

        return ajax;
    }
);