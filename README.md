# 📹 VidShield – A YouTube Content Filtering Chrome Extension

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-MV3-4285F4?style=flat&logo=google-chrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-5F6368?style=flat&logo=google-chrome&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-4479A1?style=flat&logo=database&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=flat&logo=webpack&logoColor=black)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat)

VidShield is a privacy-first, productivity-boosting Chrome extension that dynamically **blocks non-productive YouTube videos** using a custom ML model. It filters out distractions based on metadata like title, description, and video ID — all in real-time using declarative network request rules.

## 📛 Why the Name "VidShield"?

The name **VidShield** comes from a simple idea — _"Video + Shield."_  
It represents a digital shield that **protects your attention** and **guards your productivity** from distracting video content, especially on platforms like YouTube.

The goal is to empower users to take control of their video consumption, making online time more intentional and focused.

## 🚀 Features

- 🔍 **Real-time Metadata Analysis** – Extracts video metadata on page load  
- 🧠 **ML-Powered Filtering** – Uses a TensorFlow.js model to detect non-productive videos  
- 🚫 **Dynamic Video Blocking** – Blocks specific videos using YouTube video IDs  
- 💾 **IndexedDB Storage** – Tracks blocked videos and timestamps  
- ♻️ **Auto-Cleanup** – Automatically removes blocks older than 15 days  
- 🔧 **Modular Architecture** – Built with modern JavaScript modules and Webpack  
- 🧩 **Chrome Extension Manifest v3** – Uses latest Chrome APIs for security and performance  

---

## 📸 Project Screenshots

Here are some visuals of VidShield in action:

### 🔍 Sample Non-Production YouTube Video
![YouTube Home Page](assets/vid-shield-non-prod.png)

### 🚫 Blocked Video Popup
![Blocked Video](assets/vid-shield-blocked.png)

---

## 📂 Project Structure
```
├── public/ 
├── src/ │ 
├── content-scripts/ 
│ │ └── pages/ 
│ │ └── commons/ 
│ ├── service-worker/ 
│ │ ├── ml-model/ 
│ │ └── cleanupExpiredRules.js 
│ └── db/ 
├── dist/ # Output folder (Git ignored) 
├── webpack.config.js 
├── manifest.json 
├── package.json 
└── .gitignore
```

---

## 🛠️ How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/vidshield-extension.git
   cd vidshield-extension

2. **Install dependencies**:
   ```bash
   npm install

3. **Build the extension**:
   ```bash
   npm run build
   
4. **Load the extension into Chrome**:
  - Go to chrome://extensions
  - Enable Developer Mode
  - Click Load unpacked
  - Select the dist/ folder

---

## 🧠 Machine Learning Model
The extension uses a small TensorFlow.js model trained to classify YouTube videos as productive or non-productive based on metadata (title, description, etc.).
   - Trained in Colab
   - Stored as model.json inside service-worker/ml-model/

## 📦 Tech Stack
   - JavaScript (ES6+)
   - Webpack (modular build setup)
   - IndexedDB
   - Chrome DeclarativeNetRequest API
   - TF-IDF and Naive Bayes ML classifier
   - Chrome Extension MV3

---

## 🤝 Contribution
Contributions are welcome! 🚀
   - Fork this repo
   - Create a new branch (feat/your-feature)
   - Make your changes and commit
   - Push your branch and open a Pull Request
Please make sure your code follows the existing style and structure.

---

## 🪪 License
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat)

This project is licensed under the MIT License.
See the LICENSE file for more details.

---

## ✨ Author
```
👤 Vishwa Vijith
📧 Contact: VishwaVijith@outlook.com
🔗 GitHub: Vishwa-Vijith
```

