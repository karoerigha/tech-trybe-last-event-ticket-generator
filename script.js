document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const fileInput = document.getElementById("fileInput");
  const fullNameInput = document.getElementById("full-name");
  const nicknameInput = document.getElementById("nickname");
  const emailInput = document.getElementById("email");
  const levelTypeSelect = document.getElementById("level-type");
  const undergradContainer = document.getElementById("undergraduate-level-container");
  const undergradSelect = document.getElementById("undergraduate-level");
  const thanksgivingCheckbox = document.getElementById("thanksgiving");
  const uploadIcon = document.getElementById("uploadIcon");
  const uploadContent = document.getElementById("uploadContent");
  const uploadText = document.getElementById("uploadText");
  const buttonGroup = document.getElementById("buttonGroup");
  const removeImageBtn = document.getElementById("removeImage");
  const changeImageBtn = document.getElementById("changeImage");
  const uploadInfo = document.getElementById("uploadInfo");
  const emailError = document.getElementById("email-error");
  const submitButton = document.getElementById("submit-button");

  // Ticket section elements
  const ticketSection = document.getElementById("ticket-section");
  const ticketNicknameElem = document.getElementById("ticket-nickname");
  const ticketEmailElem = document.getElementById("ticket-email");
  const ticketAvatar = document.getElementById("ticket-avatar");
  const ticketNicknameDisplay = document.getElementById("ticket-nickname-display");
  const ticketLevelElem = document.getElementById("ticket-level");
  const ticketThanksgivingElem = document.getElementById("ticket-thanksgiving");
  const ticketNumberElem = document.getElementById("ticket-number");
  
  // Download link and optional screenshot button
  const downloadLink = document.getElementById("download-link");
  const screenShotBtn = document.getElementById("screen-shot-button");

  // Form section (to hide it after ticket generation)
  const formSection = document.getElementById("form-section");

  // Optional: Avatar preview container
  const avatarPreviewContainer = document.getElementById('avatarPreviewContainer');
  const avatarPreview = document.getElementById('avatarPreview');
  
  // File input event: update image preview
  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      console.log("File selected for preview");
      uploadIcon.innerHTML = ""; // Clear existing image
      const newImg = document.createElement("img");
      newImg.src = URL.createObjectURL(file);
      newImg.style.maxWidth = "100px"; // Preview size
      uploadIcon.appendChild(newImg);
    }
  });
  
  // Validate file input (allow up to 2MB)
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    resetUploadInfo();
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        uploadInfo.innerHTML = `<img src="/images/icon-info-error.svg" alt="Upload info icon">File too large. Please upload a photo under 2MB.`;
        uploadInfo.style.color = "hsl(7, 88%, 67%)";
        return;
      }
      const validFileTypes = ["image/jpeg", "image/png"];
      if (!validFileTypes.includes(file.type)) {
        uploadInfo.innerHTML = `<img src="/images/icon-info-error.svg" alt="Upload info icon">Invalid file type. Please upload a JPG or PNG image.`;
        uploadInfo.style.color = "hsl(7, 88%, 67%)";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File validated and loaded");
        uploadIcon.innerHTML = `<img src="./images/image-avatar.jpg" alt="Uploaded Avatar">`;
        uploadContent.style.display = "flex";
        uploadText.style.display = "none";
        buttonGroup.style.display = "flex";
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Email validation
  emailInput.addEventListener("input", () => {
    const email = emailInput.value;
    resetEmailError();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailPattern.test(email)) {
      emailError.innerHTML = `<img src="/images/icon-info-error.svg" alt="Upload info icon">Please enter a valid email address.`;
      emailError.style.color = "hsl(7, 88%, 67%)";
      emailError.style.fontSize = "smaller";
      emailError.style.marginTop = "8px";
      emailError.style.display = "flex";
      emailError.style.gap = "8px";
    }
  });
  
  function resetEmailError() {
    emailError.innerHTML = "";
  }
  
  // Remove and change image event handlers
  removeImageBtn.addEventListener("click", () => {
    fileInput.value = "";
    uploadIcon.innerHTML = `<img src="/images/icon-upload.svg" alt="Upload icon">`;
    uploadContent.style.display = "flex";
    uploadText.style.display = "flex";
    buttonGroup.style.display = "none";
    avatarPreviewContainer.style.display = 'none';
    avatarPreview.src = '';
    resetUploadInfo();
  });
  
  changeImageBtn.addEventListener("click", () => {
    fileInput.click();
  });
  
  function resetUploadInfo() {
    uploadInfo.innerHTML = `<img src="/images/icon-info.svg" alt="Upload info icon">Upload your photo (JPG or PNG, max size: 2MB).`;
    uploadInfo.style.color = "";
  }
  
  // Toggle undergraduate level container based on level type
  levelTypeSelect.addEventListener("change", () => {
    if (levelTypeSelect.value === "Undergraduate") {
      undergradContainer.style.display = "block";
    } else {
      undergradContainer.style.display = "none";
    }
  });
  
  // Form validation function
  function validateForm() {
    let isValid = true;
    if (!fullNameInput.value.trim()) {
      alert("Full Name is required.");
      isValid = false;
    }
    if (!nicknameInput.value.trim()) {
      alert("Nickname is required.");
      isValid = false;
    }
    if (!emailInput.value.trim() || emailError.innerHTML !== "") {
      alert("Please provide a valid email address.");
      isValid = false;
    }
    if (!levelTypeSelect.value) {
      alert("Please select a level type.");
      isValid = false;
    }
    if (levelTypeSelect.value === "Undergraduate" && !undergradSelect.value) {
      alert("Please select your undergraduate level.");
      isValid = false;
    }
    return isValid;
  }
  
  // Generate ticket number using localStorage (simple counter)
  function generateTicketNumber() {
    let ticketCounter = localStorage.getItem("ticketCounter");
    if (!ticketCounter) {
      ticketCounter = 1;
    } else {
      ticketCounter = parseInt(ticketCounter) + 1;
    }
    localStorage.setItem("ticketCounter", ticketCounter);
    return "#" + ticketCounter.toString().padStart(4, "0");
  }
  
  // Function to capture the ticket section as an image using html2canvas
  async function generateTicketImage() {
    const ticketElement = document.querySelector('.ticket');
    const canvas = await html2canvas(ticketElement, {
      useCORS: true,
      allowTaint: false,
    });
    return canvas.toDataURL("image/png");
  }
  
  // Send ticket data to backend (replace with your actual Apps Script web app URL)
  async function sendTicketData(ticketData) {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzGoGAzj6iOcLa1B3M_h25rvjKel_zBZZ1xvCa_jzecXfG5tQnWprqmVWbJrMnTeWuLiw/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });
      console.log("Response from backend:", response);
      return response.ok;
    } catch (error) {
      console.error("Error sending ticket data:", error);
      return false;
    }
  }
  
  // Handle form submission
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    // Generate ticket data
    const ticketNumber = generateTicketNumber();
    const ticketData = {
      fullName: fullNameInput.value.trim(),
      nickname: nicknameInput.value.trim(),
      email: emailInput.value.trim(),
      levelType: levelTypeSelect.value,
      undergraduateLevel: levelTypeSelect.value === "Undergraduate" ? undergradSelect.value : "",
      thanksgiving: thanksgivingCheckbox.checked,
      ticketNumber: ticketNumber,
      ticketAvatar: fileInput.files[0]
        ? URL.createObjectURL(fileInput.files[0])
        : "./images/image-avatar.jpg"
    };
    
    // Update ticket section with user data
    ticketNicknameElem.textContent = ticketData.nickname;
    ticketEmailElem.textContent = ticketData.email;
    ticketAvatar.src = fileInput.files[0]
      ? URL.createObjectURL(fileInput.files[0])
      : "./images/image-avatar.jpg";
    ticketNicknameDisplay.textContent = ticketData.nickname;
    ticketLevelElem.textContent = (ticketData.levelType === "Undergraduate")
      ? `${ticketData.undergraduateLevel} (Undergraduate)`
      : ticketData.levelType;
    ticketThanksgivingElem.textContent = ticketData.thanksgiving
      ? "I'll be Attending Thanksgiving also"
      : null;
    ticketNumberElem.textContent = ticketData.ticketNumber;
    
    // Hide the form section so the ticket is the only thing visible
    formSection.style.display = "none";
    
    // Show the ticket section and scroll into view
    ticketSection.classList.remove("hidden");
    ticketSection.scrollIntoView({ behavior: "smooth" });
    
    // Wait a bit to ensure the ticket is fully rendered, then capture the screenshot
    setTimeout(async () => {
      const ticketImageData = await generateTicketImage();
      downloadLink.href = ticketImageData;
      downloadLink.download = "TechTrybeGalaTicket.png";
      // Change the text of the download link to give feedback
      downloadLink.textContent = "Download Your Ticket Screenshot";
      downloadLink.style.display = "flex";
    }, 500);
    
    // Send the ticket data to the backend
    const sent = await sendTicketData(ticketData);
    if (sent) {
      console.log("Ticket data sent successfully.");
    } else {
      console.error("Failed to send ticket data.");
    }
  });
  
  // Optional: Manual screenshot button (if needed)
  screenShotBtn.addEventListener("click", async () => {
    const ticketImageData = await generateTicketImage();
    const link = document.createElement('a');
    link.href = ticketImageData;
    link.download = 'screenshot.png';
    link.click();
  });
});
