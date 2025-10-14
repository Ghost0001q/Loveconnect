document.querySelector(".email").addEventListener("click", () => {
    document.querySelector(".login-form").style.display = "none";
    document.querySelector(".signup-form").style.display = "block";
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".signup-form").style.display = "none";
        document.querySelector(".signin-form").style.display = "none";
        document.querySelector(".login-form").style.display = "block";
    });
});

document.querySelector("#LogInLink").addEventListener("click", () => {
    document.querySelector(".signup-form").style.display = "none";
    document.querySelector(".signin-form").style.display = "block";
});

document.querySelector("#SignUpLink").addEventListener("click", () => {
    document.querySelector(".signin-form").style.display = "none";
    document.querySelector(".signup-form").style.display = "block";
});


document.querySelectorAll(".input-group input").forEach(input => {
    input.addEventListener("input", function () {
        validateInput(this);
    });
});

function validateInput(input) {
    let isValid = true;

    if (input.type === "text") {
        isValid = input.value.trim().length >= 3;
    } else if (input.type === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    } else if (input.type === "password") {
        isValid = input.value.length >= 6;
    }

    input.classList.remove("valid", "invalid");

    if (isValid) {
        input.classList.add("valid");
    } else {
        input.classList.add("invalid");
    }
}

// Redirect with loading overlay for Sign Up and Log In (mock)
function showLoadingAndRedirect() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
        // hide overlay briefly then redirect
        overlay.style.display = 'none';
        window.location.href = 'index.html';
    }, 2500); // 2.5 seconds
}

document.getElementById('signupBtn').addEventListener('click', function(e){
    e.preventDefault();
    // simple validation before redirect (ensure fields valid)
    const inputs = document.querySelectorAll('.signup-form .input-group input');
    let ok = true;
    inputs.forEach(i => { validateInput(i); if (!i.classList.contains('valid')) ok = false; });
    if(!ok){
        alert('Please fill in valid details (name ≥3 chars, valid email, password ≥6 chars).');
        return;
    }
    showLoadingAndRedirect();
});

document.getElementById('loginBtn').addEventListener('click', function(e){
    e.preventDefault();
    // allow login even without validation for mock, but show loading
    showLoadingAndRedirect();
});

// Continue with Google - mock redirect too
document.querySelector('.google').addEventListener('click', function(){
    showLoadingAndRedirect();
});
