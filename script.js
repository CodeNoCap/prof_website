// Select all status widgets
const statusWidgets = document.querySelectorAll('.status-widget');
const profileWidget = document.querySelectorAll('.profile');
const popup = document.querySelector('.popup');
const statusDropdown = document.getElementById('status-dropdown');
const actionCombobox = document.getElementById('action-combobox');
let activeWidget = null;
let rect;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXL9721-X8MPLnYRkg_ET4VchuXVtr5Tk",
    authDomain: "personal-website-432415.firebaseapp.com",
    projectId: "personal-website-432415",
    storageBucket: "personal-website-432415.appspot.com",
    messagingSenderId: "29223993159",
    appId: "1:29223993159:web:ab01014f8441a02d58d662",
    measurementId: "G-5M9ZB3PBZC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Global variables
let habitCompletion = {};
let userData = {};


// Function to initialize app
async function initializeAppData() {
    loadDataFromLocalStorage();

    // Check if user data exists locally or load from Firestore
    const googleUserData = localStorage.getItem('googleUserData');


    if (googleUserData) {
        // Attempt to load user data from Firestore
        const firestoreLoaded = await loadUserDataFromFirestore();
        if (!firestoreLoaded) {
            saveUserDataToFirestore(); // Save default state if Firestore data not found
        }
    } else {
        console.log("Google user data not found.")
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const habits = ['studying', 'reading', 'cleaning'];
    let habitCompletion = {};
    const today = new Date().toISOString().slice(0, 10); // Get today's date in yyyy-mm-dd format
    
    google.accounts.id.initialize({
        client_id: "29223993159-rnmupeuep8akov7uvvlaopg8ar404986.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

     // Trigger Google Sign-In when the profile icon or username is clicked
     document.getElementById('google-signin').addEventListener('click', () => {
        console.log("")
        google.accounts.id.prompt(); // Trigger the Google Sign-In prompt manually
    });
    
    // Load data from localStorage
    initializeAppData(); // Load data on page load


    // Add click event listeners to habit icons
    document.querySelectorAll('.habit').forEach(habit => {
        habit.addEventListener('click', function() {
            const habitName = this.getAttribute('data-habit');
            toggleHabitCompletion(habitName);
            toggleHabitVisualState(this);
            updateHeatmap();
            saveDataToLocalStorage();
            saveUserDataToFirestore();
        });
    });

    // Function to toggle habit completion
    function toggleHabitCompletion(habitName) {
        habitCompletion[today] = habitCompletion[today] || {};
        habitCompletion[today][habitName] = !habitCompletion[today][habitName];
    }

    // Function to toggle the visual state of the habit
    function toggleHabitVisualState(habitElement) {
        habitElement.classList.toggle('completed');
    }

    // Function to update the heatmap
    function updateHeatmap() {
        const totalHabits = habits.length;
        const completedHabits = Object.values(habitCompletion[today] || {}).filter(Boolean).length;
        const completionPercent = (completedHabits / totalHabits) * 100;

        // Update only today's square
        const dayIndex = new Date().getDate() - 1; // Get index for today's square (assuming a fixed grid for simplicity)
        const todaySquare = document.querySelectorAll('.day-square')[dayIndex];

        todaySquare.style.backgroundColor = `rgba(12, 198, 179, ${completionPercent / 100})`; // Updated fill color
        if (completionPercent === 100) {
            todaySquare.innerHTML = '<i class="material-icons">star</i>';
        } else {
            todaySquare.innerHTML = '';
        }
    }

    // Function to save data to localStorage
    function saveData() {
        localStorage.setItem('habitCompletion', JSON.stringify(habitCompletion));
    }

    // Function to load data from localStorage
    function loadData() {
        habitCompletion = JSON.parse(localStorage.getItem('habitCompletion')) || {};
        if (habitCompletion[today]) {
            habits.forEach(habit => {
                if (habitCompletion[today][habit]) {
                    const habitElement = document.querySelector(`[data-habit="${habit}"]`);
                    habitElement.classList.add('completed'); // Add completed class if already completed
                }
            });
            updateHeatmap();
        }
    }
});

function handleCredentialResponse(response) {
    console.log("Handle Credential Response Called");
    console.log("Response:", response);
    const data = jwt_decode(response.credential);
    console.log("ID Token:", response.credential);

    const googleUsername = data.name;
    const profilePicture = data.picture; 
    const email = data.email;
    const googleUserId = data.sub;
    const googleAuthToken = response.credential;

    if (profilePicture) {
        console.log('Profile Picture URL:', profilePicture);
        document.getElementById('username').textContent = googleUsername;

        const profileIconElement = document.getElementById('profile-icon');
        const imgElement = document.createElement('img');
        imgElement.src = profilePicture;
        imgElement.alt = 'Profile Picture';
        imgElement.style.width = '32px';
        imgElement.style.height = '32px';
        imgElement.style.borderRadius = '50%';

        profileIconElement.parentNode.replaceChild(imgElement, profileIconElement);

        localStorage.setItem('googleUserData', JSON.stringify({
            googleUsername,
            profilePicture,
            email,
            googleUserId,
            googleAuthToken
        }));
    } else {
        console.error('No profile picture found!');
    }
}


const statusOptions = document.querySelectorAll('.status-option');
let selectedStatus = 'active';

statusOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove the 'selected' class from all options
        statusOptions.forEach(opt => opt.classList.remove('selected'));

        // Add the 'selected' class to the clicked option
        option.classList.add('selected');

        // Set the selected status
        selectedStatus = option.getAttribute('data-status');
    });
});

// Function to open the popup
statusWidgets.forEach(widget => {
    widget.addEventListener('mouseover', () => {
        popup.classList.remove('hidden');
        rect = widget.getBoundingClientRect(); // Calculate rect here
        popup.style.top = `${rect.top + window.scrollY}px`;
        popup.style.left = `${rect.right + window.scrollX}px`; // 10px gap from the widget

        activeWidget = widget;
        

    });

    widget.addEventListener('mouseout', (event) => {
        if (!popup.contains(event.relatedTarget) && !widget.contains(event.relatedTarget)) {
          popup.classList.add('hidden');
        }
      });
});

async function saveUserDataToFirestore() {
    const googleUserData = JSON.parse(localStorage.getItem('googleUserData'));

    if (googleUserData) {
        const docRef = doc(db, "users", googleUserData.googleUserId);
        try {
            await setDoc(docRef, {
                status: userData.status,
                habits: habitCompletion,
            });
            console.log("User data successfully saved to Firestore!");
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
        }
    }
}

// Function to load user data from Firestore
async function loadUserDataFromFirestore() {
    const googleUserData = JSON.parse(localStorage.getItem('googleUserData'));

    if (googleUserData) {
        const docRef = doc(db, "users", googleUserData.googleUserId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                userData.status = data.status || {};
                habitCompletion = data.habits || {};
                console.log("User data successfully loaded from Firestore!");
                return true;
            } else {
                console.log("No such document!");
                return false;
            }
        } catch (error) {
            console.error("Error loading data from Firestore:", error);
            return false;
        }
    }
}

// Function to save data to local storage
function saveDataToLocalStorage() {
    localStorage.setItem('habitCompletion', JSON.stringify(habitCompletion));
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
    habitCompletion = JSON.parse(localStorage.getItem('habitCompletion')) || {};
    userData = JSON.parse(localStorage.getItem('userData')) || {
        status: {
            action: "Online",
            timeElapsed: "Just now"
        }
    };
}



popup.addEventListener('mouseout', (event) => {
    if (!widget.contains(event.relatedTarget) && !popup.contains(event.relatedTarget)) {
      popup.classList.add('hidden');
    }
  });

// Function to close the popup
document.getElementById('discard-action').addEventListener('click', () => {
    popup.classList.add('hidden');
    activeWidget = null;
});

// Save action
document.getElementById('save-action').addEventListener('click', () => {
    const newAction = document.getElementById('action-combobox').value;

    // Update status circle color in the active widget
    const statusCircle = activeWidget.querySelector('.status-circle');
    if (selectedStatus === 'active') {
        statusCircle.style.backgroundColor = '#4BC19F';
    } else if (selectedStatus === 'busy') {
        statusCircle.style.backgroundColor = '#CAD1A5';
    } else if (selectedStatus === 'offline') {
        statusCircle.style.backgroundColor = '#D15658';
    }

    // Update action text
    activeWidget.querySelector('.action').textContent = newAction;

    // Close the popup
    document.querySelector('.popup').classList.add('hidden');
    activeWidget = null;
});



async function testFirestoreConnection() {
    try {
        // Reference to a document in Firestore (e.g., collection "testCollection" and document "testDoc")
        const docRef = doc(db, "testCollection", "testDoc");

        // Write data to Firestore
        await setDoc(docRef, {
            message: "hello world"
        });
        console.log("Successfully wrote 'hello world' to Firestore!");

        // Read the data back from Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error connecting to Firestore: ", error);
    }
}

// Run the test function
testFirestoreConnection();




