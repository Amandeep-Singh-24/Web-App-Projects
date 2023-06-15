function validateForm() { // prevent user from submitting if not valid
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
  
    return isUsernameValid && isPasswordValid && isConfirmPasswordValid;
  }

  document.getElementById("registration-form").addEventListener("submit", function(ev) {
    if (!validateForm()) {
      ev.preventDefault(); // prevents user from submitting if errors in form
    }
  });

function validateUsername(){
    const username = document.getElementById("username").value;
    const userError = document.getElementById("usernameError");

    let errorMessage = "";  // error message will build up based off multiple errors

    if(!(/[a-zA-Z]/.test(username.charAt(0)))){ // check to see if begins with a-z
        errorMessage += "-Username must begin with an A-Z character!<br>";
    }
    if(username.length < 3){
        errorMessage += "-Username must be atleast 3 characters long!";
    }
    usernameError.innerHTML = errorMessage;
    return errorMessage === "";
}

function validatePassword(){
    const password = document.getElementById("password").value;
    const passError = document.getElementById("passwordError");

    let errorMessage = "";

    if(password.length < 8){
        errorMessage += "-Password must be atleast 8 characters long!<br>";
    }
    if(!(/[A-Z]/.test(password))){
        errorMessage += "-Password must contain atleast 1 upper case character!<br>";
    }
    if(!(/[/ * - + ! @ # $ ^ & ~ [\]]/.test(password))){    // [\]] is needed to show the ] character
        errorMessage += "-Password must contain atleast 1 special character / * - + ! @ # $ ^ & ~ [ ]<br>";
    }
    if(!/\d/.test(password)){   // /\d/ is to see if it contains a nymver
        errorMessage += "-Password must contain atleast 1 number!";
    }
    passwordError.innerHTML = errorMessage;
    return errorMessage === "";
}

function validateConfirmPassword(){
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password").value;
    const confirmError = document.getElementById("confirmPasswordError");

    if(password !== confirmPass){   // password and confirmPass aren't equal
        confirmError.innerHTML = "-Passwords do not match!";
        return false;
    }
    else{
    confirmError.innerHTML = "";
    return true;
    }
}