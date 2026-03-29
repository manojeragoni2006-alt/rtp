function login() {

    let username = document.getElementById("loginUser").value;
    let password = document.getElementById("loginPass").value;

    if (username === "srishanth" && password === "1234") {

        localStorage.setItem("role", "admin");
        localStorage.setItem("loggedInUser", "admin");

        window.location.href = "index.html";

    }
    else if (username !== "" && password !== "") {

        localStorage.setItem("role", "user");
        localStorage.setItem("loggedInUser", username);

        window.location.href = "index.html";

    }
    else {

        alert("Please enter username and password");

    }

}
// --- LOGIN FUNCTION ---
function login() {
    // We are using the updated IDs from your HTML!
    let usernameInput = document.getElementById("loginUser").value;
    let passwordInput = document.getElementById("loginPass").value;
    let msg = document.getElementById("msg");

    // 1. Check for Admin Login
    if (usernameInput === "srishanth" && passwordInput === "1234") {
        localStorage.setItem("role", "admin");
        localStorage.setItem("loggedInUser", "admin");
        window.location.href = "index.html";
        return;
    }

    // 2. Fetch registered users from Local Storage
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // 3. Check if the user exists and the password matches
    let validUser = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (validUser) {
        // Success! Log them in.
        localStorage.setItem("role", "user");
        localStorage.setItem("loggedInUser", usernameInput);
        window.location.href = "index.html";
    } else if (usernameInput === "" || passwordInput === "") {
        msg.innerText = "Please enter both username and password.";
    } else {
        // Fail! Wrong username or password.
        msg.innerText = "Invalid username or password. Please try again or register.";
    }
}

// --- REGISTER FUNCTION ---
function register() {
    let newUser = document.getElementById("regUser").value;
    let newPass = document.getElementById("regPass").value;
    let msg = document.getElementById("msg");

    // 1. Make sure they didn't leave it blank
    if (newUser === "" || newPass === "") {
        msg.innerText = "Please enter both a username and password.";
        msg.style.color = "red";
        return;
    }

    // 2. Get existing users from Local Storage (or create an empty list)
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // 3. Check if that username is already taken
    let userExists = users.find(u => u.username === newUser);
    
    if (userExists) {
        msg.innerText = "Username already exists. Please pick another one.";
        msg.style.color = "red";
        return;
    }

    // 4. Save the new user to Local Storage
    users.push({ username: newUser, password: newPass });
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    // 5. Show success message and clear the boxes
    msg.innerText = "Registration successful! You can now click Login.";
    msg.style.color = "green";
    
    document.getElementById("regUser").value = "";
    document.getElementById("regPass").value = "";
}