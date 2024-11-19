document.addEventListener("DOMContentLoaded", () => {
  const timeEl = document.getElementById("time");
  const quickLinksEl = document.getElementById("quick-links");
  const addLinkBtn = document.getElementById("add-link");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const searchInput = document.getElementById("search");
  const searchButton = document.getElementById("search-button");
  const offlineStatus = document.getElementById("offline-status");
  const backgroundSettings = document.getElementById("background-settings");
  const greetingEl = document.getElementById("greeting");

  // Time
  function updateTime() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Greeting
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

  // Links Management
  function loadLinks() {
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    quickLinksEl.innerHTML = "";
    links.forEach((link, index) => {
      const li = document.createElement("li");
      li.draggable = true;
      li.innerHTML = `
          <a href="${link.url}" target="_blank">${link.name}</a>
          <button class="delete" data-index="${index}">X</button>
        `;
      quickLinksEl.appendChild(li);
    });

    // Attach delete functionality
    document
      .querySelectorAll(".delete")
      .forEach((btn) => btn.addEventListener("click", deleteLink));

    // Drag and drop
    addDragAndDrop();
  }

  function addLink() {
    const url = prompt("Enter the URL:");
    const name = prompt("Enter the name:");
    if (url && name) {
      const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
      links.push({ url, name });
      localStorage.setItem("quickLinks", JSON.stringify(links));
      loadLinks();
    }
  }

  function deleteLink(e) {
    const index = e.target.dataset.index;
    const links = JSON.parse(localStorage.getItem("quickLinks")) || [];
    links.splice(index, 1);
    localStorage.setItem("quickLinks", JSON.stringify(links));
    loadLinks();
  }

  // Dark Mode
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }

  const isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  if (isDarkMode) document.body.classList.add("dark");

  // Search
  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`
      );
    }
  });

  // Offline Detection
  function updateOfflineStatus() {
    offlineStatus.hidden = navigator.onLine;
  }
  window.addEventListener("online", updateOfflineStatus);
  window.addEventListener("offline", updateOfflineStatus);
  updateOfflineStatus();

  // Background Customization
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

  // Restore Background
  const savedBackground = localStorage.getItem("background");
  if (savedBackground) {
    document.body.style.background = savedBackground.includes("http")
      ? `url(${savedBackground}) center/cover no-repeat`
      : savedBackground;
  }

  addLinkBtn.addEventListener("click", addLink);
  darkModeToggle.addEventListener("click", toggleDarkMode);
  loadLinks();

  // Drag-and-Drop Support
  function addDragAndDrop() {
    let draggingEl = null;
    quickLinksEl.addEventListener("dragstart", (e) => {
      draggingEl = e.target;
      draggingEl.classList.add("dragging");
    });

    quickLinksEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(quickLinksEl, e.clientY);
      if (afterElement == null) {
        quickLinksEl.appendChild(draggingEl);
      } else {
        quickLinksEl.insertBefore(draggingEl, afterElement);
      }
    });

    quickLinksEl.addEventListener("dragend", () => {
      draggingEl.classList.remove("dragging");
      saveLinksOrder();
    });
  }

  function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll("li:not(.dragging)")];
    return elements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function saveLinksOrder() {
    const links = [];
    quickLinksEl.querySelectorAll("li").forEach((li) => {
      const a = li.querySelector("a");
      links.push({ url: a.href, name: a.textContent });
    });
    localStorage.setItem("quickLinks", JSON.stringify(links));
  }
});
