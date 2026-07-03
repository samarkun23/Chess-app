import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const WS_URL = "ws://localhost:3000"
        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout | null = null;
        let isMounted = true;

        const connect = () => {
            if (!isMounted) return;

            ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                console.log("Connected");
                if (isMounted) {
                    setSocket(ws);
                }
            }
            ws.onerror = (err) => {
                console.log("Websocket error ", err);
            }
            ws.onclose = () => {
                console.log("Disconnected")
                if (isMounted) {
                    setSocket(null);
                    // Attempt to reconnect after 3 seconds
                    reconnectTimeout = setTimeout(() => {
                        console.log("Attempting to reconnect...");
                        connect();
                    }, 30000);
                }
            }
        }

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws) {
                ws.onopen = null;
                ws.onerror = null;
                ws.onclose = null;
                if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                    ws.close();
                }
            }
        }

    }, [])

    console.log("SOCKET STATE", socket)
    return socket;
}
