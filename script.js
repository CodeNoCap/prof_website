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

function downloadImage(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        })
        .catch(console.error);
}

function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    const googleUsername = data.name;
    const profilePicture = data.picture; 
    const email = data.email;
    const googleUserId = data.sub;
    const googleAuthToken = response.credential;

    if (profilePicture) {
        console.log('Profile Picture URL:', profilePicture);

        // Save the profile picture locally (browser will prompt to download the image)
        downloadImage(profilePicture, 'google_profile_picture.jpg');

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

document.getElementById('google-signin').addEventListener('click', () => {
    // Trigger the Google Sign-In prompt
    console.log("Clicked!");
    google.accounts.id.prompt();
    
});

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

