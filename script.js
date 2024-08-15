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

document.addEventListener("DOMContentLoaded", function() {
    const habits = ['studying', 'reading', 'cleaning'];
    let habitCompletion = {};
    const today = new Date().toISOString().slice(0, 10); // Get today's date in yyyy-mm-dd format
    
    // Load data from localStorage
    loadData();

    // Add click event listeners to habit icons
    document.querySelectorAll('.habit').forEach(habit => {
        habit.addEventListener('click', function() {
            const habitName = this.getAttribute('data-habit');
            toggleHabitCompletion(habitName);
            toggleHabitVisualState(this);
            updateHeatmap();
            saveData();
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

