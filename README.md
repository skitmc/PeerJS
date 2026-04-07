# 🚀 P2P Private Chat

A lightweight, serverless, peer-to-peer chat application built with **PeerJS**. This app allows users to chat directly browser-to-browser using unique IDs, with persistent chat history and permanent user codes.

## ✨ Features

* **No Server Required:** Uses WebRTC via PeerJS for direct connection.
* **Permanent ID:** Your unique chat code is saved to your browser so it stays the same every time you visit.
* **Persistent History:** Messages are saved to `localStorage`, so your conversations are there even after a refresh.
* **GitHub Pages Ready:** Designed to work perfectly on static hosting.
* **Clean UI:** Simple, responsive design for easy messaging.

## 🛠️ Tech Stack

* **HTML5 / CSS3**
* **JavaScript (ES6)**
* **[PeerJS](https://peerjs.com/):** For Peer-to-Peer data connection.

## 🚀 Quick Start

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    ```
2.  **Open `index.html`** in your browser.
3.  **Share your ID:** Copy the ID displayed at the top and send it to a friend.
4.  **Connect:** Have your friend paste your ID into their "Join" box and hit **Connect**.

## 📖 How it Works

1.  **PeerJS** assigns a unique ID to your browser session. 
2.  When you enter a friend's ID and click connect, a **WebRTC data channel** is established.
3.  Messages are sent directly between browsers—nothing is stored on a database.
4.  The `index.js` file handles the saving of your ID and chat logs to your browser's `localStorage`.

## 📂 Project Structure

```text
├── index.html   # The structure of the chat app
├── style.css    # Modern styling and layout
├── index.js     # PeerJS logic and local storage handling
└── README.md    # Project documentation