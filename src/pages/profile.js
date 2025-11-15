document.addEventListener("DOMContentLoaded", () => {

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const profileKey = `profile_${currentUser.email}`;
    const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");

    // Fill profile info
    document.getElementById("infoEmail").textContent = currentUser.email || "Not set";
    document.getElementById("infoName").textContent = profile.name || "Not set";
    document.getElementById("infoPhone").textContent = profile.phone || "Not set";
    document.getElementById("infoAddress").textContent = profile.address || "Not set";

    // Modal controls
    const modal = document.getElementById("profileForm");
    function openModal() {
        modal.classList.remove("hidden");
        document.getElementById("name").value = profile.name || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("address").value = profile.address || "";
    }
    function closeModal() {
        modal.classList.add("hidden");
    }

    document.getElementById("profileForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        // Validation
        if (name === "") {
            alert("Name cannot be blank.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        if (address === "") {
            alert("Address cannot be blank.");
            return;
        }

        // Get current user
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (!currentUser.email) {
            alert("No logged-in user found.");
            return;
        }

        // Save profile tied to email
        localStorage.setItem(profileKey, JSON.stringify({ name, phone, address }));
        document.getElementById("infoName").textContent = name
        document.getElementById("infoPhone").textContent = phone
        document.getElementById("infoAddress").textContent = address
        alert("Profile updated successfully!");
        closeModal();
        // window.location.href = "home.html";
    });

    document.getElementById("updateProfileBtn").addEventListener("click", openModal);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);

    // Save profile
    // document.getElementById("profileForm").addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     const updated = {
    //         name: document.getElementById("name").value.trim(),
    //         phone: document.getElementById("phone").value.trim(),
    //         address: document.getElementById("address").value.trim(),
    //     };
    //     localStorage.setItem("profile", JSON.stringify(updated));
    //     //alert("Profile updated!");
    //     window.location.reload();
    // });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("currentUser");
            window.location.href = "../pages/login.html"; // back to login
        }
    });

    // Auto-open modal if profile is incomplete
    if (!profile.name || !profile.phone || !profile.address) {
        openModal();
    }
});
