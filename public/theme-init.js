(() => {
  try {
    const storedTheme = localStorage.getItem("aurora-theme")
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark)

    document.documentElement.classList.toggle("dark", isDark)
    document.documentElement.style.colorScheme = isDark ? "dark" : "light"
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#05060f" : "#f4f7fc")
  } catch {
    // Keep the default light theme when storage is unavailable.
  }
})()
