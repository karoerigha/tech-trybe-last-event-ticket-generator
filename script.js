document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const fullNameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const githubUsernameInput = document.getElementById("github-username");
    const uploadField = document.getElementById("uploadField");
    const uploadIcon = document.getElementById("uploadIcon");
    const uploadContent = document.getElementById("uploadContent");
    const uploadText = document.getElementById("uploadText");
    const buttonGroup = document.getElementById("buttonGroup");
    const removeImageBtn = document.getElementById("removeImage");
    const changeImageBtn = document.getElementById("changeImage");
    const ticketForm = document.querySelector("#ticket-form small");
    const emailError = document.getElementById("email-error");
    const submitButton = document.getElementById("submit-button");
    const formSection = document.getElementById("form-section");
    const ticketSection = document.getElementById("ticket-section");
    const ticketName = document.getElementById("ticket-name");
    const ticketEmail = document.getElementById("ticket-email");
    const ticketAvatar = document.getElementById("ticket-avatar");
    const ticketFullName = document.getElementById("ticket-full-name");
    const ticketGithub = document.getElementById("ticket-github-username");
    
    // Function to handle file selection
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        // Reset the upload info to the default message
        resetUploadInfo();

        if (file) {
            // Check if the file size exceeds 500KB
            if (file.size > 500 * 1024) { // 500KB size check
                ticketForm.innerHTML = `
                <img src="/images/icon-info-error.svg" alt="Upload info icon">
                File too large. Please upload a photo under 500KB.
                `;
                ticketForm.style.color = "hsl(7, 88%, 67%)";
                return; // Exit early to prevent further processing
            }

            // Check if the file type is either JPG or PNG
            const validFileTypes = ["image/jpeg", "image/png"];
            if (!validFileTypes.includes(file.type)) {
                ticketForm.innerHTML = `
                <img src="/images/icon-info-error.svg" alt="Upload info icon">
                Invalid file type. Please upload a JPG or PNG image.
                `;
                ticketForm.style.color = "hsl(7, 88%, 67%)";
                return;
            }

            // Proceed with reading the valid file
            const reader = new FileReader();
            reader.onload = () => {
                // Change upload icon to the static image (image-avatar.jpg)
                uploadIcon.innerHTML = `<img src="./images/image-avatar.jpg" alt="Uploaded Avatar">`;
                // Hide upload content and show buttons
                uploadContent.style.display = "flex";
                uploadText.style.display = "none";
                buttonGroup.style.display = "flex";
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to validate email input
    emailInput.addEventListener("input", () => {
        const email = emailInput.value;
        resetEmailError();

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailPattern.test(email)) {
            emailError.innerHTML = `
                <img src="/images/icon-info-error.svg" alt="Upload info icon">
                Please enter a valid email address.
                `;
            emailError.style.color = "hsl(7, 88%, 67%)";
            emailError.style.fontSize = "smaller";
            emailError.style.marginTop = "8px";
            emailError.style.display = "flex";
            emailError.style.gap = "8px"
        }
    });

    // Function to reset email error
    function resetEmailError() {
        emailError.innerHTML = "";
    }

    // Function to handle "Remove Image"
    removeImageBtn.addEventListener("click", () => {
        // Reset to default state
        fileInput.value = "";
        uploadIcon.innerHTML = `<img src="/images/icon-upload.svg" alt="Upload icon">`;
        uploadContent.style.display = "flex";
        uploadText.style.display = "flex";
        buttonGroup.style.display = "none";
        resetUploadInfo();
    });

    // Function to handle "Change Image"
    changeImageBtn.addEventListener("click", () => {
        // Trigger file input click
        fileInput.click();
    });

    // Function to reset the upload info message to its default state
    function resetUploadInfo() {
        ticketForm.innerHTML = `
            <img src="/images/icon-info.svg" alt="Upload info icon">
            Upload your photo (JPG or PNG, max size: 5MB).
        `;
        ticketForm.style.color = "";
    }

    // Validate form before submission
    function validateForm() {
        let isValid = true;

        if (!fullNameInput.value.trim()) {
            showError(uploadInfo, "Full Name is required.");
            isValid = false;
        }

        if (!emailInput.value.trim() || emailError.innerHTML !== "") {
            isValid = false;
        }

        if (!githubUsernameInput.value.trim()) {
            showError(uploadInfo, "GitHub Username is required.");
            isValid = false;
        }

        return isValid;
    }

    // Handle form submission
    submitButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateForm()) {
            // Populate ticket details
            ticketName.textContent = fullNameInput.value;
            ticketEmail.textContent = emailInput.value;
            ticketAvatar.src = fileInput.files[0]
                ? URL.createObjectURL(fileInput.files[0])
                : "./images/image-avatar.jpg";
            ticketFullName.textContent = fullNameInput.value;
            ticketGithub.textContent = githubUsernameInput.value;

            // Show ticket section
            ticketSection.classList.remove("hidden");

            // Smooth scroll to ticket section
            ticketSection.scrollIntoView({ behavior: "smooth" });

            formSection.style.display = "none";
        }
    });
});
