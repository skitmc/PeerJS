let peer;
let conn;
let activeChatId = null;
let chats = JSON.parse(localStorage.getItem('p2p-chats') || "{}");
let myName = localStorage.getItem('p2p-name') || "Guest";
let mySavedId = localStorage.getItem('p2p-id');

// --- Initialization ---
function initPeer(id) {
    if (peer) peer.destroy();
    
    // Short ID generation if none exists
    const finalId = id || Math.random().toString(36).substring(2, 8).toUpperCase();
    peer = new Peer(finalId);

    peer.on('open', (newId) => {
        mySavedId = newId;
        localStorage.setItem('p2p-id', newId);
        document.getElementById('my-id').innerText = newId;
        renderSidebar();
    });

    peer.on('connection', (connection) => {
        setupConn(connection);
    });
}

function setupConn(connection) {
    conn = connection;
    conn.on('data', (data) => {
        // Data format: { name: "FriendName", text: "Hello" }
        handleIncoming(conn.peer, data.name, data.text);
    });
}

// --- Chat Management ---
function connectToPeer() {
    const friendId = document.getElementById('join-id').value.trim().toUpperCase();
    if (!friendId) return;
    
    conn = peer.connect(friendId);
    setupConn(conn);
    
    if (!chats[friendId]) {
        chats[friendId] = { name: "Waiting for reply...", messages: [] };
        saveChats();
        renderSidebar();
    }
}

function handleIncoming(id, senderName, text) {
    if (!chats[id]) chats[id] = { name: senderName, messages: [] };
    chats[id].name = senderName; // Update name in case they changed it
    chats[id].messages.push({ from: senderName, text: text, time: Date.now() });
    saveChats();
    renderSidebar();
    if (activeChatId === id) renderMessages();
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    if (!conn || !input.value.trim()) return;

    const text = input.value;
    conn.send({ name: myName, text: text });

    if (!chats[conn.peer]) chats[conn.peer] = { name: "Friend", messages: [] };
    chats[conn.peer].messages.push({ from: "You", text: text, time: Date.now() });
    
    saveChats();
    renderMessages();
    input.value = "";
}

// --- UI Rendering ---
function renderSidebar() {
    const list = document.getElementById('contact-list');
    list.innerHTML = "";
    Object.keys(chats).forEach(id => {
        const div = document.createElement('div');
        div.className = `contact-item ${activeChatId === id ? 'active' : ''}`;
        div.innerHTML = `<span>${chats[id].name} (${id})</span>`;
        div.onclick = () => {
            activeChatId = id;
            conn = peer.connect(id); // Re-establish connection
            setupConn(conn);
            renderMessages();
            renderSidebar();
        };
        list.appendChild(div);
    });
}

function renderMessages() {
    const display = document.getElementById('message-display');
    const header = document.getElementById('chat-header');
    display.innerHTML = "";
    
    if (!activeChatId) return;
    header.innerText = `Chatting with: ${chats[activeChatId].name}`;

    chats[activeChatId].messages.forEach(m => {
        const p = document.createElement('p');
        p.className = m.from === "You" ? "msg-me" : "msg-them";
        p.innerHTML = `<strong>${m.from}:</strong> ${m.text}`;
        display.appendChild(p);
    });
    display.scrollTop = display.scrollHeight;
}

// --- Settings & Persistence ---
function saveProfile() {
    myName = document.getElementById('user-name').value;
    localStorage.setItem('p2p-name', myName);
}

function regenerateID() {
    if (confirm("Generating a new code will disconnect current chats. Continue?")) {
        localStorage.removeItem('p2p-id');
        initPeer();
    }
}

function updateBackground(color) {
    document.getElementById('app-bg').style.backgroundColor = color;
    localStorage.setItem('p2p-bg', color);
}

function saveChats() { localStorage.setItem('p2p-chats', JSON.stringify(chats)); }

function clearAllData() {
    if (confirm("Delete everything?")) {
        localStorage.clear();
        location.reload();
    }
}

// Start app
document.getElementById('user-name').value = myName;
document.getElementById('app-bg').style.backgroundColor = localStorage.getItem('p2p-bg') || "#f0f2f5";
initPeer(mySavedId);