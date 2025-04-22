
## Project Setup Summary: DriveStock-admin

This guide outlines how to set up a React + Vite + Tailwind CSS frontend project in the directory `~/Documents/dev/MERN/DriveStock-admin` on an Ubuntu system, as done on March 29, 2025. The backend is assumed to be a separately developed MERN stack application.

### Your Environment Versions
Before starting, ensure your environment matches these versions, which were used to create the project:

- **Operating System:** Ubuntu (version not specified, but compatible with standard package managers like `apt`).
- **Node.js:** `v22.14.0` (installed via `nvm` as the latest LTS).
- **npm:** `10.9.2` (bundled with Node.js `v22.14.0`).
- **nvm (Node Version Manager):** `0.39.7` (used to manage Node.js versions).
- **curl:** Installed during setup (version depends on Ubuntu, e.g., `7.81.0` or later).

#### Setting Up the Environment
If someone else is replicating this, they should first ensure these tools are installed:

1. **Install `curl` (if not present):**
   ```bash
   sudo apt update
   sudo apt install -y curl
   ```
   - Verifies with: `curl --version`

2. **Install `nvm`:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   ```
   - Verifies with: `nvm --version` (should show `0.39.7`).

3. **Install and Use Node.js LTS:**
   ```bash
   nvm install --lts
   nvm use --lts
   ```
   - Verifies with: `node -v` (`v22.14.0`) and `npm -v` (`10.9.2`).

---

### Project Setup Steps
This sets up a fresh React + Vite + Tailwind project in `~/Documents/dev/MERN/DriveStock-admin`.

#### Step 1: Clear the Directory
- **Purpose:** Remove any existing files to start fresh.
- **Command:**
  ```bash
  cd ~/Documents/dev/MERN/DriveStock-admin
  rm -rf *
  ```
- **Verification:**
  ```bash
  ls -a
  ```
  - Should show only `.` and `..`.

#### Step 2: Create Vite + React Project
- **Purpose:** Initialize a new React project with Vite.
- **Command:**
  ```bash
  npm create vite@latest . -- --template react
  ```
  - Select `React` and `JavaScript` in prompts.
- **Install Dependencies:**
  ```bash
  npm install
  ```
- **Test:**
  ```bash
  npm run dev
  ```
  - Visit `http://localhost:5173` to see the Vite + React welcome page; stop with `Ctrl + C`.

#### Step 3: Install and Configure Tailwind CSS
- **Purpose:** Add Tailwind CSS for styling.
- **Install:**
  ```bash
  npm install -D tailwindcss@3.4.13 postcss@8.4.47 autoprefixer@10.4.20
  ```
- **Initialize Config Files:**
  ```bash
  npx tailwindcss init -p
  ```
- **Edit `tailwind.config.js`:**
  ```bash
  nano tailwind.config.js
  ```
  - Content:
    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: ["./index.html", "./src/**/*.{js,jsx}"],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
- **Verify `postcss.config.js`:**
  ```bash
  cat postcss.config.js
  ```
  - Should be:
    ```js
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }
    ```
  - Edit with `nano postcss.config.js` if incorrect.
- **Update `src/index.css`:**
  ```bash
  nano src/index.css
  ```
  - Content:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

#### Step 4: Test Tailwind Integration
- **Purpose:** Confirm Tailwind works with a sample component.
- **Edit `src/App.jsx`:**
  ```bash
  nano src/App.jsx
  ```
  - Content:
    ```jsx
    import './index.css';

    function App() {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-green-600">DriveStock Frontend</h1>
        </div>
      );
    }

    export default App;
    ```
- **Run:**
  ```bash
  npm run dev
  ```
  - Visit `http://localhost:5173` to see styled text.

---

## Commands Summary 

Below is every command used, with its purpose:

- **`sudo apt update`**
  - Updates package lists for `apt`.
- **`sudo apt install -y curl`**
  - Installs `curl` for downloading `nvm`.
- **`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`**
  - Downloads and installs `nvm`.
- **`source ~/.bashrc`**
  - Reloads shell config to use `nvm`.
- **`nvm install --lts`**
  - Installs the latest LTS Node.js (`v22.14.0`).
- **`nvm use --lts`**
  - Switches to the LTS Node.js version.
- **`node -v && npm -v`**
  - Verifies Node.js (`v22.14.0`) and npm (`10.9.2`) versions.
- **`cd ~/Documents/dev/MERN/DriveStock-client`**
  - Navigates to the project directory.
- **`rm -rf *`**
  - Clears all files in the directory.
- **`ls -a`**
  - Confirms the directory is empty.
- **`npm create vite@latest . -- --template react`**
  - Creates a Vite + React project in the current directory.
- **`npm install`**
  - Installs project dependencies (React, Vite, etc.).
- **`npm run dev`**
  - Runs the Vite dev server to test the project.
- **`npm install -D tailwindcss@3.4.13 postcss@8.4.47 autoprefixer@10.4.20`**
  - Installs Tailwind CSS and its dependencies.
- **`npx tailwindcss init -p`**
  - Generates `tailwind.config.js` and `postcss.config.js`.
- **`nano tailwind.config.js`**
  - Edits Tailwind config to specify content sources.
- **`nano postcss.config.js`**
  - Edits PostCSS config (if needed).
- **`nano src/index.css`**
  - Adds Tailwind directives to CSS.
- **`nano src/App.jsx`**
  - Updates the app to test Tailwind styles.
- **`npm run dev`**
  - Runs the server to verify Tailwind integration.

---

### Final Verification
- After running `npm run dev`, visit `http://localhost:5173`. 
- If it fails, check terminal or browser console errors. 
