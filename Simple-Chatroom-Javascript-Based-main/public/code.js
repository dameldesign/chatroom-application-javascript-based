(function() {

  const APP = document.querySelector(".app");
  const SOCKET = io();
  let uname;

  const joinUserBtn = APP.querySelector(".join-screen #join-user");
  const usernameInput = APP.querySelector(".join-screen #username");
  const chatScreen = APP.querySelector(".chat-screen");
  const messageInput = APP.querySelector(".chat-screen #message-input");
  const sendMessageBtn = APP.querySelector(".chat-screen #send-message");
  const exitChatBtn = APP.querySelector(".chat-screen #exit-chat");
  const messagesContainer = APP.querySelector(".chat-screen .messages");

  joinUserBtn.addEventListener("click", function() {
    const username = usernameInput.value;
    if (username.length === 0) {
      return;
    }
    SOCKET.emit("newuser", username);
    uname = username;
    APP.querySelector(".join-screen").classList.remove("active");
    chatScreen.classList.add("active");
  });

  sendMessageBtn.addEventListener("click", function() {
    const message = messageInput.value;
    if (message.length === 0) {
      return;
    }
    renderMessage("my", {
      username: uname,
      text: message
    });
    SOCKET.emit("chat", {
      username: uname,
      text: message
    });
    messageInput.value = "";
  });

  exitChatBtn.addEventListener("click", function() {
    SOCKET.emit("exituser", uname);
    window.location.href = window.location.href;
  });

  SOCKET.on("update", function(update) {
    renderMessage("update", update);
  });

  SOCKET.on("chat", function(message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    if (type === "my") {
      messagesContainer.innerHTML += `
        <div class="message my-message">
          <div>
            <div class="name">You</div>
            <div class="text">${message.text}</div>
          </div>
        </div>
      `;
    } else if (type === "other") {
      messagesContainer.innerHTML += `
        <div class="message other-message">
          <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
          </div>
        </div>
      `;
    } else if (type === "update") {
      messagesContainer.innerHTML += `
        <div class="update">${message}</div>
      `;
    }
    // scroll chat to end
    messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
  }

})();