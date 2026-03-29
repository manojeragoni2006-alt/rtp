// ==========================================
// 1. FIREBASE SETUP
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBAmQ1hzQTPVTGdll3-qJTZyoIo4zpNz_k",
  authDomain: "mrdu-lost-and-found.firebaseapp.com",
  projectId: "mrdu-lost-and-found",
  storageBucket: "mrdu-lost-and-found.firebasestorage.app",
  messagingSenderId: "57699372306",
  appId: "1:57699372306:web:dfe5ab9b5f42118732f7cb"
};
  
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
  
// ==========================================
// 2. REAL-TIME CLOUD LISTENER
// ==========================================
let items = []; // Empty list to hold data
  
// This automatically grabs data from the cloud and updates the screen!
db.collection("lostfoundItems").onSnapshot((querySnapshot) => {
    items = []; 
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id; // We need this ID to delete items later!
        items.push(data);
    });
    displayItems();
    updateDashboard();
});
  
// ==========================================
// 3. ADD ITEM TO CLOUD
// ==========================================
function addItem() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let item = document.getElementById("item").value;
    let type = document.getElementById("type").value;
    let description = document.getElementById("description").value;
    let photo = document.getElementById("photo").files[0];
  
    if (name === "" || phone === "" || item === "") {
        alert("Please fill all required fields");
        return;
    }
  
    function saveToCloud(imageURL) {
        let newItem = { name, phone, item, type, description, photo: imageURL };
  
        // Sends the item to Google Firestore
        db.collection("lostfoundItems").add(newItem)
        .then(() => {
            document.getElementById("message").innerHTML = "✅ Item saved to the cloud successfully!";
            checkMatch(newItem);
            clearForm();
        })
        .catch((error) => console.error("Error adding document: ", error));
    }
  
    if (photo) {
        let reader = new FileReader();
        reader.onload = function (e) { saveToCloud(e.target.result); };
        reader.readAsDataURL(photo);
    } else {
        saveToCloud(""); // Save without photo
    }
}
  
// ==========================================
// 4. DISPLAY, SEARCH, AND DELETE
// ==========================================
function displayItems() {
    let list = document.getElementById("itemList");
    list.innerHTML = "";
  
    items.forEach(function (data) {
        let li = document.createElement("li");
        li.innerHTML = `
        <b>${data.type} Item</b><br>
        👤 Name: ${data.name}<br>
        📞 Phone: ${data.phone}<br>
        📦 Item: ${data.item}<br>
        📝 Description: ${data.description}<br>
        ${data.photo ? `<img src="${data.photo}" width="120"><br>` : ""}
        <button onclick="deleteItem('${data.id}')">🗑 Delete</button>
        <hr>
        `;
        list.appendChild(li);
    });
}
  
function deleteItem(firebaseId) {
    if (confirm("Are you sure you want to delete this item?")) {
        // Deletes the item straight from the cloud!
        db.collection("lostfoundItems").doc(firebaseId).delete().then(() => {
            document.getElementById("message").innerHTML = "❌ Item deleted from cloud.";
        });
    }
}
  
function checkMatch(newItem) {
    items.forEach(function (data) {
        if (data.item.toLowerCase() === newItem.item.toLowerCase() && data.type !== newItem.type) {
            document.getElementById("message").innerHTML = "⚠ Match Found! Contact: " + data.phone;
        }
    });
}
  
function updateDashboard() {
    let lost = 0, found = 0;
    items.forEach(function (data) {
        if (data.type === "Lost") lost++;
        else found++;
    });
    document.getElementById("lostCount").innerText = lost;
    document.getElementById("foundCount").innerText = found;
}
  
function searchItems() {
    let input = document.getElementById("search").value.toLowerCase();
    let list = document.getElementById("itemList");
    let itemsList = list.getElementsByTagName("li");
  
    for (let i = 0; i < itemsList.length; i++) {
        let text = itemsList[i].innerText.toLowerCase();
        if (text.includes(input)) itemsList[i].style.display = "";
        else itemsList[i].style.display = "none";
    }
}
  
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("item").value = "";
    document.getElementById("description").value = "";
    document.getElementById("photo").value = "";
}

// ==========================================
// 5. LOGOUT
// ==========================================
function logout() {
    // Clear the user data from local storage
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role"); 
    
    alert("Logged out successfully");
    
    // Send them back to the login page
    window.location.href = "login.html";
}