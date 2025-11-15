document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("navbar").innerHTML = html;

      // Highlight active link
      const currentPath = window.location.pathname.split("/").pop();
      document.querySelectorAll("#navbar nav a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("text-green-600", "font-semibold");
        } else {
          link.classList.add("hover:text-green-600");
        }
      });
    })
    .catch(err => console.error("Navbar load error:", err));
});
