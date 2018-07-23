const requiredInputs = document.querySelectorAll('[required]');
const stringPattern = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+(?:[\s-][a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+)*$/i;
const mailPattern = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/i;



const showFieldValidation = (input, inputIsValid) => {
    if (inputIsValid == false) {
        input.classList.add('validate-warning');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.add('visible');
        }
    } else {
        input.classList.remove('validate-warning');
        if (input.nextElementSibling !== null) {
            input.nextElementSibling.classList.remove('visible');
        }
    }
}

const validateInput = (input, reg) => {
    let inputIsValid = true;
    if(reg !== undefined) {
        if (!reg.test(input.value) || input.value === '') {
            inputIsValid = false;
        }
    } else {
        if(input.value === '')
        inputIsValid = false;
    }
    if (inputIsValid) {
        showFieldValidation(input, true);
        return true;
    } else {
        showFieldValidation(input, false);
        return false;
    }
}






const saveToLocalStorage = (input) => {
        localStorage.setItem(input.name, input.value); 
}

const loadFromLocalStorage = () => {
    [...requiredInputs].forEach(input => {
        const inputValue = localStorage.getItem(input.name);
        const inputChecked = localStorage.getItem('checkedInput');
        input.value = inputValue;
    })
}


const validateForm = () => {
    [...requiredInputs].forEach(input => {
        if (input.nodeName.toLowerCase() === 'input' || input.nodeName.toLowerCase() === 'textarea') {
            const inputType = input.type.toLowerCase();
            const inputName = input.name.toLowerCase();;

            input.addEventListener('input', () => {
                saveToLocalStorage(event.target);
            })
            if (inputType == 'text') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, stringPattern);
                })
            }
            if (inputType == 'email') {
                input.addEventListener('input', (event) => {
                    validateInput(event.target, mailPattern)
                })
            }
            // if (inputName == 'message' ) {
            //     validateInput(event.target, stringPattern);
            // }
           
        }
    })
}

const checkFormbeforeSending = (event) => {
    event.preventDefault();
    let formIsCorrect = true;
    [...requiredInputs].forEach(input => {
        if (input.nodeName.toLowerCase() === 'input' || input.nodeName.toLowerCase() === 'textarea' ) {
            const inputType = input.type.toLowerCase();
            // const inputName = input.name;
            if (inputType == 'text' && validateInput(input, stringPattern) == false) {
                formIsCorrect = false;
            }
            if (inputType == 'email' && validateInput(input, mailPattern) == false) {
                formIsCorrect = false;
            }
            // if (inputName == 'message' && validateInput(input, stringPattern) == false) {
            //     formIsCorrect = false;
            // }
        }
    })
    if (formIsCorrect) {
        event.target.submit()
    } else {
        return false;
    }
}


document.querySelector('.contact__form').addEventListener('submit', (event) => {
    checkFormbeforeSending(event);
})

document.addEventListener("DOMContentLoaded", () => {
    validateForm();
    loadFromLocalStorage()
})