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
    //const uploadField = document.getElementById("uploadField");
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
    const downloadLink = document.getElementById("downloadLink");
   
    const avatarPreviewContainer = document.getElementById('avatarPreviewContainer');
    const avatarPreview = document.getElementById('avatarPreview');
  
    // When the user selects a file
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        uploadIcon.innerHTML = ""; // clear existing icon
        const newImg = document.createElement("img");
        newImg.src = URL.createObjectURL(file);
        newImg.style.maxWidth = "100px"; // adjust as needed
        uploadIcon.appendChild(newImg);}
    });
    // Handle file input change
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      resetUploadInfo();
      if (file) {
        if (file.size > 500 * 1024) {
          uploadInfo.innerHTML = `<img src="/images/icon-info-error.svg" alt="Upload info icon">File too large. Please upload a photo under 500KB.`;
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
        emailError.innerHTML = `<img src="/images/icon-info-error.svg" alt="Upload info icon">
        Please enter a valid email address.`;
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
  
    // Remove and change image handlers
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
      uploadInfo.innerHTML = `<img src="/images/icon-info.svg" alt="Upload info icon">Upload your photo (JPG or PNG, max size: 5MB).`;
      uploadInfo.style.color = "";
    }
  
    // Toggle undergraduate level container
    levelTypeSelect.addEventListener("change", () => {
      if (levelTypeSelect.value === "Undergraduate") {
        undergradContainer.style.display = "block";
      } else {
        undergradContainer.style.display = "none";
      }
    });
  
    // Form validation
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
  
    // Generate ticket number using localStorage counter
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
  
    // Generate PDF using jsPDF
    async function generatePDF(ticketData) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Tech Trybe Sparkling Gala 2025 Ticket", 20, 20);
      doc.setFontSize(16);
      doc.text(`Nickname: ${ticketData.nickname}`, 20, 40);
      doc.text(`Ticket Number: ${ticketData.ticketNumber}`, 20, 50);
      doc.text(`Level: ${ticketData.level}`, 20, 60);
      doc.text(`Thanksgiving: ${ticketData.thanksgiving ? "Yes" : "No"}`, 20, 70);
      // Additional styling or details can be added here
      const pdfBlob = doc.output("blob");
      return URL.createObjectURL(pdfBlob);
    }
  
    // Send ticket data to backend (requires an API endpoint at /api/tickets)
    async function sendTicketData(ticketData) {
        try {
          const response = await
         fetch
  ("https://script.google.com/macros/s/AKfycbzGoGAzj6iOcLa1B3M_h25rvjKel_zBZZ1xvCa_jzecXfG5tQnWprqmVWbJrMnTeWuLiw/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData),
          });
          return response.ok;
        } catch (error) {
          console.error("Error sending ticket data:", error);
          return false;
        }
      }
      
  
    // Handle form submission
    submitButton.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!validateForm()) {
        return;
      }
  
      const ticketNumber = generateTicketNumber();
      const ticketData = {
        fullName: fullNameInput.value.trim(),
        nickname: nicknameInput.value.trim(),
        email: emailInput.value.trim(),
        levelType: levelTypeSelect.value,
        undergraduateLevel: levelTypeSelect.value === "Undergraduate" ? undergradSelect.value : "",
        thanksgiving: thanksgivingCheckbox.checked,
        ticketNumber: ticketNumber,
        ticketAvatar: ticketAvatar,
      };
  // Generate ticket image using html2canvas
    async function generateTicketImage() {
      const ticketElement = document.querySelector('.ticket');
      const canvas = await html2canvas(ticketElement);
      return canvas.toDataURL("image/png");
    }
      // Generate an image of the ticket and update the download link
      const ticketImageData = await generateTicketImage();
      downloadLink.href = ticketImageData;
      downloadLink.download = "TechTrybeGalaTicket.png";
      downloadLink.style.display = "block";
      
      // Update ticket section
      ticketNicknameElem.textContent = ticketData.nickname;
      ticketEmailElem.textContent = ticketData.email;
      ticketAvatar.src = fileInput.files[0]
        ? URL.createObjectURL(fileInput.files[0])
        : "./images/image-avatar.jpg";
      ticketNicknameDisplay.textContent = ticketData.nickname;
      if (ticketData.levelType === "Undergraduate") {
        ticketLevelElem.textContent = `${ticketData.undergraduateLevel} (Undergraduate)`;
      } else {
        ticketLevelElem.textContent = ticketData.levelType;
      }
      ticketThanksgivingElem.textContent = ticketData.thanksgiving
        ? "I'll be Attending Thanksgiving also"
        : null ;
      ticketNumberElem.textContent = ticketData.ticketNumber;
    
      // // Generate PDF and update download link
      // const pdfUrl = await generatePDF(ticketData);
      // downloadLink.href = pdfUrl;
      // downloadLink.download = "TechTrybeGalaTicket.pdf";
      // downloadLink.style.display = "block";
  
      ticketSection.classList.remove("hidden");
      ticketSection.scrollIntoView({ behavior: "smooth" });
  
      // Send ticket data to backend
      const sent = await sendTicketData(ticketData);
      if (sent) {
        console.log("Ticket data sent successfully.");
      } else {
        console.error("Failed to send ticket data.");
      }
    });
  });
  