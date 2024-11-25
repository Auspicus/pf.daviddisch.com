## Case 1: 1024 WebSocket messages every 16ms containing 1 target

| Device  | p95 time to screen (ms) | commits* (per second) | dropped (%) | shown (%) |
|---|---|---|---|---|
| MacBook Pro M1 (Low Power Mode)  | 54503  | 8.29513478338838  | 99.93% | 0.07% |
| MacBook Pro M1 (Normal Mode)  | 29995  | 14.199860454098628 | 99.94% | 0.06% |

## Case 2: 1 WebSocket message every 16ms containing 1024 targets

| Device  | p95 time to screen (ms) | commits* (per second) | dropped (%) | shown (%) |
|---|---|---|---|---|
| MacBook Pro M1 (Low Power Mode)  | 3836  | 55.88474939301838 | 0% | 100% |
| MacBook Pro M1 (Normal Mode)  | 2599  | 57.28601341415711 | 0.17% | 99.83% |


## Case 2+3: 1 WebSocket message every 16ms containing 1024 targets (and slow render fn)

| Device  | p95 time to screen (ms) | commits* (per second) | dropped (%) | shown (%) |
|---|---|---|---|---|
| MacBook Pro M1 (Low Power Mode)  | 10751  | 57.584662495691184 | 0.17% | 99.83% |
| MacBook Pro M1 (Normal Mode)  | 6804  | 58.092110850965284 | 0.17% | 99.83% |

*commits: https://react.dev/learn/render-and-commit

---

target: dell 7230 tablet: intel i7 10 core cpu, 32gb ram, linux (ubuntu)

test:
- `-eff-core` is the low power M1 efficiency cores
- `-prf-core` is the standard M1 performance cores

todo:
- [x] get a consistent profiling number
- [ ] setup docker environment to run in ci

how to:
- start ui server with production build (`npm run start:prod`)
- start ws server (`npm run start:server`)
- start profiler (`npm run start:profile`)
- traces will be dumped in `/tmp`
- you may need to format your trace to make it small enough to read for the parser. you can use `filter:profile -- raw-trace > filtered-trace` to do so (requires `jq`)
- once you have a small enough trace you can pass it to the parser to get the p95 render time and number of dropped renders (`npm run start:parser -- trace`)
- output will be in the format: `p95_render_time_microseconds n_dropped_updates`

related reading:
- https://web.dev/articles/rendering-performance
- https://addyosmani.com/blog/profiling-react-js/
- https://kentcdodds.com/blog/profile-a-react-app-for-performance
- https://react.dev/learn/render-and-commit
