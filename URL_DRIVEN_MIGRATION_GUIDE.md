# 🔄 Migration Guide: Old vs New Architecture

## Side-by-Side Comparison

### ❌ OLD ARCHITECTURE (Local State)

```javascript
// ❌ Old TVShows.jsx - Component state management
const TVShows = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    year: null,
    genres: [],
    minRating: 0,
  })

  // Problem: State not persisted in URL
  // Problem: Losing state on page refresh
  // Problem: Can't share URL with full filter state
  // Problem: Back button doesn't work properly

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)  // Manual reset
  }

  const { data } = useQuery({
    queryKey: ['tv-shows', currentPage, filters.year, filters.genres, filters.minRating],
    queryFn: () => api.getTVShows({ ...filters, page: currentPage }),
  })

  return (
    <TVShowsAdvancedFilter
      genres={genres}
      filters={filters}
      onFiltersChange={handleFiltersChange}  // Component couples to this specific handler
    />
  )
}
```

---

### ✅ NEW ARCHITECTURE (URL-Driven State)

```javascript
// ✅ New Movies.jsx - URL state management
const MoviesPage = () => {
  // Single hook handles all state via URL
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // ✅ Benefits:
  // ✅ State persisted in URL
  // ✅ Shareable URLs
  // ✅ Back button works
  // ✅ Bookmarkable
  // ✅ Page refresh maintains state

  const { data } = useQuery({
    // ✅ Same queryKey pattern
    queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', filters.page)
      if (filters.year) params.append('year', filters.year)
      if (filters.genres?.length > 0) {
        filters.genres.forEach((g) => params.append('genres', g))
      }
      if (filters.minRating) params.append('minRating', filters.minRating)
      return axios.get(`/api/movies?${params}`).then(r => r.data)
    },
    placeholderData: (previousData) => previousData,
  })

  return (
    <AdvancedFilter
      genresList={genres}
      filters={filters}
      onFiltersChange={updateFilters}
      onReset={resetFilters}
    />
  )
}
```

---

## Feature Comparison Table

| Feature | Old | New |
|---------|-----|-----|
| **State in URL** | ❌ No | ✅ Yes |
| **Page Refresh** | ❌ Loses state | ✅ Keeps state |
| **Browser Back** | ❌ Doesn't work | ✅ Works perfectly |
| **Shareable URLs** | ❌ No | ✅ Yes |
| **Bookmarkable** | ❌ No | ✅ Yes |
| **Manual State Reset** | ✅ Required | ❌ Automatic |
| **Component Coupling** | ✅ Tightly coupled | ❌ Fully decoupled |
| **Code Reuse** | ❌ Difficult | ✅ Easy |

---

## Migration Path

### Step 1: Add Hook to Existing Component

```javascript
// Before
const TVShows = () => {
  const [filters, setFilters] = useState({...})
  const [page, setPage] = useState(1)

// After
const TVShows = () => {
  const { filters, updateFilters, setPage } = useMediaFilters()
  // Old state variables removed
```

### Step 2: Update Filter Handlers

```javascript
// Before
const handleFilterChange = (newFilters) => {
  setFilters(newFilters)
  setPage(1)
}

// After
const handleFilterChange = (newFilters) => {
  updateFilters(newFilters)  // Handles page reset automatically
}
```

### Step 3: Swap Components

```javascript
// Before
<TVShowsAdvancedFilter
  genres={genres}
  filters={filters}
  onFiltersChange={handleFilterChange}
/>

// After
<AdvancedFilter
  genresList={genres}
  filters={filters}
  onFiltersChange={updateFilters}
  onReset={resetFilters}
/>
```

### Step 4: Update TanStack Query

```javascript
// Before
useQuery({
  queryKey: ['tv-shows', page, filters.year, filters.genres, filters.minRating],
  queryFn: () => api.getTVShows({...filters, page}),
})

// After
useQuery({
  queryKey: ['tv-shows', filters.year, filters.genres, filters.minRating, filters.page],
  queryFn: async () => {
    // Build params from filters
    const params = new URLSearchParams()
    params.append('page', filters.page)
    if (filters.year) params.append('year', filters.year)
    // ... etc
    return axios.get(`/api/tv-shows?${params}`).then(r => r.data)
  },
  placeholderData: (previousData) => previousData,
})
```

---

## URL State Examples

### Old Way (No URL State)
```
/tv-shows
/tv-shows  ← Same URL, but state lost on refresh!
```

### New Way (URL-Driven State)
```
/tv-shows?year=2024&genre=16&genre=18&minRating=8&page=1
/tv-shows?year=2024&genre=16&genre=18&minRating=8&page=1  ← Same URL + state preserved
```

---

## Component Decoupling

### Old: Tightly Coupled

```javascript
// TVShowsAdvancedFilter receives specific handler from parent
<TVShowsAdvancedFilter
  onFiltersChange={(newFilters) => {
    setFilters(newFilters)
    setPage(1)  // Component handler knows about page reset
  }}
/>
```

**Problems:**
- Component tightly coupled to parent
- Can't reuse in different context
- Handler logic mixed between component and parent

### New: Fully Decoupled

```javascript
// AdvancedFilter receives generic callback
<AdvancedFilter
  onFiltersChange={updateFilters}  // Just pass the function
  onReset={resetFilters}           // Just pass the function
/>
```

**Benefits:**
- Component is "dumb" - only UI
- Can use same component everywhere
- Handler logic centralized in hook
- Easy to test both separately

---

## Data Flow Visualization

### Old Way: Multiple Sources of Truth
```
Component State
    ↓
TanStack Query
    ↓ (no URL)
```
❌ Problem: Inconsistent truth sources

### New Way: Single Source of Truth
```
URL Params
    ↓
useMediaFilters Hook
    ↓
Component
    ↓
TanStack Query
```
✅ Everything synced via URL

---

## Testing Improvements

### Old Way (Harder to Test)
```javascript
// Need to mock useState, maintain local state in tests
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

// Hard to test URL changes
```

### New Way (Easier to Test)
```javascript
// Just mock URL params
const wrapper = ({ children }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </BrowserRouter>
)

// Easy to test: update URL → component responds
```

---

## Implementation Timeline

### Phase 1: Hook Creation (1 file)
- ✅ Create `useMediaFilters.js`
- Estimated time: 30 min

### Phase 2: Component Refactor (1 file)
- ✅ Create universal `AdvancedFilter.jsx`
- Estimated time: 30 min

### Phase 3: Page Migration (1+ files)
- Update Movies page
- Update TV Shows page
- Update Search page
- Estimated time: 1-2 hours per page

### Phase 4: Testing & Verification
- Test back button
- Test shareable URLs
- Test page refresh
- Estimated time: 1 hour

---

## Performance Impact

### Old Way
```javascript
// Every component has its own state + query
TVShows: useState → useQuery
Movies: useState → useQuery
Search: useState → useQuery
```
❌ Potential cache misses between pages

### New Way
```javascript
// All pages use same queryKey pattern
TVShows: useMediaFilters → useQuery (queryKey includes filters)
Movies: useMediaFilters → useQuery (queryKey includes filters)
Search: useMediaFilters → useQuery (queryKey includes filters)
```
✅ Better TanStack Query cache utilization

---

## Backwards Compatibility

**Old components still work:**
- `TVShowsAdvancedFilter` remains unchanged
- Old Movies page continues to function
- No breaking changes

**New components are opt-in:**
- Use `AdvancedFilter` when available
- Migrate pages gradually
- No rush to change everything

---

## Summary of Benefits

| Benefit | Impact |
|---------|--------|
| **URL Persistence** | Users can share exact filter state |
| **Browser Integration** | Back/forward buttons work naturally |
| **Bookmarkable** | Save favorite filter combinations |
| **Refresh Friendly** | State survives page refresh |
| **Code Reuse** | One component, many pages |
| **Testability** | Easier to test URL-driven logic |
| **State Sync** | URL always reflects current state |
| **DX** | Cleaner, more maintainable code |

