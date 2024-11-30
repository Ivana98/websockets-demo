import React, { useEffect, useState } from "react";

interface Message {
  message: string;
}

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isCounting, setIsCounting] = useState<boolean>(false);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = new WebSocket("ws://localhost:8000/ws"); // Adjust the URL to match your backend

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event: MessageEvent) => {
      const data: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };

    socket.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close(); // Cleanup on component unmount
    };
  }, []);

  // Function to send a request to the backend and start the counter
  const startCounter = async () => {
    try {
      const response = await fetch("http://localhost:8000/start-counter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start: true }),
      });

      if (response.ok) {
        console.log("Counter started");
        setIsCounting(true);
      } else {
        console.error("Failed to start counter");
      }
    } catch (error) {
      console.error("Error sending request to backend:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: "0",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          paddingTop: "100px",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          flexGrow: 1,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>React WebSocket Demo</h1>

        <button onClick={startCounter}>Start Counter</button>

        {isCounting && <p>Counting has started...</p>}

        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
