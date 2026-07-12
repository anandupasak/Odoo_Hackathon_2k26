document.addEventListener("DOMContentLoaded", () => {

    // 1. Splash Screen Logic
    const splashScreen = document.getElementById("splash-screen");

    // Remove splash screen after 2.5 seconds
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500); // Wait for transition to finish
    }, 2500);

    // 2. Form Submission Simulation
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = document.getElementById("login-btn");
        const originalText = btn.innerText;
        btn.innerText = "Signing in...";
        btn.disabled = true;

        // Simulate API call and redirect
        setTimeout(() => {
            // Note: In actual implementation, role is determined from the server/JWT
            alert("Login successful! Redirecting to Dashboard...");
            btn.innerText = originalText;
            btn.disabled = false;
            loginForm.reset();
        }, 1500);
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validation check for confirm password
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("confirm-password").value;

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        alert("Employee account created successfully! Administrator will assign further roles if applicable.");
        switchForm('login');
        signupForm.reset();
        document.getElementById("strength-bar").style.width = "0%";
    });
});

// 3. Switch between Login and Signup forms
function switchForm(formType) {
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");

    if (formType === 'signup') {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
        // Add subtle fade in
        signupSection.style.animation = 'scaleIn 0.3s ease-out';
    } else {
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
        loginSection.style.animation = 'scaleIn 0.3s ease-out';
    }
}

// 4. Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.nextElementSibling;

    if (input.type === "password") {
        input.type = "text";
        btn.innerText = "🙈"; // Hide icon
    } else {
        input.type = "password";
        btn.innerText = "👁"; // Show icon
    }
}

// 5. Password Strength Calculator (Zod Regex Equivalent)
function checkPasswordStrength() {
    const password = document.getElementById("signup-password").value;
    const strengthBar = document.getElementById("strength-bar");

    let strength = 0;

    // Checks
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    // Update UI
    strengthBar.style.width = strength + "%";

    if (strength <= 25) {
        strengthBar.style.backgroundColor = "#D32F2F"; // Error Red
    } else if (strength <= 50) {
        strengthBar.style.backgroundColor = "#ED6C02"; // Warning Orange
    } else if (strength <= 75) {
        strengthBar.style.backgroundColor = "#FFEB3B"; // Yellow
    } else {
        strengthBar.style.backgroundColor = "#2E7D32"; // Success Green
    }
}