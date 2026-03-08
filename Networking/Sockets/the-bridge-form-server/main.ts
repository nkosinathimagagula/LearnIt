import { Server } from 'socket.io';

const PORT = 4000;

const io = new Server(PORT, {
    cors: {
        origin: '*',    // In production, specify your frontend URL here
        methods: ['GET', 'POST']
    }
});

console.log(`Socket server running on port ${PORT} :::: `);

io.on('connection', (socket) => {
  // 1. Join a specific session room
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Device joined session: ${sessionId}`);
  });

  // 2. Mobile device signals completion
  socket.on('finish-mobile-steps', (sessionId) => {
    console.log(`Step 4 complete for session: ${sessionId}`);
    // Broadcast to everyone in the room EXCEPT the sender (the mobile device)
    socket.to(sessionId).emit('mobile-completed');
  });

  socket.on('disconnect', () => {
    console.log('Device disconnected from session');
    // Note: Cleanup logic can be added here to handle session expiration 
    // or device disconnection scenarios
  });
});