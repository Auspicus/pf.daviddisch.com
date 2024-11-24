import fs from 'fs/promises'

/**
 * Parses trace file and returns p99 of the location_update timing
 */
const parseTiming = async () => {
    let droppedUpdates = 0
    const file = await fs.readFile(process.argv[2], 'utf8')
    const trace = JSON.parse(file)
    const events = trace.traceEvents
    const locationUpdateEvents = events.filter((e: any) => {
        return e.cat === 'blink.user_timing' && 
            (e.name.includes('location_update_received') || e.name.includes('location_update_applied'))
    })

    // Build start and end time map
    const locationRecvMap = new Map<number, number>()
    const locationApplMap = new Map<number, number>()
    for (const event of locationUpdateEvents) {
        const id = parseInt(event.name.split(':')[1])
        const time = event.ts

        if (event.name.includes('location_update_received')) {
            locationRecvMap.set(id, time)
        } else {
            locationApplMap.set(id, time)
        }
    }

    // Create map of difference between
    const diffMap = new Map<number, number>()
    for (const [k] of locationRecvMap.entries()) {
        const a = locationRecvMap.get(k)
        const b = locationApplMap.get(k)
        if (a && b) {
            diffMap.set(k, b - a)
        } else {
            droppedUpdates++
        }
    }

    // Compute p95 of difference
    const sorted = Array.from(diffMap.values()).sort((a, b) => a - b)
    const idx = Math.floor(sorted.length * 0.95)
    const p95 = sorted[idx]

    console.log(p95, droppedUpdates)
}

parseTiming()