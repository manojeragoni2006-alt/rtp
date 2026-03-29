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
        li.className = "item-card"; // This links it to your new CSS!
        
        // Determine the badge color
        let badgeClass = data.type === "Lost" ? "badge-lost" : "badge-found";

        // Build the professional card layout
        li.innerHTML = `
            <div class="card-image">
                ${data.photo ? `<img src="${data.photo}">` : `<div style="height: 180px; background: #ddd; display: flex; align-items: center; justify-content: center;">📸 No Photo</div>`}
            </div>
            <div class="card-content">
                <span class="badge ${badgeClass}">${data.type.toUpperCase()}</span>
                <h3 style="margin: 10px 0;">${data.item}</h3>
                <p style="color: #666; font-size: 14px;">📝 ${data.description}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                <p style="margin: 5px 0; font-size: 14px;">👤 <b>${data.name}</b></p>
                <p style="margin: 5px 0; font-size: 14px;">📞 ${data.phone}</p>
                <button onclick="deleteItem('${data.id}')" style="width: 100%; margin-top: 10px; background: #e74c3c; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">
                    🗑 Resolve / Delete
                </button>
            </div>
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