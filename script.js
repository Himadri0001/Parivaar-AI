/* =====================================================
PARIVAAR AI
JavaScript
===================================================== */

/* =========================
GET HTML ELEMENTS
========================= */

const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcomeScreen = document.getElementById("welcomeScreen");
const sidebar = document.getElementById("sidebar");
const sendButton = document.getElementById("sendButton");

/* =========================
SEND MESSAGE
========================= */

async function sendMessage() {

const text = messageInput.value.trim();    

if (text === "") {  
    return;  
}  
if (!currentChatId) {

    createChat(text);

}

// Hide welcome screen  
welcomeScreen.style.display = "none";  

// Show user's message  
addMessage(text, "user");  
saveChatMessage(text,"user");

// Clear input  
messageInput.value = "";  
messageInput.style.height = "40px";  

// Disable send button  
sendButton.disabled = true;  

// Show thinking indicator  
showTyping();  

try {  

    const response = await fetch(  
        "http://localhost:3000/api/chat",  
        {  
            method: "POST",  

            headers: {  
                "Content-Type": "application/json"  
            },  

            body: JSON.stringify({  
                message: text  
            })  
        }  
    );  

    const data = await response.json();  

    // Remove "thinking..."  
    removeTyping();  

    if (data.reply) {  

        addMessage(data.reply, "ai"); 
        saveChatMessage(data.reply,"ai"); 

    } else {  

        addMessage(  
            "Sorry, I couldn't get a response.",  
            "ai"  
        );  

    }  

} catch (error) {  

    console.error(error);  

    removeTyping();  

    addMessage(  
        "Unable to connect to Parivaar AI server.",  
        "ai"  
    );  

}  

sendButton.disabled = false;

}

/* =========================
ADD MESSAGE
========================= */

function addMessage(text, sender) {

const message = document.createElement("div");  

message.classList.add(  
    "message",  
    sender  
);  


const content = document.createElement("div");  

content.classList.add("message-content");  


// Convert line breaks  
content.innerHTML = text.replace(/\n/g, "<br>");  


message.appendChild(content);  

messages.appendChild(message);  


// Scroll to bottom  
scrollToBottom();

}

/* =========================
TYPING INDICATOR
========================= */

function showTyping() {

const typing = document.createElement("div");  

typing.className = "message ai";  

typing.id = "typingIndicator";  


typing.innerHTML = `  
    <div class="message-content">  
        <span>Parivaar AI is thinking...</span>  
    </div>  
`;  


messages.appendChild(typing);  

scrollToBottom();

}

/* =========================
REMOVE TYPING
========================= */

function removeTyping() {

const typing =  
    document.getElementById("typingIndicator");  

if (typing) {  
    typing.remove();  
}

}

/* =========================
DEMO AI RESPONSE
========================= */

function generateDemoResponse(question) {

const q = question.toLowerCase();  


if (  
    q.includes("hello") ||  
    q.includes("hi") ||  
    q.includes("hey")  
) {  

    return `  
        Hello! 👋<br><br>  

        I'm <strong>Parivaar AI</strong>.  
        How can I help you today?  
    `;  

}  


if (  
    q.includes("java") &&  
    q.includes("inheritance")  
) {  

    return `  
        <strong>Inheritance in Java</strong><br><br>  

        Inheritance is an Object-Oriented Programming  
        concept where one class can acquire the properties  
        and methods of another class.<br><br>  

        Example:<br><br>  

        <code>  
        class Animal { }<br>  
        class Dog extends Animal { }  
        </code>  
    `;  

}  


if (  
    q.includes("html") ||  
    q.includes("website")  
) {  

    return `  
        HTML is used to create the structure of a  
        website.<br><br>  

        CSS is used for styling, and JavaScript is  
        used to make the website interactive.<br><br>  

        Parivaar AI can help you build the complete  
        project step by step.  
    `;  

}  


if (  
    q.includes("dsa") ||  
    q.includes("data structure")  
) {  

    return `  
        DSA means <strong>Data Structures and Algorithms</strong>.<br><br>  

        Important topics include:<br>  

        • Arrays<br>  
        • Linked Lists<br>  
        • Stacks<br>  
        • Queues<br>  
        • Trees<br>  
        • Graphs<br>  
        • Sorting<br>  
        • Searching<br>  
        • Dynamic Programming  
    `;  

}  


if (  
    q.includes("project") ||  
    q.includes("idea")  
) {  

    return `  
        Here are some project ideas:<br><br>  

        1. AI Chatbot<br>  
        2. Weather Application<br>  
        3. E-learning Platform<br>  
        4. Expense Tracker<br>  
        5. Search Engine<br>  
        6. Student Management System<br><br>  

        I can help you build any of them.  
    `;  

}  


// Default response  

return `  
    I received your question:<br><br>  

    <strong>${escapeHTML(question)}</strong><br><br>  

    I'm currently running in demo mode.  
    The next step is to connect Parivaar AI to a  
    real AI model so that it can generate intelligent  
    answers to any question.  
`;

}

/* =========================
ESCAPE HTML
========================= */

function escapeHTML(text) {

const div = document.createElement("div");  

div.textContent = text;  

return div.innerHTML;

}

/* =========================
ENTER KEY
========================= */

function handleEnter(event) {

/*  
   Enter = Send  
   Shift + Enter = New line  
*/  

if (  
    event.key === "Enter" &&  
    !event.shiftKey  
) {  

    event.preventDefault();  

    sendMessage();  

}

}

/* =========================
AUTO GROW TEXTAREA
========================= */

messageInput.addEventListener(
"input",
function () {

this.style.height = "auto";  

    this.style.height =  
        Math.min(  
            this.scrollHeight,  
            180  
        ) + "px";  

}

);

/* =========================
SUGGESTION BUTTON
========================= */

function useSuggestion(text) {

messageInput.value = text;  

messageInput.focus();  

// Automatically resize  
messageInput.style.height = "auto";  

messageInput.style.height =  
    Math.min(  
        messageInput.scrollHeight,  
        180  
    ) + "px";

}

/* =========================
NEW CHAT
========================= */

function newChat() {

    currentChatId = null;
    currentChatMessages = [];

// Clear all messages  
messages.innerHTML = "";  

// Show welcome screen  
welcomeScreen.style.display = "flex";  

// Clear input  
messageInput.value = "";  

messageInput.style.height = "40px";  

// Focus input  
messageInput.focus();  

// Close sidebar on mobile  
if (window.innerWidth <= 768) {  

    sidebar.classList.remove("open");  

}

}

/* =========================
DARK MODE
========================= */

function toggleTheme() {

document.body.classList.toggle("dark");  


// Save theme  
if (  
    document.body.classList.contains("dark")  
) {  

    localStorage.setItem(  
        "parivaarTheme",  
        "dark"  
    );  

} else {  

    localStorage.setItem(  
        "parivaarTheme",  
        "light"  
    );  

}

}

/* =========================
LOAD SAVED THEME
========================= */

function loadTheme() {

const theme =  
    localStorage.getItem(  
        "parivaarTheme"  
    );  


if (theme === "dark") {  

    document.body.classList.add("dark");  

}

}

/* =========================
MOBILE SIDEBAR
========================= */

function toggleSidebar() {

sidebar.classList.toggle("open");

}

/* =========================
CLOSE SIDEBAR WHEN CLICKING
OUTSIDE ON MOBILE
========================= */

document.addEventListener(
"click",
function (event) {

if (window.innerWidth > 768) {  
        return;  
    }  


    const clickedInsideSidebar =  
        sidebar.contains(event.target);  

    const clickedMenu =  
        event.target.closest(".menu-button");  


    if (  
        !clickedInsideSidebar &&  
        !clickedMenu  
    ) {  

        sidebar.classList.remove("open");  

    }  

}

);

/* =========================
SCROLL TO BOTTOM
========================= */

function scrollToBottom() {

const chatContainer =  
    document.getElementById(  
        "chatContainer"  
    );  


setTimeout(() => {  

    chatContainer.scrollTop =  
        chatContainer.scrollHeight;  

}, 50);

}

/* =========================
LOAD THEME ON START
========================= */

loadTheme();

/* =========================
FOCUS INPUT
========================= */

window.addEventListener(
"load",
function () {

messageInput.focus();  

}

);
/* =====================================================
   CHAT HISTORY
   ===================================================== */

const chatHistory = document.getElementById("chatHistory");

let currentChatId = null;
let currentChatMessages = [];


/* =========================
   GET SAVED CHATS
   ========================= */

function getChats() {

    return JSON.parse(
        localStorage.getItem("parivaarChats") || "[]"
    );

}


/* =========================
   SAVE CHATS
   ========================= */

function saveChats(chats) {

    localStorage.setItem(
        "parivaarChats",
        JSON.stringify(chats)
    );

}


/* =========================
   CREATE NEW CHAT
   ========================= */

function createChat(title) {

    const chat = {

        id: Date.now().toString(),

        title: title,

        messages: []

    };

    const chats = getChats();

    chats.unshift(chat);

    saveChats(chats);

    currentChatId = chat.id;

    currentChatMessages = [];

    renderChatHistory();

}


/* =========================
   SAVE MESSAGE TO CURRENT CHAT
   ========================= */

function saveChatMessage(text, sender) {

    if (!currentChatId) {
        return;
    }

    const chats = getChats();

    const chat = chats.find(
        c => c.id === currentChatId
    );

    if (!chat) {
        return;
    }

    chat.messages.push({

        text: text,

        sender: sender

    });

    saveChats(chats);

}


/* =========================
   RENDER RECENT CHATS
   ========================= */

function renderChatHistory() {

    chatHistory.innerHTML = "";

    const chats = getChats();

    chats.forEach(chat => {

        const item = document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <span class="history-title">
                ${escapeHTML(chat.title)}
            </span>

            <button
                class="delete-chat"
                title="Delete chat"
                onclick="deleteChat('${chat.id}', event)"
            >
                🗑
            </button>
        `;

        item.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest(".delete-chat")
                ) {
                    return;
                }

                openChat(chat.id);

            }
        );

        chatHistory.appendChild(item);

    });

}


/* =========================
   OPEN PREVIOUS CHAT
   ========================= */

function openChat(chatId) {

    const chats = getChats();

    const chat = chats.find(
        c => c.id === chatId
    );

    if (!chat) {
        return;
    }

    currentChatId = chat.id;

    currentChatMessages = chat.messages;

    // Clear current screen
    messages.innerHTML = "";

    // Hide welcome
    welcomeScreen.style.display = "none";

    // Show saved messages
    chat.messages.forEach(message => {

        addMessage(
            message.text,
            message.sender
        );

    });

    scrollToBottom();

    // Close mobile sidebar
    if (window.innerWidth <= 768) {

        sidebar.classList.remove("open");

    }

}


/* =========================
   DELETE CHAT
   ========================= */

function deleteChat(chatId, event) {

    if (event) {
        event.stopPropagation();
    }

    const chats = getChats();

    const updatedChats = chats.filter(
        chat => chat.id !== chatId
    );

    saveChats(updatedChats);

    // If currently open chat was deleted
    if (currentChatId === chatId) {

        currentChatId = null;

        currentChatMessages = [];

        newChat();

    }

    renderChatHistory();

}


/* =========================
   LOAD CHAT HISTORY
   ========================= */

function loadChatHistory() {

    renderChatHistory();

}


/* =========================
   LOAD ON START
   ========================= */

loadChatHistory();
/* =========================
   VOICE INPUT
   ========================= */

const voiceButton = document.getElementById("voiceButton");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    voiceButton.addEventListener("click", function () {

        recognition.start();

        voiceButton.textContent = "🔴";

    });


    recognition.onresult = function (event) {

        const spokenText =
            event.results[0][0].transcript;

        messageInput.value = spokenText;

        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                180
            ) + "px";

    };


    recognition.onend = function () {

        voiceButton.textContent = "🎙️";

    };


    recognition.onerror = function (event) {

        console.error(
            "Voice recognition error:",
            event.error
        );

        voiceButton.textContent = "🎙️";

    };

} else {

    voiceButton.disabled = true;

    voiceButton.title =
        "Voice input is not supported in this browser";

}
