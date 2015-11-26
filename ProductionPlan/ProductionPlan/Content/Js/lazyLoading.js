var LazyLoading = new function () {
    var that = this;
    var totalFile = 0, loadedFile = 0, finalFunc;
    var urlList = {};

    function callBack() {
        loadedFile++;
        if (totalFile == loadedFile) {
            finalFunc();
        }
    };

    function loadCssFile(urlToLoad, func) {
        if (!urlList[urlToLoad]) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = Global.BaseUrl + urlToLoad;
            document.getElementsByTagName("head")[0].appendChild(link);
            link.onload = callBack;
            urlList[urlToLoad] = true;
        } else {
            callBack();
        }
    };

    function loadJsFile(urlToLoad, func) {
        if (!urlList[urlToLoad]) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = Global.BaseUrl + urlToLoad;
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onload = callBack;
            urlList[urlToLoad] = true;
        } else {
            callBack();
        }
    };

    this.Load = function (urlCollections, func) {
        loadedFile = 0;
        totalFile = urlCollections.length;
        if (totalFile) {
            finalFunc = func || function () { };
            for (var i = 0; i < totalFile; i++) {
                var urlString = urlCollections[i];
                var ext = urlString.split('.').pop().toLowerCase();
                ext == 'css' ? loadCssFile(urlString, func) : loadJsFile(urlString, func);
            }
        }
    }
};
