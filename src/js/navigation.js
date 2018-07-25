const navigation = document.querySelector('.nav');
const menuButton = document.querySelector('.nav__burger');
const navigationMenu = document.querySelector('.nav__menu');


window.addEventListener('scroll', ()=> {

    if (this.scrollY >= 300) {
        navigation.classList.add('color')
    } else {
        navigation.classList.remove('color')
    }


})

menuButton.addEventListener('click', ()=> {
    menuButton.classList.toggle('open');
    navigationMenu.classList.toggle('visible-menu');

})