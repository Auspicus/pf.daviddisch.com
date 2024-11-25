import { randomUUID } from 'crypto'
import WebSocket, { WebSocketServer } from 'ws'

const run = async () => {
    const wss = new WebSocketServer({
        port: 8000,
    })

    const start = performance.now()
    setInterval(() => {
        const now = performance.now()
        const dt = now - start

        for (const target of TARGETS) {
            const r = Math.random() - 0.5
            const dx = 3 * Math.sin((dt / 1000) % 2) * r
            const dy = 3 * Math.cos((dt / 1000) % 2) * r
            target.x = Math.max(Math.min(target.x + dx, 360), 0)
            target.y = Math.max(Math.min(target.y + dy, 180), 0)
        }
    }, 50)

    wss.on('connection', handleConnection)
}

type Target = {
    ref: string;

    /**
     * Longitude (-180 to 180)
     */
    x: number;

    /**
     * Latitude (-90 to 90)
     */
    y: number;
}

const TARGETS: Array<Target> = new Array(1024).fill(0).map(() => {
    return {
        ref: randomUUID(),
        x: Math.random() * 360,
        y: Math.random() * 180
    }
})

const TPS = 60

const handleConnection = (s: WebSocket) => {
    s.on('close', () => {
        // Quit the program when the client disconnects
        process.exit(0)
    });
    
    (async () => {
        while (true) {
            // Case 1: Send a message for each target
            // for (const target of TARGETS) {
            //     s.send(JSON.stringify(target))
            // }
    
            // Case 2: Send a message of all targets
            s.send(JSON.stringify({
                targets: TARGETS
            }))

            await new Promise((res) => setTimeout(res, 1000 / TPS))
        }
    })()
}

run()