const navigation = document.querySelector('.nav');
const menuButton = document.querySelector('.nav__burger');
const navigationMenu = document.querySelector('.nav__menu');
const sections = [...document.querySelectorAll("section[id]")];
const links = [...document.querySelectorAll('.nav__link')];
const menuHeigh = document.getElementById('nav').getBoundingClientRect().height;


window.addEventListener('scroll', ()=> {

    if (this.scrollY >= 300) {
        navigation.classList.add('color')
    } else {
        navigation.classList.remove('color')
    }


    sections.forEach(section => {

        let sectionId = section.getAttribute('id');
        let topPosition = section.offsetTop - menuHeigh * 5;
        

        if ((topPosition) <= Math.round(window.scrollY)) {

            if (document.querySelector('.active') !== null) {
                document.querySelector('.active').classList.remove('active');
            }
            document.querySelector(`a[href*='${sectionId}']`).classList.add('active')
            
        }
    })


})

const scrollToElement = element => {
    const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
    let options = {
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - menuHeigh * 2.2
    }
    isSmoothScrollSupported ? window.scrollTo(options) : window.scrollTo(options.left, options.top);
}


const scrollOnClick = event => {

    event.preventDefault();
    let elHref = (event.target).getAttribute('href');
    if(event.target.tagName.toLowerCase() === 'img') {
        console.log('tak');
        // event.target = event.target.parentElement;
        elHref = "#home";

    }
    console.log(event.target);
    console.log(elHref);
    let elementId = elHref.slice(1, elHref.length);
    let element = document.getElementById(elementId);

    scrollToElement(element)
}



links.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref !== '#') {
        link.addEventListener('click', scrollOnClick.bind(link))
    }
})

menuButton.addEventListener('click', ()=> {
    menuButton.classList.toggle('open');
    navigationMenu.classList.toggle('visible-menu');

})