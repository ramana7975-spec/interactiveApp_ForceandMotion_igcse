# 🚀 Setup Instructions for IGCSE Physics Interactive App

## The Problem You're Experiencing

If you downloaded and extracted the files and just opened `index.html` directly in Chrome, you're seeing a blank page. This happens because:

- Modern browsers have security restrictions that prevent JavaScript from running properly when opening HTML files directly (`file://` protocol)
- The interactive simulations need a proper web server to function correctly

## ✅ Solution: Run a Local Web Server

### Option 1: Using Node.js (Recommended)

**Step 1:** Make sure you have Node.js installed
- Download from https://nodejs.org/ if you don't have it
- Open terminal/command prompt and type `node --version` to verify

**Step 2:** Navigate to the project folder
```bash
cd path/to/interactiveApp_ForceandMotion_igcse
```

**Step 3:** Run the application
```bash
npm start
```

This will automatically:
- Start a local web server on port 8080
- Open the app in your default browser at `http://localhost:8080`

**That's it!** The app should now work perfectly with all interactive simulations visible.

---

### Option 2: Using Python (Alternative)

If you have Python installed:

**Python 3:**
```bash
cd path/to/interactiveApp_ForceandMotion_igcse
python -m http.server 8080
```

**Python 2:**
```bash
cd path/to/interactiveApp_ForceandMotion_igcse
python -m SimpleHTTPServer 8080
```

Then open your browser and go to: `http://localhost:8080`

---

### Option 3: Using VS Code Live Server

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the "Live Server" extension
3. Open the project folder in VS Code
4. Right-click on `index.html` and select "Open with Live Server"

---

## 🎯 What You Should See

Once properly running, you should see:

1. **Top Bar:** Gamification panel with Level, XP bar, achievements, theme toggle, sound toggle
2. **Header:** "IGCSE Physics: Ultimate Interactive Experience"
3. **Navigation:** Buttons for different topics (Motion, Resultant Force, Momentum, etc.)
4. **Main Content:** Interactive simulations with sliders, canvases showing graphs/visualizations
5. **All Topics:**
   - Motion with velocity-time graphs
   - Resultant Force simulator with vector diagrams
   - Momentum collision simulator
   - Terminal velocity falling object
   - Centre of mass balance simulator
   - Moment/torque lever simulator
   - Projectile motion
   - Energy & power roller coaster
   - Circular motion satellites
   - Friction simulator
   - Challenge mode with physics problems
   - Physics sandbox

---

## 🐛 Still Having Issues?

**Clear your browser cache:**
- Chrome: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files" and clear

**Check the browser console:**
- Press `F12` to open Developer Tools
- Look at the "Console" tab for any error messages
- Take a screenshot and report the issue

**Verify files are complete:**
- Make sure you extracted ALL files from the ZIP
- You should have: `index.html`, `app.js`, `physics-calculations.js`, `styles.css`

---

## 📝 Development Mode

For developers who want to modify the code:

```bash
# Install dependencies (for testing)
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Start the server
npm start
```

---

## 🌐 Browser Compatibility

Works best with:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

---

## 💡 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank white page | Use a web server (see above), don't open HTML directly |
| JavaScript errors | Clear browser cache, refresh page |
| Simulations not interactive | Make sure JavaScript is enabled in browser |
| Styling looks broken | Verify `styles.css` is in the same folder as `index.html` |
| Canvases not showing | Update to latest browser version |

---

**Need more help?** Open an issue on the GitHub repository with:
- Your browser version
- Operating system
- Screenshot of the issue
- Any console error messages
