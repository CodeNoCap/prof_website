function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function updateProgress() {
    for (let i = 1; i <= 5; i++) {
        const progressInput = document.getElementById(`progress-input-${i}`).value;
        const progressBar = document.getElementById(`progress-${i}`);
        const progressText = document.getElementById(`progress-text-${i}`);

        if (progressInput !== "") {
            progressBar.style.width = progressInput + "%";
            progressText.textContent = progressInput + "%";
            localStorage.setItem(`progress${i}`, progressInput);
        }
    }
    closePopup();
}

function openTaskPopup(taskNumber) {
    document.getElementById(`popup-task-${taskNumber}`).style.display = "flex";
}

function closeTaskPopup(taskNumber) {
    document.getElementById(`popup-task-${taskNumber}`).style.display = "none";
}

function updateTask(taskNumber) {
    const title = document.getElementById(`task-title-input-${taskNumber}`).value;
    const image = document.getElementById(`task-image-input-${taskNumber}`).value;
    const progress = document.getElementById(`task-progress-input-${taskNumber}`).value;

    if (title !== "") {
        document.getElementById(`task-title-${taskNumber}`).textContent = title;
        localStorage.setItem(`taskTitle${taskNumber}`, title);
    }

    if (image !== "") {
        document.getElementById(`task-image-${taskNumber}`).src = `./assets/${image}`;
        localStorage.setItem(`taskImage${taskNumber}`, image);
    }

    if (progress !== "") {
        document.getElementById(`task-progress-${taskNumber}`).style.width = progress + "%";
        document.getElementById(`task-progress-text-${taskNumber}`).textContent = progress + "%";
        localStorage.setItem(`taskProgress${taskNumber}`, progress);
    }

    closeTaskPopup(taskNumber);
}

function loadSavedData() {
    for (let i = 1; i <= 5; i++) {
        const savedProgress = localStorage.getItem(`progress${i}`);
        if (savedProgress) {
            const progressBar = document.getElementById(`progress-${i}`);
            const progressText = document.getElementById(`progress-text-${i}`);
            progressBar.style.width = savedProgress + "%";
            progressText.textContent = savedProgress + "%";
        }
    }

    for (let i = 1; i <= 3; i++) {
        const savedTitle = localStorage.getItem(`taskTitle${i}`);
        const savedImage = localStorage.getItem(`taskImage${i}`);
        const savedProgress = localStorage.getItem(`taskProgress${i}`);

        if (savedTitle) {
            document.getElementById(`task-title-${i}`).textContent = savedTitle;
        }

        if (savedImage) {
            document.getElementById(`task-image-${i}`).src = `./assets/${savedImage}`;
        }

        if (savedProgress) {
            document.getElementById(`task-progress-${i}`).style.width = savedProgress + "%";
            document.getElementById(`task-progress-text-${i}`).textContent = savedProgress + "%";
        }
    }
}

window.onload = loadSavedData;
