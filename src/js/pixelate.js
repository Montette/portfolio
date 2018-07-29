// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel 
// MIT license


var lastTime = 0;
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };


var lastTime = 0;
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
            timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };


// end of requestAnimationFrame polyfill 




const maxPixelation = 15;

const items = document.querySelectorAll('.pixelate'),
objects = [];

class Images {
    constructor(element, image, canvas, context) {
        this.element = element;
        this.image = image;
        this.canvas = canvas;
        this.context = context;
        this.pixelation = 1;
    }
    startLoad() {
        this.image.onload = () => {
            this.reportLoad();
        }
        if (this.image.complete) {
            this.image.onload()
        }
    }

    reportLoad() {
        this.imageWidth = this.canvas.width = this.image.naturalWidth;
        this.imageHeight = this.canvas.height = this.image.naturalHeight;
        this.context.drawImage(this.image, 0, 0);
        this.mouseEnter();
        let scrolling = true;
        window.addEventListener('scroll', () => {
            if (this.isInViewport() && scrolling) {
                this.mouseLeave();
                scrolling = false;
            }
        }, false);

        this.element.addEventListener('mouseenter', () => {
            this.mouseEnter();
        }, false);

        this.element.addEventListener('mouseleave', () => {
            this.mouseLeave();

        }, false);

    }

    isInViewport() {
        let bounding = this.image.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    mouseEnter() {
        cancelAnimationFrame(this.idUndraw);
        const draw = () => {
            if (this.pixelation >= maxPixelation) {
                cancelAnimationFrame(this.idDraw);
                this.pixelation = maxPixelation;
            } else {
                this.context.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, 0, 0, this.imageWidth, this.imageHeight);
                this.pixelate(this.imageWidth, 0, 0, this.imageHeight);
                this.idDraw = requestAnimationFrame(draw, this.context);
            }
        };
        this.idDraw = requestAnimationFrame(draw, this.context);
    }

    mouseLeave() {
        cancelAnimationFrame(this.idDraw);
        const undraw = () => {
            if (this.pixelation < 1) {
                cancelAnimationFrame(this.idUndraw);
                this.pixelation = 1;
            } else {
                this.context.drawImage(this.image, 0, 0);
                this.depixelate(this.imageWidth, this.imageHeight, 0, 0);
                this.idUndraw = requestAnimationFrame(undraw, this.context);
            }
        };
        this.idUndraw = requestAnimationFrame(undraw, this.context);
    }

    setPixels() {
        let width = this.imageWidth,
            height = this.imageHeight,
            imageData = this.context.getImageData(0, 0, width, height),
            data = imageData.data,
            y, x, n, m;

        for (y = 0; y < height; y += this.pixelation) {
            for (x = 0; x < width; x += this.pixelation) {

                let red = data[((width * y) + x) * 4];
                let green = data[((width * y) + x) * 4 + 1];
                let blue = data[((width * y) + x) * 4 + 2];

                for (n = 0; n < this.pixelation; n++) {
                    for (m = 0; m < this.pixelation; m++) {
                        if (x + m < width) {
                            data[((width * (y + n)) + (x + m)) * 4] = red;
                            data[((width * (y + n)) + (x + m)) * 4 + 1] = green;
                            data[((width * (y + n)) + (x + m)) * 4 + 2] = blue;
                        }
                    }
                }
            }
        }

        this.context.putImageData(imageData, 0, 0);
    }

    pixelate(){
        this.setPixels();
        this.pixelation += 1;
    }

    depixelate(){
        this.setPixels();
        this.pixelation -= 1;
    }
}


[...items].forEach((element, index)=> {
    const image = element.querySelector('img');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    element.appendChild(canvas);
    objects.push(new Images(element, image, canvas, context));
    objects[index].startLoad();
});

