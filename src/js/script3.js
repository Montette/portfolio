var PIXELATION = 15;

var photoContainer = document.querySelector('.parent');
const image = document.querySelector('img.about__photo');
let imgPixelation = 1;
const maxPixelation = 15;
let idUndraw,
idDraw;

let canvas;
let context;
let imageWidth;
let imageHeight;

// var element = photoContainer,
// image   = document.querySelector('img'),






// canvas  = document.createElement('canvas');
//     let imageWidth = canvas.width = image.width;
//     let imageHeight = canvas.height = image.height;

// context = canvas.getContext('2d');

// photoContainer.appendChild( canvas );





    

const setPixels = function() {
    var sw          = imageWidth,
        sh          = imageHeight,
        imageData   = context.getImageData( 0, 0, sw, sh ),
        data        = imageData.data,
        y, x, n, m;

    for ( y = 0; y < sh; y += imgPixelation ) {
        for ( x = 0; x < sw; x += imgPixelation ) {

            var red = data[((sw * y) + x) * 4];
            var green = data[((sw * y) + x) * 4 + 1];
            var blue = data[((sw * y) + x) * 4 + 2];

            for ( n = 0; n < imgPixelation; n++ ) {
                for ( m = 0; m < imgPixelation; m++ ) {
                    if ( x + m < sw ) {
                        data[((sw * (y + n)) + (x + m)) * 4] = red;
                        data[((sw * (y + n)) + (x + m)) * 4 + 1] = green;
                        data[((sw * (y + n)) + (x + m)) * 4 + 2] = blue;
                    }
                }
            }
        }
    }

    context.putImageData( imageData, 0, 0 );
}



const pixelate = function() {
    setPixels();
    imgPixelation += 1;
}

const depixelate = function() {
    setPixels();
    imgPixelation -= 1;
}











const mouseOut = () => {
    cancelAnimationFrame( idDraw );
    var undraw = function() {
        if ( imgPixelation < 1 ) {
            cancelAnimationFrame( idUndraw );
            imgPixelation = 1;
        } else {
            context.drawImage( image, 0, 0 );
            depixelate( imageWidth,imageHeight, 0, 0 );
             idUndraw = requestAnimationFrame( undraw, context );
        }
    };
    idUndraw = requestAnimationFrame( undraw, context );
}


const mouseOver = () => {

    cancelAnimationFrame( idUndraw );
    var draw = function() {
        if ( imgPixelation >= maxPixelation ) {
            cancelAnimationFrame(idDraw );
            imgPixelation = maxPixelation;
        } else {
            context.drawImage( image, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
            pixelate( imageWidth, 0, 0, imageHeight );
             idDraw = requestAnimationFrame( draw, context );
        }
    };
     idDraw = requestAnimationFrame( draw, context );
}



// const isInViewport = () => {
  
//     var bounding = image.getBoundingClientRect();
    
//     return (
//         bounding.top >= 0 &&
//         bounding.left >= 0 &&
//         bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
// }

const isInViewport = () => {
    var viewportHeight = document.querySelector('.about').clientHeight;
    var bounding = image.getBoundingClientRect().top;
    return (
        bounding > viewportHeight/3 && bounding < viewportHeight/2.2
    );
}


// document.addEventListener('DOMContentLoaded', ()=> {
//     mouseOver();
    
// })


window.addEventListener('scroll', function () {
    let scrolling = true;

    // if (isInViewport() && scrolling) {
    //     setTimeout(() => {
    //         mouseOut(); 
    //     }, 1000);
        
    //     scrolling = false;
    // }

    if(isInViewport() && scrolling)  {

        mouseOut();
        scrolling = false;
        console.log('juz')
    }

}, false);



// window.addEventListener('scroll', function () {
   

//     if (isInViewport()) {
//         mouseOut();
        
//     } else{
//         mouseOver();
        
//     }

// }, false);







photoContainer.addEventListener('mouseover', function () {
    mouseOver();
}, false);

photoContainer.addEventListener('mouseout', function () {
    mouseOut();
}, false);









image.onload = () => {
    

    

    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
     imageWidth = canvas.width = image.width;
     imageHeight = canvas.height = image.height;
    // context.drawImage(image, 0, 0);

    // setPixels();

    photoContainer.appendChild(canvas);
    context.drawImage(image, 0, 0);
    mouseOver();

}

if(image.complete) {
    image.onload()
}


var preload = document.querySelector('.preloader');

preload.classList.add('show-preloader');
document.querySelector('body').style.overflow = 'hidden';

window.addEventListener('load', function () {
    setTimeout(function () {
        preload.classList.remove('show-preloader');
        document.querySelector('body').style.overflow = 'visible';
    }, 4000);
});