import { useState, useEffect, useCallback } from 'react';

export interface ThreatAlert {
    id: string;
    timestamp: string;
    ip: string;
    event: string;
    severity: 'low' | 'med' | 'high' | 'critical';
}

export const useSocket = (url: string) => {
    const [messages, setMessages] = useState<ThreatAlert[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const newAlert: ThreatAlert = {
                    id: crypto.randomUUID(),
                    timestamp: new Date().toLocaleTimeString(),
                    ...data
                };
                setMessages((prev) => [newAlert, ...prev]);
            } catch (err) {
                console.error('Failed to parse WebSocket message', err);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        };

        socket.onerror = (err) => {
            console.error('WebSocket error', err);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return { messages, isConnected, clearMessages };
};
