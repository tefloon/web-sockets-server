// Import WebSocket library
import WebSocket, { WebSocketServer } from "ws";
import { createId } from "@paralleldrive/cuid2";
import { quotesObject } from "./quotes";

type ChatMessage = {
  id: string;
  userName: string;
  message: string;
  color: string;
};

// Create a WebSocket server instance
const wss = new WebSocketServer({ port: 8080 });

const createRandomMessage = () => {
  const randomQuoteNo = Math.floor(Math.random() * quotesObject.quotes.length);
  const author = quotesObject.quotes[randomQuoteNo].author;
  const text = quotesObject.quotes[randomQuoteNo].quote;

  const newMessage = {
    id: createId(),
    userName: author,
    message: text,
    color: "#AD1",
  };

  return newMessage;
};

wss.on("connection", function connection(ws) {
  console.log("A new client connected!");

  // // Send a message every second
  // const intervalId = setInterval(() => {
  //   const messageToSend = createRandomMessage();

  //   wss.clients.forEach(function each(client) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(JSON.stringify(messageToSend));
  //     }
  //   });
  // }, 5000);

  ws.on("close", () => {
    console.log("Client disconnected.");
    // clearInterval(intervalId);
  });

  ws.on("message", (msg) => {
    const messageRecieved = JSON.parse(msg.toString());
    console.log(messageRecieved);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageRecieved));
      }
    });
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
