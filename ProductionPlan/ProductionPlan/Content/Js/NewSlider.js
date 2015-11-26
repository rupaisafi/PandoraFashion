var Slider = new function () {
    var images = [], timer, currentObj, currentIndex = -1,caption;
    function animate() {
        currentIndex == -1 && (currentIndex += images.length);
        currentIndex == images.length && (currentIndex = 0);
        var nextObj = images[currentIndex];
        if (nextObj != currentObj) {
            nextObj.elm.css({ left: '-100%' });
            caption.animate({top:'-100%'},400);
            currentObj.elm.animate({ left: '100%' }, 600, function () { console.log(1) });
            nextObj.elm.animate({ left: '0px' }, 600, function () { caption.animate({ top: '0px' }, 600); });
            currentObj = nextObj;
        }
    };
    function next() {
        currentIndex++;
        animate();
    };
    this.Bind = function (container) {
        var elms = container.find('img');
        for (var i = 0; i < elms.length; i++) {
            images.push({ elm: $(elms[i]) });
        }
        currentObj = images[0];
        caption = container.find('.slider_caption');
        timer = setInterval(function () {
            next();
        }, 4000);
    };
};

