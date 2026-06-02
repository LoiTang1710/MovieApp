# Production Optimization Checklist

## API & Backend
- **TMDB Rate Limiting**: Implement request batching and exponential backoff for API failures. Cache TMDB responses server-side (Redis/CDN) with 1-hour TTL.
- **Query Optimization**: Add indexes on `year`, `genres`, `vote_average` in TMDB queries. Use pagination limits (<500 pages max).
- **Error Recovery**: Add retry logic with fallback data for failed API calls.

## React Query Tuning
- **Stale Time Strategy**: Genres/static data: 24hr. Movies/TV shows: 5-10min. Adjust based on TMDB update frequency.
- **GC Time**: Set gcTime to 3x staleTime to preserve cache during navigation without over-consuming memory.
- **Background Refetch**: Use `refetchOnWindowFocus: false` for heavy queries to reduce unnecessary network calls.

## Frontend Performance
- **Image Lazy Loading**: Replace eager loading with Intersection Observer or `loading="lazy"` on poster images.
- **Code Splitting**: Lazy-load Movies/TVShows/Detail pages via `React.lazy()` + `Suspense` to reduce initial bundle.
- **Bundle Analysis**: Run `vite-plugin-visualizer` to identify and trim unused dependencies (axios vs. native fetch, etc.).

## Caching Strategy
- **Service Worker**: Cache API responses + static assets to enable offline fallback.
- **Session Storage**: Cache filter state and pagination to restore user session on return.
- **Memoization**: Profile React component renders with DevTools; add `useMemo`/`useCallback` only for expensive recomputes.

## Monitoring
- Add performance metrics (FCP, LCP, INP) to analytics. Set budgets for JS bundle size and API response times.
