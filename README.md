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
