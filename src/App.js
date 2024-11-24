import { Profiler, useEffect, useState } from 'react'
import './App.css';

const Targets = ({ targets }) => {
  return targets.map((t) => <Target key={t.ref} x={t.x * 2} y={t.y * 2} />)
}

let updateId = 0
let pendingUpdates = []

const handleRender = () => {
  if (pendingUpdates.length > 0) {
    const latest = pendingUpdates.pop()
    window.performance.mark(`location_update_applied:${latest}`)
    window.performance.measure(`location_update:${latest}`, `location_update_received:${latest}`, `location_update_applied:${latest}`)
  }
}

const setPerformanceMark = () => {
  window.performance.mark(`location_update_received:${updateId}`)
  pendingUpdates.push(updateId)
  updateId++
}

function App() {
  const [targets, setTargets] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000')

    ws.onmessage = (ev) => {
      let data
      try {
        data = JSON.parse(ev.data)
      } catch (e) {
        console.error(e)
        return
      }

      setPerformanceMark()

      // Case 1: Receive a message with 1 target
      setTargets((tt) => [...tt.filter((t) => t.ref !== data.ref), data])

      // Case 2: Receive a message with all targets
      // setTargets(data.targets)
    }
  }, [])
  
  return (
    <div class="root">
      <div className="map">
        <Profiler onRender={handleRender}>
          <Targets targets={targets} />
        </Profiler>
      </div>
    </div>
  );
}

const Target = ({ x, y }) => {
  return (
    <div className='target' style={{ left: x, bottom: y }}></div>
  )
}

export default App;
