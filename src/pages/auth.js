(function () {
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (!tabLogin || !tabSignup || !loginForm || !signupForm) {
    console.warn("auth.js: missing expected DOM elements");
    return;
  }

  function setTab(which) {
    const isLogin = which === "login";
    loginForm.classList.toggle("hidden", !isLogin);
    signupForm.classList.toggle("hidden", isLogin);

    tabLogin.className =
      "w-1/2 py-2 rounded-lg transition " +
      (isLogin ? "bg-white shadow" : "text-gray-600 hover:text-gray-900");
    tabSignup.className =
      "w-1/2 py-2 rounded-lg transition " +
      (!isLogin ? "bg-white shadow" : "text-gray-600 hover:text-gray-900");
  }

  function setStatus(form, msg, ok = false) {
    const el = form.querySelector(".status");
    if (!el) return;
    el.textContent = msg || "";
    el.className =
      "status text-sm h-5 mt-1 " + (ok ? "text-green-600" : "text-red-600");
  }

  function disableForm(form, disabled = true) {
    const els = form.querySelectorAll("input, button");
    els.forEach((el) => (el.disabled = disabled));
  }

  // Switch tabs
  tabLogin.addEventListener("click", () => setTab("login"));
  tabSignup.addEventListener("click", () => setTab("signup"));
  setTab("login");

  // --- Helpers for users in localStorage ---
  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // --- Login handler ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.querySelector("#loginEmail").value.trim();
    const password = loginForm.querySelector("#loginPassword").value;

    if (!email || !password) {
      setStatus(loginForm, "Please enter both email and password.");
      return;
    }

    disableForm(loginForm, true);
    setStatus(loginForm, "Checking credentials…", true);

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      setStatus(loginForm, "Invalid email or password. If new user, try signing up.");
      disableForm(loginForm, false);
      return;
    }

    // Save logged-in user in localStorage
    localStorage.setItem("currentUser", JSON.stringify({ email }));

    setStatus(loginForm, "✅ Login successful! Redirecting…", true);
    setTimeout(() => {
      window.location.href = "home.html";
    }, 800);
  });

  // --- Signup handler ---
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupForm.querySelector("#signupEmail").value.trim();
    const password = signupForm.querySelector("#signupPassword").value;
    const confirm = signupForm.querySelector("#signupConfirm").value;

    if (!email || !password || !confirm) {
      setStatus(signupForm, "Please complete all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus(signupForm, "Please enter a valid email address.");
      return;
    }
    if (password.length < 5) {
      setStatus(signupForm, "Password must be at least 5 characters.");
      return;
    }
    if (password !== confirm) {
      setStatus(signupForm, "Passwords do not match.");
      return;
    }

    disableForm(signupForm, true);
    setStatus(signupForm, "Creating account…", true);

    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      setStatus(
        signupForm,
        "❌ Email already exists. Try logging in instead."
      );
      disableForm(signupForm, false);
      return;
    }

    users.push({ email, password });
    saveUsers(users);

    // Reset form
    signupForm.reset();
    disableForm(signupForm, false);

    // Switch to login tab
    setTab("login");

    // Show success message in LOGIN form status
    setStatus(loginForm, "✅ Account created! You can log in now.", true);
  });
})();

