import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFormStore } from '../stores/useFormStore';

// Note: In a real app, replace with your backend URL
const SOCKET_SERVER_URL = 'http://localhost:4000/';

export const useSocket = (sessionId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const { setSecondaryComplete } = useFormStore();

  useEffect(() => {
    if (!sessionId) {
      console.log("Socket: No sessionId yet, waiting...");
      return;
    }

    // Connect to the server
    console.log(`Socket: Connecting for session ${sessionId}...`);
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on('connect', () => {
      console.log("Socket: Connected to server!");
      // Explicitly join the room once connected
      socketRef.current?.emit('join-session', sessionId);
    });

    // Join a private room unique to this session
    // socketRef.current.emit('join-session', sessionId);

    // Listen for the "completed" event from the mobile device
    socketRef.current.on('mobile-completed', () => {
      console.log("Socket: Received 'mobile-completed' event!");
      setSecondaryComplete(true);
    });

    return () => {
      console.log("Socket: Disconnecting...");
      socketRef.current?.disconnect();
    };
  }, [sessionId, setSecondaryComplete]);

  // Function for the mobile device to call
  const notifyComplete = (id: string) => {
    console.log(`Socket: Notifying completion for ${id}`);
    socketRef.current?.emit('finish-mobile-steps', id);
  };

  // Disconnect from the server
  const disconnect = () => {
    console.log("Socket: Manual disconnect called");
    socketRef.current?.disconnect();
  };

  return { notifyComplete, disconnect };
};