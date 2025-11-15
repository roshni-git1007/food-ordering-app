
## How to run (recommended)
**Open in VS Code and use Live Server**
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension if you don't have it.
3. In **File Explorer (VS Code)** open `src/pages/login.html`.
4. Right-click `login.html` → **Open with Live Server**.
5. Browser will open the app (Login page). Use the app from there.

> Note: If you open `login.html` directly (double-click), some `fetch()` features may not work due to local file restrictions. Use Live Server for best results.

## Run without Node
- This project runs purely in the browser. You do not need to run any server-side installation unless you want to rebuild CSS or install dev tooling.

## If you clone and want to install node modules (optional)
If you included a `package.json` and want to install dev dependencies:
```bash
npm install