import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, userId: string, userType: 'teacher' | 'student') => void;
  sendMessage: (roomId: string, message: any) => void;
  onMessageReceived: (callback: (message: any) => void) => () => void;
  onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => () => void;
  emitTyping: (roomId: string, userId: string, isTyping: boolean) => void;
  leaveRoom: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  serverUrl = 'http://localhost:3000', // <-- use port 3001
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasLoggedError, setHasLoggedError] = useState(false);

  useEffect(() => {
    const socketInstance = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000,
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      setHasLoggedError(false);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', () => {
      if (!hasLoggedError) {
        console.info('Socket.io server not configured. Chat will work in offline mode.');
        setHasLoggedError(true);
      }
      setIsConnected(false);
    });

    socketInstance.on('reconnect_failed', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [serverUrl, hasLoggedError]);

  const joinRoom = (roomId: string, userId: string, userType: 'teacher' | 'student') => {
    if (socket) {
      socket.emit('join-room', { roomId, userId, userType });
      console.log(`Joined room: ${roomId} as ${userType}`);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket) {
      socket.emit('leave-room', { roomId });
      console.log(`Left room: ${roomId}`);
    }
  };

  const sendMessage = (roomId: string, message: any) => {
    if (socket) {
      socket.emit('send-message', { roomId, message });
      console.log('Message sent:', message);
    }
  };

  const onMessageReceived = (callback: (message: any) => void) => {
    if (!socket) return () => {};
    socket.on('receive-message', callback);
    return () => {
      socket.off('receive-message', callback);
    };
  };

  const onTyping = (callback: (data: { userId: string; isTyping: boolean }) => void) => {
    if (!socket) return () => {};
    socket.on('typing', callback);
    return () => {
      socket.off('typing', callback);
    };
  };

  const emitTyping = (roomId: string, userId: string, isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { roomId, userId, isTyping });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    sendMessage,
    onMessageReceived,
    onTyping,
    emitTyping,
    leaveRoom,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};