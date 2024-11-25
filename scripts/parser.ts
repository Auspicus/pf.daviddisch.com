import fs from 'fs/promises'

/**
 * Parses trace file and returns p99 of the location_update timing
 */
const parseTiming = async () => {
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
        }
    }

    const percentile = (arr: number[], percentile: number) => {
        if (percentile < 0 || percentile > 1) throw new Error('Percentile out of bounds')
    
        const idx = Math.floor(arr.length * percentile)
        return arr[idx]
    }

    const startToEndApprxMicros = (events?.[events.length - 1]?.ts - (locationRecvMap.get(0) ?? 0))

    const sorted = Array.from(diffMap.values()).sort((a, b) => a - b)
    console.log(JSON.stringify({
        percentile: {
            p50: percentile(sorted, 0.50),
            p75: percentile(sorted, 0.75),
            p90: percentile(sorted, 0.90),
            p95: percentile(sorted, 0.95),
            p99: percentile(sorted, 0.99),
        },
        updates: locationRecvMap.size,
        renders: locationApplMap.size,
        dropped_pct: `${(((locationRecvMap.size - locationApplMap.size) / locationRecvMap.size) * 100).toFixed(2)}%`,
        shown_pct: `${((locationApplMap.size / locationRecvMap.size) * 100).toFixed(2)}%`,
        commits_per_sec: (locationApplMap.size / startToEndApprxMicros) * 1e6
    }, null, 2))
}

parseTiming()