// Firebase initialization
const firebaseConfig = {
    // Replace with your Firebase configuration
    apiKey: "AIzaSyDXL9721-X8MPLnYRkg_ET4VchuXVtr5Tk",
    authDomain: "personal-website-432415.firebaseapp.com",
    projectId: "personal-website-432415",
    storageBucket: "personal-website-432415.appspot.com",
    messagingSenderId: "29223993159",
    appId: "1:29223993159:web:ab01014f8441a02d58d662",
    measurementId: "G-5M9ZB3PBZC"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Select DOM elements
const statusWidgets = document.querySelectorAll('.status-widget');
const popup = document.querySelector('.popup');
const statusOptions = document.querySelectorAll('.status-option');
const actionCombobox = document.getElementById('action-combobox');
const saveActionBtn = document.getElementById('save-action');
const discardActionBtn = document.getElementById('discard-action');
let activeWidget = null;
let selectedStatus = 'active';

// Google Sign-In Initialization
document.addEventListener('DOMContentLoaded', () => {
    google.accounts.id.initialize({
        client_id: "29223993159-rnmupeuep8akov7uvvlaopg8ar404986.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    // Load saved user state if logged in
    loadUserState();

    // Trigger Google Sign-In when profile icon or username is clicked
    document.getElementById('google-signin').addEventListener('click', () => {
        google.accounts.id.prompt(); // Trigger Google Sign-In prompt manually
    });
});

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    const googleUserData = {
        googleUsername: data.name,
        profilePicture: data.picture,
        email: data.email,
        googleUserId: data.sub,
        googleAuthToken: response.credential
    };

    saveUserState(googleUserData);
    updateProfileUI(googleUserData);
}

function updateProfileUI(userData) {
    document.getElementById('username').textContent = userData.googleUsername;
    const profileIconElement = document.getElementById('profile-icon');
    const imgElement = document.createElement('img');
    imgElement.src = userData.profilePicture;
    imgElement.alt = 'Profile Picture';
    imgElement.style.width = '32px';
    imgElement.style.height = '32px';
    imgElement.style.borderRadius = '50%';

    profileIconElement.parentNode.replaceChild(imgElement, profileIconElement);
}

// Handle status options selection
statusOptions.forEach(option => {
    option.addEventListener('click', () => {
        statusOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedStatus = option.getAttribute('data-status');
    });
});

// Open popup on widget hover
statusWidgets.forEach(widget => {
    widget.addEventListener('mouseover', () => {
        popup.classList.remove('hidden');
        const rect = widget.getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY}px`;
        popup.style.left = `${rect.right + window.scrollX}px`;
        activeWidget = widget;
    });

    widget.addEventListener('mouseout', event => {
        if (!popup.contains(event.relatedTarget) && !widget.contains(event.relatedTarget)) {
            popup.classList.add('hidden');
        }
    });
});

popup.addEventListener('mouseout', event => {
    if (!activeWidget.contains(event.relatedTarget) && !popup.contains(event.relatedTarget)) {
        popup.classList.add('hidden');
    }
});

// Discard action
discardActionBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    activeWidget = null;
});

// Save action and update status
saveActionBtn.addEventListener('click', () => {
    const newAction = actionCombobox.value;
    const statusCircle = activeWidget.querySelector('.status-circle');

    // Set status circle color based on selected status
    switch (selectedStatus) {
        case 'active':
            statusCircle.style.backgroundColor = '#4BC19F';
            break;
        case 'busy':
            statusCircle.style.backgroundColor = '#CAD1A5';
            break;
        case 'offline':
            statusCircle.style.backgroundColor = '#D15658';
            break;
    }

    // Update action text
    activeWidget.querySelector('.action').textContent = newAction;

    // Save the current time of update
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    activeWidget.querySelector('.time-elapsed').textContent = `since ${formattedTime}`;

    // Save status to Firestore
    saveStatusToFirestore(activeWidget, selectedStatus, newAction, currentTime);

    // Close the popup
    popup.classList.add('hidden');
    activeWidget = null;
});

// Save user state and status to Firestore
function saveUserState(userData) {
    localStorage.setItem('googleUserData', JSON.stringify(userData));
    db.collection('users').doc(userData.googleUserId).set(userData, { merge: true });
}

function loadUserState() {
    const storedUserData = JSON.parse(localStorage.getItem('googleUserData'));
    if (storedUserData) {
        updateProfileUI(storedUserData);
        db.collection('users').doc(storedUserData.googleUserId).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                updateProfileUI(userData);
            }
        });
    }
}

function saveStatusToFirestore(widget, status, action, time) {
    const userId = JSON.parse(localStorage.getItem('googleUserData')).googleUserId;
    const statusData = {
        status: status,
        action: action,
        timestamp: firebase.firestore.Timestamp.fromDate(time)
    };

    db.collection('users').doc(userId).collection('status').doc(widget.querySelector('.status-username').textContent).set(statusData, { merge: true });
}
