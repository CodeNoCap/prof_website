// Select all status widgets
const statusWidgets = document.querySelectorAll('.status-widget');
const profileWidget = document.querySelectorAll('.profile');
const popup = document.querySelector('.popup');
const statusDropdown = document.getElementById('status-dropdown');
const actionCombobox = document.getElementById('action-combobox');
let activeWidget = null;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Google Sign-In button
    google.accounts.id.initialize({
        client_id: "29223993159-rnmupeuep8akov7uvvlaopg8ar404986.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    // Trigger Google Sign-In when the profile icon or username is clicked
    document.getElementById('google-signin').addEventListener('click', () => {
        google.accounts.id.prompt(); // Trigger the Google Sign-In prompt manually
    });
});

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    const googleUsername = data.name;
    const profilePicture = data.picture;
    const email = data.email;
    const googleUserId = data.sub;
    const googleAuthToken = response.credential;

    // Update the username text
    document.getElementById('username').textContent = googleUsername;

    // Replace the Material Icon with the profile picture
    const profileIconElement = document.getElementById('profile-icon');
    const imgElement = document.createElement('img');
    imgElement.src = profilePicture;
    imgElement.alt = 'Profile Picture';
    imgElement.style.width = '32px'; // Set the desired width
    imgElement.style.height = '32px'; // Set the desired height
    imgElement.style.borderRadius = '50%'; // Make it a circle if desired

    // Replace the icon with the new img element
    profileIconElement.parentNode.replaceChild(imgElement, profileIconElement);

    // Store the user data in localStorage for future use
    localStorage.setItem('googleUserData', JSON.stringify({
        googleUsername,
        profilePicture,
        email,
        googleUserId,
        googleAuthToken
    }));
}

document.getElementById('google-signin').addEventListener('click', () => {
    // Trigger the Google Sign-In prompt
    console.log("Clicked!");
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