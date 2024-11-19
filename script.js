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
      hour < 12
        ? "Good Morning"
        : hour < 18
        ? "Good Afternoon"
        : "Good Evening";
    greetingEl.textContent = `${greeting}, User!`;
  }
  setGreeting();

  // Load Links from localStorage
  function loadLinks() {
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    quickLinksEl.innerHTML = "";
    links.forEach((link, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <a href="${link.url}" target="_blank">${link.name}</a>
          <button class="delete" aria-label="Delete link" data-index="${index}">X</button>
        `;
      quickLinksEl.appendChild(li);
    });

    // Add delete functionality
    document
      .querySelectorAll(".delete")
      .forEach((button) => button.addEventListener("click", deleteLink));
  }

  // Add Link
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

  // Delete Link
  function deleteLink(event) {
    const index = event.target.dataset.index;
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    links.splice(index, 1);
    localStorage.setItem("quickLinks", JSON.stringify(links));
    loadLinks();
  }

  // Dark Mode
  function applyDarkMode(isDark) {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }

  const isSystemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  applyDarkMode(isDarkMode !== null ? isDarkMode : isSystemDark);

  darkModeToggle.addEventListener("click", () => {
    const currentMode = document.body.classList.contains("dark");
    applyDarkMode(!currentMode);
  });

  addLinkBtn.addEventListener("click", addLink);
  loadLinks();
});
