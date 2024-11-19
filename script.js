document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("time");
  const greetingEl = document.getElementById("greeting");
  const quickLinksEl = document.getElementById("quick-links");
  const addLinkBtn = document.getElementById("add-link");
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const offlineStatus = document.getElementById("offline-status");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const backgroundSettings = document.getElementById("background-settings");
  const weatherEl = document.getElementById("weather");

  // Update Time
  function updateTime() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Set Greeting
  function setGreeting() {
    const hour = new Date().getHours();
    greetingEl.textContent =
      hour < 12
        ? "Good Morning, User!"
        : hour < 18
        ? "Good Afternoon, User!"
        : "Good Evening, User!";
  }
  setGreeting();

  // Weather Widget
  async function fetchWeather() {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true"
      );
      const data = await response.json();
      const temp = data.current_weather.temperature;
      const condition = data.current_weather.weathercode;
      weatherEl.textContent = `🌡️ ${temp}°C - ${condition}`;
    } catch (error) {
      weatherEl.textContent = "Unable to fetch weather.";
    }
  }
  fetchWeather();

  // Manage Links
  function loadLinks() {
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    quickLinksEl.innerHTML = "";
    links.forEach((link, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
          <a href="${link.url}" target="_blank">${link.name}</a>
          <button class="delete" data-index="${index}">X</button>
        `;
      quickLinksEl.appendChild(li);
    });

    // Add delete functionality
    document
      .querySelectorAll(".delete")
      .forEach((btn) => btn.addEventListener("click", deleteLink));
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

  function deleteLink(event) {
    const index = event.target.dataset.index;
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    links.splice(index, 1);
    localStorage.setItem("quickLinks", JSON.stringify(links));
    loadLinks();
  }

  // Search
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`
      );
    }
  });

  // Dark Mode
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }
  const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  if (savedDarkMode) document.body.classList.add("dark");

  // Background Settings
  backgroundSettings.addEventListener("click", () => {
    const background = prompt(
      "Enter a background color (e.g., #ffcc00) or an image URL:"
    );
    if (background) {
      document.body.style.background = background.includes("http")
        ? `url(${background}) center/cover no-repeat`
        : background;
      localStorage.setItem("background", background);
    }
  });

  const savedBackground = localStorage.getItem("background");
  if (savedBackground) {
    document.body.style.background = savedBackground.includes("http")
      ? `url(${savedBackground}) center/cover no-repeat`
      : savedBackground;
  }

  // Offline Detection
  function updateOfflineStatus() {
    offlineStatus.hidden = navigator.onLine;
  }
  window.addEventListener("online", updateOfflineStatus);
  window.addEventListener("offline", updateOfflineStatus);
  updateOfflineStatus();

  addLinkBtn.addEventListener("click", addLink);
  darkModeToggle.addEventListener("click", toggleDarkMode);
  loadLinks();
});
