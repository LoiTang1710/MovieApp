# 🎯 URL-Driven Filtering System - Architecture Guide

## Overview

A production-ready, **URL-driven filtering system** that uses React Router's search params to manage state across multiple pages (Movies, TV Shows, Search Results).

**Key Principles:**
- ✅ Single source of truth: URL
- ✅ Stateless components (no local state)
- ✅ Automatic refetch on URL change
- ✅ Shareable URLs with full filter state
- ✅ Browser back/forward button support

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│           Movies / TV Shows / Search Page           │
│          (useMediaFilters hook + useQuery)          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│           Advanced Filter Component                 │
│       (Completely dumb, receives props only)       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│        useMediaFilters Hook                         │
│    (Manages URL search params, filter state)       │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│      React Router useSearchParams                   │
│           (Browser URL management)                 │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Part 1: Custom Hook - `useMediaFilters.js`

### Purpose
Manages all filter state via URL search params. No local state needed.

### Filter Structure
```javascript
{
  year: 2024 || null,           // Single value or null
  genres: [16, 18, 35] || [],   // Array of genre IDs
  minRating: 7.5 || 0,          // Number 0-10
  page: 1,                      // Current page
}
```

### URL Format
```
/movies?year=2024&genre=16&genre=18&minRating=7.5&page=1
```

### Key Functions

**`updateFilters(newFilters)`**
- Updates filters AND automatically resets page to 1
- Rebuilds URL with new params
- Triggers TanStack Query refetch

```javascript
// Usage
updateFilters({ year: 2024, genres: [16], minRating: 8 })
// Result: /movies?year=2024&genre=16&minRating=8&page=1
```

**`resetFilters()`**
- Clears all filters
- Resets page to 1
- Returns to clean URL

```javascript
// Usage
resetFilters()
// Result: /movies (clean URL)
```

**`setPage(pageNum)`**
- Updates only the page param
- Keeps other filters intact

```javascript
// Usage
setPage(2)
// Result: /movies?year=2024&genre=16&minRating=8&page=2
```

### Return Value
```javascript
{
  filters,        // Current filter object
  updateFilters,  // Update filters (resets page)
  resetFilters,   // Clear all filters
  setPage,        // Update page only
  searchParams,   // Raw URLSearchParams object
}
```

---

## 🎨 Part 2: Component - `AdvancedFilter.jsx`

### Purpose
Reusable filter UI component with **no business logic**.

### Design Pattern: "Dumb Component"
```javascript
// ✅ This is a dumb component
// It receives ALL state and callbacks via props
// It has NO logic, just UI rendering and event handlers

const AdvancedFilter = ({ genresList, filters, onFiltersChange, onReset }) => {
  // UI only - no hooks, no state, no API calls
  return (...)
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `genresList` | Array | Yes | `[{ id, name }, ...]` from API |
| `filters` | Object | Yes | `{ year, genres, minRating, page }` |
| `onFiltersChange` | Function | Yes | Called when user changes filters |
| `onReset` | Function | Yes | Called when user clicks reset |

### Sub-Components

**YearSelect**
- 30-year dropdown
- Single selection
- Smooth animations

**GenreMultiSelect**
- Checkbox-based
- Shows selected count
- Sticky header in dropdown

**RatingSlider**
- Range 0-10
- Step 0.5
- Real-time value display

**Reset Button**
- One-click clear
- Visual X icon

### Styling
- Black/Red Glassmorphism theme
- Tailwind CSS with custom scrollbar
- Fully responsive (1-4 columns)
- Backdrop blur effects

### Usage Example
```javascript
<AdvancedFilter
  genresList={genres}
  filters={filters}
  onFiltersChange={updateFilters}
  onReset={resetFilters}
/>
```

---

## 🔗 Part 3: Page Integration - Movies Page Example

### Complete Data Flow

```javascript
// 1. Get filters from URL
const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

// 2. Build query params
const params = new URLSearchParams()
params.append('page', filters.page || 1)
if (filters.year) params.append('year', filters.year)
if (filters.genres?.length > 0) {
  filters.genres.forEach((g) => params.append('genres', g))
}
if (filters.minRating) params.append('minRating', filters.minRating)

// 3. Fetch with TanStack Query
const { data } = useQuery({
  queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page],
  queryFn: async () => {
    const response = await axios.get(`/api/movies?${params}`)
    return response.data
  },
  placeholderData: (previousData) => previousData, // Smooth transition
})

// 4. Render with data and handlers
<AdvancedFilter
  genresList={genres}
  filters={filters}
  onFiltersChange={updateFilters}  // Updates URL + refetch
  onReset={resetFilters}           // Clears URL + refetch
/>
```

### Query Configuration

```javascript
useQuery({
  queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page],
  // ^ Include all filters so changes trigger refetch
  
  queryFn: async () => { ... },
  
  staleTime: 5 * 60 * 1000,                    // 5 minutes
  gcTime: 10 * 60 * 1000,                      // 10 minutes
  placeholderData: (previousData) => previousData,  // v5 syntax
})
```

### Why This Works

1. **User changes filter** → onClick handler
2. **onFiltersChange() called** → Updates URL via useSearchParams
3. **URL changes** → Component re-renders with new filters
4. **queryKey changes** → TanStack Query auto-refetches data
5. **placeholderData** → Shows old data while loading (smooth UX)
6. **Page auto-resets** → updateFilters() sets page=1

---

## 🔄 Complete Flow Example

### Scenario: User filters movies by year and genre

```
User clicks "2024" in YearSelect
    ↓
YearSelect.onChange(2024) called
    ↓
onFiltersChange({ ...filters, year: 2024 }) called
    ↓
useMediaFilters.updateFilters() called
    ↓
URL changes to: ?year=2024&page=1
    ↓
Component re-renders with new filters
    ↓
queryKey changes: ['movies', 2024, [], 0, 1]
    ↓
TanStack Query detects queryKey change
    ↓
Runs queryFn with new params
    ↓
Fetches: GET /api/movies?year=2024&page=1
    ↓
Shows old data with placeholder effect
    ↓
New data arrives
    ↓
UI updates with new movies
```

---

## 💾 URL State Examples

### Initial State
```
/movies
```

### After selecting year
```
/movies?year=2024&page=1
```

### After adding genres
```
/movies?year=2024&genre=16&genre=18&page=1
```

### After adjusting rating
```
/movies?year=2024&genre=16&genre=18&minRating=8&page=1
```

### After going to page 3
```
/movies?year=2024&genre=16&genre=18&minRating=8&page=3
```

### After clicking reset
```
/movies
```

---

## 🎯 Reusing Across Pages

### Same Component, Different Pages

**Movies Page**
```javascript
const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()
const { data } = useQuery({
  queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page],
  queryFn: () => api.getMovies({ ...filters }),
})
```

**TV Shows Page**
```javascript
const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()
const { data } = useQuery({
  queryKey: ['tv-shows', filters.year, filters.genres, filters.minRating, filters.page],
  queryFn: () => api.getTVShows({ ...filters }),
})
```

**Search Results Page**
```javascript
const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()
const query = searchParams.get('q')
const { data } = useQuery({
  queryKey: ['search', query, filters.year, filters.genres, filters.minRating, filters.page],
  queryFn: () => api.search(query, { ...filters }),
})
```

All three pages use the **exact same AdvancedFilter component** and **same hook logic**.

---

## 🧠 Key Concepts

### 1. URL as Source of Truth
```javascript
// ❌ BAD: State in component
const [year, setYear] = useState(null)

// ✅ GOOD: State in URL
const { filters } = useMediaFilters()
// filters.year comes from URL
```

### 2. Automatic Refetch
```javascript
// ❌ BAD: Manual refetch management
const [data, setData] = useState([])
useEffect(() => { fetchData() }, [year, page])

// ✅ GOOD: TanStack Query handles it
useQuery({
  queryKey: ['movies', year, genres, minRating, page],
  // ^ Changes here = automatic refetch
})
```

### 3. Stateless Components
```javascript
// ❌ BAD: Component has state
const Filter = () => {
  const [selectedGenre, setSelectedGenre] = useState([])
  return <input onChange={(e) => setSelectedGenre(...)} />
}

// ✅ GOOD: No state, only props
const AdvancedFilter = ({ filters, onFiltersChange }) => {
  return <input onChange={(e) => onFiltersChange({...})} />
}
```

---

## 🛠️ Implementation Checklist

- [x] Create `useMediaFilters` hook
- [x] Refactor to `AdvancedFilter` component
- [x] Create Movies page example
- [x] Document data flow
- [x] Ensure URL persistance
- [x] Test queryKey changes trigger refetch
- [x] Verify placeholderData works
- [x] Browser back/forward button support
- [x] Shareable URLs with full state

---

## 📱 Browser URL Features

### Back Button Support
✅ Works automatically with useSearchParams

```
User on page 3 clicks back
    ↓
Browser URL changes to page 2
    ↓
useSearchParams detects change
    ↓
Component re-renders with page 2 data
```

### Shareable URLs
✅ Full filter state encoded in URL

```
User: "Check this filtered list"
Link: https://example.com/movies?year=2024&genre=16&minRating=8
Recipient clicks link
    ↓
Same filters apply automatically
    ↓
No state lost
```

### Bookmarkable
✅ Save favorite filter combinations

```
Bookmark: https://example.com/movies?genre=16&genre=18&minRating=8
Click bookmark anytime
    ↓
Exact same filters load
```

---

## 🚀 Production Best Practices

1. **Always include filters in queryKey**
   ```javascript
   queryKey: ['movies', filters.year, filters.genres, filters.minRating, filters.page]
   ```

2. **Use placeholderData for UX**
   ```javascript
   placeholderData: (previousData) => previousData
   ```

3. **Validate URL params**
   ```javascript
   year: searchParams.get('year') ? parseInt(...) : null
   ```

4. **Reset page on filter change**
   ```javascript
   params.set('page', '1') // Always done in updateFilters()
   ```

5. **Trim empty values**
   ```javascript
   if (newFilters.year) params.set('year', newFilters.year)
   // Don't add null/undefined values
   ```

---

## 📊 File Structure

```
client/src/
├── hooks/
│   └── useMediaFilters.js          ← URL state management
├── components/common/
│   └── Filters/
│       └── AdvancedFilter.jsx      ← Reusable filter UI
├── pages/
│   ├── Movies/
│   │   ├── Movies.jsx              ← Updated to use hook
│   │   └── MoviesPageExample.jsx   ← Full implementation example
│   ├── TVShows/
│   │   └── TVShows.jsx             ← Same pattern
│   └── Search/
│       └── Search.jsx              ← Same pattern
```

---

## ✨ Summary

This architecture provides:

✅ **Single Source of Truth** - URL params as state  
✅ **Automatic Refetch** - TanStack Query integration  
✅ **Stateless Components** - Easy to test and reuse  
✅ **Browser Support** - Back/forward buttons work  
✅ **Shareable State** - Full URL with all filters  
✅ **Performance** - Smart caching strategy  
✅ **DX** - Clean, maintainable code  

