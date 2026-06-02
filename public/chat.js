const socket = io();
const username = prompt("Enter your name");
const $message = document.querySelector("#chat-form");
const $messageinput = $message.querySelector("input");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate =
  document.querySelector("#location-template").innerHTML;

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationTemplate, {
    url
  });

  $messages.insertAdjacentHTML("beforeend", html);
});


socket.on("message", (data) => {

  const html = Mustache.render(messageTemplate, {
    username: data.username || "System",
    message: data.text || data
  });

  $messages.insertAdjacentHTML("beforeend", html);

});

$message.addEventListener("submit", (e) => {
  e.preventDefault();


  const input = e.target.elements.message;
  const message = input.value;

  socket.emit(
    "message",
    {
      username,
      text: message,
    },
    (error) => {
      $messageinput.focus();
      if (error) {
        return alert(error);
      } else if (message === "") {
        alert("Type something to send!");
      }
    });
  input.value = "";
});

document.querySelector("#location-button").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {

    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }, () => {
      console.log("Location shared!");
    });
  });
});


