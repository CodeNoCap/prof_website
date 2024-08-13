// Select all status widgets
const statusWidgets = document.querySelectorAll('.status-widget');
const popup = document.querySelector('.popup');
const statusDropdown = document.getElementById('status-dropdown');
const actionCombobox = document.getElementById('action-combobox');
let activeWidget = null;

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    // Extract the user data needed
    const googleUsername = data.name;
    const profilePicture = data.picture;
    const email = data.email;
    const googleUserId = data.sub; // Google User ID
    const googleAuthToken = response.credential; // Token for API access

    // Update the profile UI
    document.getElementById('username').textContent = googleUsername;
    document.getElementById('profile-icon').src = profilePicture;

    // Store the user data for later use (e.g., for Google Calendar integration)
    localStorage.setItem('googleUserData', JSON.stringify({
        googleUsername,
        profilePicture,
        email,
        googleUserId,
        googleAuthToken
    }));

    console.log("Google User Logged In:", googleUsername);
}

// Include JWT Decode Library
<script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>

document.getElementById('google-signin').addEventListener('click', () => {
    // Trigger the Google Sign-In prompt
    google.accounts.id.prompt();
});

// Function to open the popup
statusWidgets.forEach(widget => {
    widget.addEventListener('mouseover', () => {
        popup.classList.remove('hidden');
        activeWidget = widget;

    });

    widget.addEventListener('mouseout', (event) => {
        if (!popup.contains(event.relatedTarget) && !widget.contains(event.relatedTarget)) {
          popup.classList.add('hidden');
        }
      });
});

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
    const newStatus = statusDropdown.value;
    const newAction = actionCombobox.value;

    // Update status circle color
    const statusCircle = activeWidget.querySelector('.status-circle');
    if (newStatus === 'active') {
        statusCircle.style.backgroundColor = '#4BC19F';
    } else if (newStatus === 'busy') {
        statusCircle.style.backgroundColor = '#CAD1A5';
    } else if (newStatus === 'offline') {
        statusCircle.style.backgroundColor = '#D15658';
    }

    // Update action text
    activeWidget.querySelector('.action').textContent = newAction;

    // Close the popup
    popup.classList.add('hidden');
    activeWidget = null;
});