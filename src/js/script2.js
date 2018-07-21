

// requestAnimationFrame polyfill by Erik Möller. 

var lastTime = 0;
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };


    // end of  requestAnimationFrame polyfill 




var PIXELATION = 15;

var items = document.querySelectorAll('.pixelate'),
    _objs = [];

var Images = function( element, image, canvas, context ) {
    this.element    = element;
    this.image      = image;
    this.canvas     = canvas;
    this.context    = context;
    this.pixelation = 1;
}

Images.prototype.bindLoad = function() {
    var obj = this;

    this.image.onload = function() {
        obj.reportLoad.call(obj);
    };

  if ( this.image.complete ) {
        this.image.onload();
    }
}

// Images.prototype.reportLoad = function() {
//     var obj = this;

//     this.imageWidth    = this.canvas.width   = this.image.width;
//     this.imageHeight   = this.canvas.height  = this.image.height;
//     this.context.drawImage( this.image, 0, 0 );

//     this.element.addEventListener('mouseover', function() {
//         obj.mouseOver();
//     }, false);

//     this.element.addEventListener('mouseout', function() {
//         obj.mouseOut();
//     }, false);
// }



Images.prototype.reportLoad = function() {
    var obj = this;

    this.imageWidth    = this.canvas.width   = this.image.naturalWidth;
    this.imageHeight   = this.canvas.height  = this.image.naturalHeight;
    this.context.drawImage( this.image, 0, 0 );
    obj.mouseOver();
    let scrolling = true;
    window.addEventListener('scroll', function() {

        if (obj.isInViewport() && scrolling) {
            obj.mouseOut();
            scrolling = false;
            

        } 


    }, false);



            this.element.addEventListener('mouseover', function() {
        obj.mouseOver();
    }, false);

    this.element.addEventListener('mouseout', function() {
        obj.mouseOut();
    }, false);







    // this.element.addEventListener('mouseout', function() {
    //     obj.mouseOut();
    // }, false);

   


}

Images.prototype.isInViewport = function() {
    var obj = this;
    var bounding = this.image.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}



Images.prototype.mouseOver = function() {
    var obj = this;
    cancelAnimationFrame( obj.idUndraw );
    var draw = function() {
        if ( obj.pixelation >= PIXELATION ) {
            cancelAnimationFrame( obj.idDraw );
            obj.pixelation = PIXELATION;
        } else {
            obj.context.drawImage( obj.image, 0, 0, obj.imageWidth, obj.imageHeight, 0, 0, obj.imageWidth, obj.imageHeight);
            obj.pixelate( obj.imageWidth, 0, 0, obj.imageHeight );
            obj.idDraw = requestAnimationFrame( draw, obj.context );
        }
    };
    obj.idDraw = requestAnimationFrame( draw, obj.context );
}

Images.prototype.mouseOut = function() {
    var obj = this;
    cancelAnimationFrame( obj.idDraw );
    var undraw = function() {
        if ( obj.pixelation < 1 ) {
            cancelAnimationFrame( obj.idUndraw );
            obj.pixelation = 1;
        } else {
            obj.context.drawImage( obj.image, 0, 0 );
            obj.depixelate( obj.imageWidth, obj.imageHeight, 0, 0 );
            obj.idUndraw = requestAnimationFrame( undraw, obj.context );
        }
    };
    obj.idUndraw = requestAnimationFrame( undraw, obj.context );
}

Images.prototype.setPixels = function() {
    var sw          = this.imageWidth,
        sh          = this.imageHeight,
        imageData   = this.context.getImageData( 0, 0, sw, sh ),
        data        = imageData.data,
        y, x, n, m;

    for ( y = 0; y < sh; y += this.pixelation ) {
        for ( x = 0; x < sw; x += this.pixelation ) {

            var red = data[((sw * y) + x) * 4];
            var green = data[((sw * y) + x) * 4 + 1];
            var blue = data[((sw * y) + x) * 4 + 2];

            for ( n = 0; n < this.pixelation; n++ ) {
                for ( m = 0; m < this.pixelation; m++ ) {
                    if ( x + m < sw ) {
                        data[((sw * (y + n)) + (x + m)) * 4] = red;
                        data[((sw * (y + n)) + (x + m)) * 4 + 1] = green;
                        data[((sw * (y + n)) + (x + m)) * 4 + 2] = blue;
                    }
                }
            }
        }
    }

    this.context.putImageData( imageData, 0, 0 );
}

Images.prototype.pixelate = function() {
    this.setPixels();
    this.pixelation += 1;
}

Images.prototype.depixelate = function() {
    this.setPixels();
    this.pixelation -= 1;
}

Array.prototype.slice.call(items, 0).forEach(function(el, i) {
    var element = el;
        image   = el.querySelector('img'),
        canvas  = document.createElement('canvas'),
        context = canvas.getContext('2d');

    el.appendChild( canvas );

    _objs.push( new Images( element, image, canvas, context ) );
    _objs[i].bindLoad();
});



    // var element = items,
    //     image   = document.querySelector('img'),
    //     canvas  = document.createElement('canvas'),
    //     context = canvas.getContext('2d');

    // items.appendChild( canvas );

    //  let img = new Images( element, image, canvas, context );
    // img.bindLoad();

