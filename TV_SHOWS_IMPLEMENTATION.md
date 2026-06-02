# TV Shows Page - Advanced Implementation Guide

## 🏗️ Architecture Overview

### Backend Structure (Node.js/Express)

**Services Layer** (`media.service.js`)
```javascript
// getTVShowsList(page, filters)
- Handles pagination (20 items per page)
- Accepts filters object: { year, genres: [], minRating }
- Queries TMDB API with dynamic filter parameters
- Returns paginated results with metadata
```

**Controller Layer** (`media.controller.js`)
```javascript
// getTVShows - Main endpoint handler
// Parses query params: page, year, genres[], minRating
// Calls service layer and returns JSON response

// getGenresTv - Genre list endpoint
// Caches TV genres for 24 hours
```

**Routes** (`media.route.js`)
```
GET /api/medias/tv-shows?page=1&year=2024&genres=16,18&minRating=7.5
GET /api/medias/genres/tv
```

---

## 🎨 Frontend Architecture

### 1. Custom Hooks (`useTVShows.jsx`)

**useTVShowsList(page, filters)**
- TanStack Query queryKey: `['tv-shows', page, year, genres, minRating]`
- Dynamic query string building based on filters
- Caching: 5 min staleTime, 10 min gcTime
- Handles array of genres correctly

**useTVGenres()**
- Fetches genre list once and caches for 24 hours
- Returns array of `{ id, name }` objects
- Used by GenreMultiSelect component

### 2. Advanced Filter Component (`TVShowsAdvancedFilter.jsx`)

**Sub-components:**

**YearSelect**
- Dropdown with 30 years (current - 30 years)
- Controlled component
- Clean click-outside handling

**GenreMultiSelect**
- Multiple select capability
- Checkbox-based selection
- Shows selected count
- Smooth dropdown with search optimization

**RatingSlider**
- Range slider: 0-10, step 0.5
- Visual feedback showing current value
- Easy thumb interaction

**Reset Button**
- Clears all filters in one click
- Visual feedback with X icon

### 3. TV Shows Page (`TVShows.jsx`)

**State Management**
```javascript
const [currentPage, setCurrentPage] = useState(1)
const [filters, setFilters] = useState({
  year: null,
  genres: [],
  minRating: 0,
})
```

**Key Features**
- Auto-resets page to 1 when filters change
- Smooth scroll-to-top on pagination
- Loading skeleton grid (20 items)
- Error state handling
- Empty state messaging

---

## 📊 Data Flow Diagram

```
User Interacts with Filter
    ↓
TVShowsAdvancedFilter onChange
    ↓
TVShows state: setFilters()
    ↓
useEffect: reset currentPage to 1
    ↓
useTVShowsList queryKey changes
    ↓
TanStack Query: fetch data
    ↓
Backend: /tv-shows endpoint
    ↓
TMDB API query
    ↓
Response cached + UI renders
```

---

## 🔄 Filter State Management

### Clean State Object Pattern
```javascript
filters = {
  year: 2024 || null,        // Single value or null
  genres: [16, 18] || [],    // Array of IDs
  minRating: 7.5 || 0,       // Number 0-10
}
```

### URL Parameter Encoding
```javascript
// Query string building
const params = new URLSearchParams()
params.append('page', page)
if (year) params.append('year', year)
if (genres?.length > 0) {
  genres.forEach((g) => params.append('genres', g))
}
if (minRating) params.append('minRating', minRating)
// Result: ?page=1&year=2024&genres=16&genres=18&minRating=7.5
```

---

## 🎯 Key Implementation Details

### 1. TanStack Query Integration
- **Query Key Strategy**: Includes all filter variables for proper cache invalidation
- **Stale Time**: 5 minutes (prevents excessive refetches)
- **Garbage Collection**: 10 minutes (keeps data if user returns quickly)

### 2. Performance Optimizations
- Genre list cached for 24 hours (rarely changes)
- Skeleton UI matches exact grid size (20 items)
- Pagination component smart about max pages
- All filters apply instantly (no "Apply" button needed)

### 3. UX Enhancements
- Active filter count badge shows how many filters applied
- Genre dropdown shows selected count + "..." indicator
- Reset button always visible
- Responsive grid: 1 col (mobile) → 2 cols → 3 cols → 4 cols → 5 cols
- Smooth scroll behavior on pagination

---

## 📱 API Response Format

```json
{
  "results": [
    {
      "id": 1399,
      "name": "Breaking Bad",
      "poster_path": "/...",
      "vote_average": 9.5,
      "first_air_date": "2008-01-20",
      "type": "tv"
    }
  ],
  "page": 1,
  "totalPages": 1500,
  "totalResults": 30000
}
```

---

## 🚀 Testing the Implementation

### Backend Endpoint
```bash
# Basic request
curl "http://localhost:3000/api/medias/tv-shows?page=1"

# With year filter
curl "http://localhost:3000/api/medias/tv-shows?page=1&year=2024"

# With multiple genres
curl "http://localhost:3000/api/medias/tv-shows?page=1&genres=16&genres=18"

# With rating filter
curl "http://localhost:3000/api/medias/tv-shows?page=1&minRating=8"

# Combined filters
curl "http://localhost:3000/api/medias/tv-shows?page=1&year=2024&genres=16&minRating=7.5"

# Genres list
curl "http://localhost:3000/api/medias/genres/tv"
```

### Frontend Testing
1. Navigate to `/tv-shows`
2. Test each filter individually
3. Test combined filters
4. Test pagination
5. Reset filters
6. Verify skeleton UI appears while loading

---

## 🔧 Code Modularity Checklist

✅ Separate custom hooks for data fetching  
✅ Reusable filter component with sub-components  
✅ Clean state management (single filter object)  
✅ Pagination component (shared with Movies)  
✅ Skeleton loader (shared with Movies)  
✅ MovieCard component (shared with Movies)  
✅ URL-based filter parsing  
✅ Proper error handling  

---

## 📂 File Structure

```
client/src/
├── pages/
│   └── TVShows/
│       ├── TVShows.jsx (main page)
│       └── index.js
├── hooks/
│   └── useTVShows.jsx (custom hooks)
├── components/common/
│   ├── Filters/
│   │   └── TVShowsAdvancedFilter.jsx (filter UI)
│   ├── Pagination/ (shared)
│   └── Skeletons/ (shared)

server/src/
├── services/
│   └── media.service.js (getTVShowsList, getTVGenres)
├── controllers/
│   └── media.controller.js (getTVShows, getGenresTv)
└── routes/
    └── media.route.js (endpoints)
```

---

## ✨ Premium Features

### Future Enhancements
- Save filter preferences to localStorage
- URL search params (shareable links)
- Trending/popular filters quick-links
- Sort options (popularity, rating, release date)
- Watchlist integration
- Export filter presets

