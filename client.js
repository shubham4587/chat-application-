// const { io } = require("socket.io-client");

// // Server URL
// const SERVER_URL = "http://localhost:3000";

// // User configurations
// const users = [
//   { username: "shubham", room: "general" },
//   { username: "akash", room: "general" }
// ];

// // Function to create a client
// function createClient(user) {
//   const socket = io(SERVER_URL);

//   socket.on("connect", () => {
//     console.log(`${user.username} connected:`, socket.id);

//     // Join the room
//     socket.emit("joinRoom", { room: user.room, username: user.username });

//     // Confirmation for this client
//     socket.on("joinedRoom", (data) => {
//       console.log(`${user.username} joined room:`, data);

//       // Send a test message after joining
//       socket.emit("sendMessage", {
//         room: user.room,
//         username: user.username,
//         content: `Hello from ${user.username}!`
//       });
//     });

//     // Listen for broadcasts when someone joins the room
//     socket.on("roomJoined", (data) => {
//       console.log(`${user.username} sees roomJoined:`, data);
//     });

//     // Listen for new messages in the room
//     socket.on("newMessage", (msg) => {
//       console.log(`${user.username} sees newMessage:`, msg);
//     });

//     // Optional: confirmation for sender
//     socket.on("messageSent", (msg) => {
//       console.log(`${user.username} message sent confirmation:`, msg);
//     });

//     // Listen for errors
//     socket.on("error", (err) => {
//       console.log(`${user.username} error:`, err);
//     });
//   });
// }

// // Create both clients
// users.forEach(createClient);
