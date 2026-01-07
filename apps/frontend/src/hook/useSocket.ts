import { useEffect, useState } from "react"


const WS_URL = "http://localhost:3000"
export const useSocket = () => {
    const [socket , setSocket] = useState<WebSocket | null>();
    
    useEffect(() => {

        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            setSocket(ws) 
        }

        ws.onclose = () => {
            setSocket(null)
        }

        return () => {
            ws.close();
        }

    },[])


    return socket;
}