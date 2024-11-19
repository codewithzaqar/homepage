document.addEventListener("DOMContentLoaded", () => {
    const timeEl = document.getElementById("time");
    const quickLinksEl = document.getElementById("quick-links");
    const addLinkBtn = document.getElementById("add-link");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const greetingEl = document.getElementById("greeting");
  
    // Display Current Time
    function updateTime() {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString();
    }
    setInterval(updateTime, 1000);
    updateTime();
  
    // Set Greeting
    function setGreeting() {
      const hour = new Date().getHours();
      const greeting =
        hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
      greetingEl.textContent = `${greeting}, User!`;
    }
    setGreeting();
  
    // Manage Links in localStorage
    function loadLinks() {
      const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
      quickLinksEl.innerHTML = ""; // Clear current links
      links.forEach((link) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a>`;
        quickLinksEl.appendChild(li);
      });
    }
  
    function addLink() {
      const url = prompt("Enter the URL:");
      const name = prompt("Enter the name for this link:");
      if (url && name) {
        const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
        links.push({ url, name });
        localStorage.setItem("quickLinks", JSON.stringify(links));
        loadLinks();
      }
    }
  
    addLinkBtn.addEventListener("click", addLink);
    loadLinks();
  
    // Dark Mode
    function applyDarkMode(isDark) {
      document.body.classList.toggle("dark", isDark);
      localStorage.setItem("darkMode", isDark);
    }
  
    const isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    applyDarkMode(isDarkMode);
  
    darkModeToggle.addEventListener("click", () => {
      const currentMode = document.body.classList.contains("dark");
      applyDarkMode(!currentMode);
    });
  });
  