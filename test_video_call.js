const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000"; // Change if your backend runs on a different port
const ROOM_ID = "test-room-123";

// Simulate two clients
const clientA = io(SERVER_URL);
const clientB = io(SERVER_URL);

clientA.on("connect", () => {
  console.log("Client A connected");
  clientA.emit("join-call", ROOM_ID);

  // Simulate sending an offer after joining
  setTimeout(() => {
    console.log("Client A sending offer");
    clientA.emit("offer", { roomId: ROOM_ID, sdp: "fake-offer-sdp" });
  }, 1000);
});

clientB.on("connect", () => {
  console.log("Client B connected");
  clientB.emit("join-call", ROOM_ID);
});

clientB.on("offer", (data) => {
  console.log("Client B received offer:", data);

  // Simulate sending an answer
  setTimeout(() => {
    console.log("Client B sending answer");
    clientB.emit("answer", { roomId: ROOM_ID, sdp: "fake-answer-sdp" });
  }, 1000);
});

clientA.on("answer", (data) => {
  console.log("Client A received answer:", data);

  // Simulate sending ICE candidate
  setTimeout(() => {
    console.log("Client A sending ICE candidate");
    clientA.emit("ice-candidate", { roomId: ROOM_ID, candidate: "fake-candidate" });
  }, 1000);
});

clientB.on("ice-candidate", (data) => {
  console.log("Client B received ICE candidate:", data);

  // End test after ICE candidate
  setTimeout(() => {
    clientA.disconnect();
    clientB.disconnect();
    console.log("Test complete, clients disconnected.");
  }, 1000);
});
