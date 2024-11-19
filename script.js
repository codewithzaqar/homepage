document.addEventListener("DOMContentLoaded", () => {
    // Display Current Time
    const timeEl = document.getElementById("time")
    function updateTime() {
        const now = new Date()
        timeEl.textContent = now.toLocaleTimeString()
    }
    updateTime()
    setInterval(updateTime, 1000)

    // Add New Link
    const quickLinks = document.getElementById("quick-links")
    const addLinkBtn = document.getElementById("add-link")

    addLinkBtn.addEventListener("click", () => {
        const url = prompt("Enter the URL:")
        const name = prompt("Enter the name for this link:")
        if (url && name) {
            const li = document.createElement("li")
            li.innerHTML = `a href="${url}" target="_blank">${name}</a>`
            quickLinks.appendChild(li)
        }
    })

    // Dark Mode Toggle
    let isDarkMode = false
    const toggleDarkMode = () => {
        document.body.classList.toggle("dark", isDarkMode)
        isDarkMode = !isDarkMode
    }

    // Optional: Add a toggle button for dark mode
    const footer = document.querySelector("footer")
    const darkModeBtn = document.createElement("button")
    darkModeBtn.textContent = "Toggle Dark Mode"
    darkModeBtn.addEventListener("click", toggleDarkMode)
    footer.appendChild(darkModeBtn)
})