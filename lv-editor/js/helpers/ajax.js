define(
    function () {
        var SELF = null;

        var _private = {
            postComplete: function () {
                console.log('post ajax complete, change stuff in the DOM');
            }
        };

        var _events = {
            postComplete: function (e) {
                if (this.readyState === 4) {
                    _private.postComplete();
                    console.log(this, e);
                }
            }
        };

        var ajax = {
            init: function () {
                if (SELF !== null) {
                    return SELF;
                }

                SELF = this;

                return this;
            },

            postData: function (myData, url) {
                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = _events.postComplete;
                httpRequest.open('POST', url, true);
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                httpRequest.send(JSON.stringify(myData));
            }
        };

        return ajax.init();
    }
);