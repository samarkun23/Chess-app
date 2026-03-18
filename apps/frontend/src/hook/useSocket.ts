import { useEffect, useState } from "react"


const WS_URL = "http://localhost:3000"
export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>();

    useEffect(() => {

        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("Connected");
            setSocket(ws)
        }
        return () => {
            ws.close();
        }

    }, [])

    console.log("SOCKET STATE", socket)
    return socket;
}