function addErrorBorder(input) {
    if (!input.classList.contains("invalid")) input.classList.add("invalid");
}

function removeErrorBorder(input) {
    if (input.classList.contains("invalid")) input.classList.remove("invalid");
}

function addErrorMessage(input) {
    let errorNode = input.nextElementSibling;

    // for confirmPassword, "*This field is required" will override "Passwords do not match"
    // for confirmPassword, "*Invalid input" does not need to be displayed
    if (input.validity.valueMissing) {
        errorNode.textContent = "*This field is required";
    } else if (input.validity.patternMismatch && input != confirmPassword) {
        errorNode.textContent = "*Invalid input";
    }
}

function removeErrorMessage(input) {
    let errorNode = input.nextElementSibling;
    errorNode.textContent = "";
}

function validateInput(input) {
    // input is either a node or an event
    // if input is an event, we want to assign the event's target as input's new value
    if (input.type === "input") {
        input = input.target
    }    

    if (!input.validity.valid) {
        addErrorBorder(input);
        addErrorMessage(input);
    } else {
        // confirmPassword only cares about matching password
        if (input === confirmPassword) return;
        removeErrorBorder(input);
        removeErrorMessage(input);
    }
}

function enableLiveValidation() {
    // add "input" event listeners to all inputs
    inputList.forEach(input => input.addEventListener("input", validateInput));

    enableLiveValidationFlag = true;
}

function comparePasswords() {
    if (password.value === confirmPassword.value) {
        passwordMatch.textContent = "";
        // confirm password border will not have a red border only if password if valid
        if (password.checkValidity()) removeErrorBorder(confirmPassword);
    } else {
        passwordMatch.textContent = "*Passwords do not match";
        addErrorBorder(confirmPassword);
    }
}

let form = document.querySelector("form");
let inputList = document.querySelectorAll("input");
let submitButton = document.querySelector("#submit-button");
let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#confirm_password");
let passwordRequirements = document.querySelector("#password-requirements");
let passwordMatch = document.querySelector("#confirm_password + div");
let passwordChar = document.querySelector("#password-char");
let passwordUpper = document.querySelector("#password-upper");
let passwordLower = document.querySelector("#password-lower");
let passwordDigit = document.querySelector("#password-digit");

// this flag is used to denote if the enableLiveValidation function has been called
let enableLiveValidationFlag = false;

submitButton.addEventListener("click", e => {
    // this function adds event listeners to inputs to check for live validation after first form submission
    if (enableLiveValidationFlag === false) enableLiveValidation();

    // if form is valid and password inputs match, form will be submitted
    if (form.checkValidity() && password.value === confirmPassword.value) return;

    // if form is invalid, check the validity for each input
    if (!form.checkValidity()) inputList.forEach(input => validateInput(input));
    
    // prevents form from being submitted
    e.preventDefault();
});

password.addEventListener("focus", () => {
    // will display password requirements when password is focused for the first time
    passwordRequirements.style.display = "block"
    removeEventListener("focus", password);
});

password.addEventListener("input", () => {
    // validating password constraints and updating validation message
    let upper = /[A-Z]/;
    let lower = /[a-z]/;
    let digit = /\d/;
    passwordUpper.textContent = upper.test(password.value) ? passwordUpper.textContent.replace("X", "✓") : passwordUpper.textContent.replace("✓", "X"); 
    passwordLower.textContent = lower.test(password.value) ? passwordLower.textContent.replace("X", "✓") : passwordLower.textContent.replace("✓", "X"); 
    passwordDigit.textContent = digit.test(password.value) ? passwordDigit.textContent.replace("X", "✓") : passwordDigit.textContent.replace("✓", "X"); 
    if (password.value.length >= 8 && password.value.length <= 20) {
        passwordChar.textContent = passwordChar.textContent.replace("X", "✓");
    } else {
        passwordChar.textContent = passwordChar.textContent.replace("✓", "X");
    }

    if (password.checkValidity()) removeErrorBorder(password);
    else addErrorBorder(password);
});

confirmPassword.addEventListener("input", comparePasswords);