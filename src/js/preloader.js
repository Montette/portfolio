const preload = document.querySelector('.preloader');

preload.classList.add('show-preloader');
document.querySelector('body').style.overflow = 'hidden';

window.addEventListener('load', function () {
        preload.classList.remove('show-preloader');
        document.querySelector('body').style.overflow = 'visible';
});