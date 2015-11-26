var Slider = new function () {
    var images = [], timer,currentObj,currentIndex=-1;
    function animate() {
        currentIndex == -1 && (currentIndex += images.length);
        currentIndex == images.length && (currentIndex = 0);
        var nextObj = images[currentIndex];
        if(nextObj!=currentObj)
        {
            currentObj.elm.fadeTo('slow', 0.5, function (e) {
                $(this).hide();
                nextObj.elm.show().fadeTo('slow', 1);
            });
            currentObj = nextObj;
        }
    };
    function next() {
        currentIndex++;
        animate();
    };
    this.Bind = function (container) {
        var elms = container.find('img');
        $(elms.hide()[0]).show();
        for(var i=0;i<elms.length;i++)
        {
            images.push({ elm: $(elms[i]) });
        }
        currentObj = images[0];
        timer = setInterval(function () {
            next();
        }, 4000);
    };
};

