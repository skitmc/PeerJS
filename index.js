// Check for existing ID in local storage
const savedId = localStorage.getItem('p2p-chat-id');
const peer = new Peer(savedId); 

let conn;

// 1. When Peer opens, save the ID so it never changes
peer.on('open', (id) => {
    localStorage.setItem('p2p-chat-id', id);
    document.getElementById('my-id').innerText = id;
    loadHistory();
});

// 2. Listen for incoming connections
peer.on('connection', (connection) => {
    conn = connection;
    setupChatListeners();
});

// 3. Connect to a friend
function connectToPeer() {
    const friendId = document.getElementById('join-id').value;
    if (!friendId) return alert("Enter an ID!");
    
    conn = peer.connect(friendId);
    setupChatListeners();
}

// 4. Handle messaging
function setupChatListeners() {
    conn.on('data', (data) => {
        const msgData = { sender: 'friend', text: data };
        renderMessage(msgData);
        saveToHistory(msgData);
    });

    conn.on('open', () => {
        renderMessage({ sender: 'system', text: "Connected to friend!" });
    });
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value;

    if (conn && conn.open && text.trim() !== "") {
        conn.send(text);
        const msgData = { sender: 'you', text: text };
        renderMessage(msgData);
        saveToHistory(msgData);
        input.value = "";
    }
}

// 5. Persistence (Storage) Logic
function renderMessage(msg) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.classList.add('msg', msg.sender);
    div.innerText = msg.text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function saveToHistory(msg) {
    const history = JSON.parse(localStorage.getItem('chat-logs') || "[]");
    history.push(msg);
    localStorage.setItem('chat-logs', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('chat-logs') || "[]");
    history.forEach(renderMessage);
}

function clearHistory() {
    localStorage.removeItem('chat-logs');
    document.getElementById('chat-box').innerHTML = "";
}