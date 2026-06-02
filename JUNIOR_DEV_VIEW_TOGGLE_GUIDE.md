# Junior Developer Guide: Grid vs. List View Toggle

## Overview

This guide explains how the View Toggle feature works in the MovieApp. The feature allows users to switch between a **Grid view** (cards in a grid layout) and a **List view** (horizontal cards with more details). The toggle preference is saved in the browser's `localStorage`, so users' choices persist across sessions.

---

## 1. How localStorage State Interacts with the UI

### What is localStorage?

`localStorage` is a browser API that persists data on the user's machine. When we save data to `localStorage`, it remains even after the browser is closed and reopened.

### The Flow

```
User clicks List icon
        ↓
ViewToggle component calls onViewChange('list')
        ↓
useViewPreference hook updates state + saves to localStorage
        ↓
Component re-renders with new view
        ↓
On next visit: useViewPreference reads localStorage on mount
        ↓
User sees their preferred view automatically
```

### Code Breakdown (useViewPreference.js)

```javascript
const STORAGE_KEY = 'media-view-preference'  // Unique key for this data

export const useViewPreference = () => {
  const [view, setView] = useState('grid')  // Default to 'grid'
  const [isLoaded, setIsLoaded] = useState(false)  // Track if localStorage was read

  useEffect(() => {
    // This runs ONCE when component mounts
    const savedView = localStorage.getItem(STORAGE_KEY)
    
    // Validate that savedView is 'grid' or 'list' (prevents corrupted data)
    if (savedView === 'list' || savedView === 'grid') {
      setView(savedView)  // Use saved preference
    }
    
    setIsLoaded(true)  // Signal that initial load is complete
  }, [])  // Empty dependency array = run only on mount

  const updateView = (newView) => {
    // Only accept valid values
    if (newView === 'grid' || newView === 'list') {
      setView(newView)  // Update React state
      localStorage.setItem(STORAGE_KEY, newView)  // Persist to browser
    }
  }

  return { view, updateView, isLoaded }
}
```

### Why `isLoaded`?

Without `isLoaded`, the component might render with `view='grid'` before localStorage is read. This causes a flash of the wrong view. By tracking `isLoaded`, parent components can hide the UI until the saved preference is loaded.

---

## 2. Why Separate Grid Card and List Card Components?

### Single Responsibility Principle

Each component has **one job**:
- **MovieCard.jsx** → Render a small card for grid layout
- **MovieCardList.jsx** → Render a horizontal card for list layout

### Why Not Merge Them?

If we merged them into one component, the code would look like:

```javascript
// ❌ BAD: Too much conditional logic
export default function MovieCard({ movie, view, onToggleLike }) {
  if (view === 'grid') {
    return (
      <div className="...grid layout...">
        {/* Grid-specific JSX */}
      </div>
    )
  } else {
    return (
      <div className="...list layout...">
        {/* List-specific JSX */}
      </div>
    )
  }
}
```

**Problems:**
- Hard to read
- Hard to test
- Hard to style each view independently
- Difficult for other devs to maintain

### The Clean Approach

```javascript
// ✅ GOOD: Separate components, clean logic
const movies = data?.results || []
const CardComponent = view === 'grid' ? MovieCard : MovieCardList

return (
  <div>
    {movies.map((movie) => (
      <CardComponent key={movie.id} movie={movie} onToggleLike={handleToggleLike} />
    ))}
  </div>
)
```

This approach:
- Each component is simple and focused
- Easy to style each view independently
- Easy to test each component in isolation
- The parent component just switches between them

---

## 3. Data Flow: How List View Uses the Same Filtered Data

### The Architecture (No Breaking of Filters)

```
Movies.jsx (or TVShows.jsx)
  ↓
  useMediaFilters() → Gets { year, genres, minRating, page } from URL
  ↓
  useMovies() → TanStack Query fetches data with these filters
  ↓
  data?.results = [movie1, movie2, movie3, ...]
  ↓
  useViewPreference() → Gets user's view preference from localStorage
  ↓
  Map over results with appropriate component (MovieCard or MovieCardList)
```

### Example Code (Movies.jsx)

```javascript
import { useMediaFilters } from '../../hooks/useMediaFilters'
import { useViewPreference } from '../../hooks/useViewPreference'
import { useMovies, useMovieGenres } from '../../hooks/useMovies'
import { ViewToggle } from '../../components/common/ViewToggle'
import MovieCard from '../MyList/Content/MovieCard'
import MovieCardList from '../../components/common/MovieCardList'

const Movies = () => {
  const navigate = useNavigate()
  
  // Step 1: Get filters from URL (unchanged)
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()
  
  // Step 2: Fetch genres (unchanged)
  const { data: genresData, isLoading: isGenresLoading } = useMovieGenres()
  
  // Step 3: Fetch movies with filters (unchanged)
  const { data, isLoading, isError, error } = useMovies(filters.page, filters)
  
  // Step 4: NEW - Get view preference from localStorage
  const { view, updateView, isLoaded } = useViewPreference()
  
  const movies = data?.results || []
  const genres = genresData || []
  
  // Step 5: Choose component based on view
  const CardComponent = view === 'grid' ? MovieCard : MovieCardList

  if (isError) {
    return <div className="...error...">Error loading movies</div>
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tất cả Phim</h1>
            <p className="text-gray-400">Khám phá bộ sưu tập phim lẻ phong phú</p>
          </div>
          
          {/* NEW: View Toggle Button */}
          {isLoaded && <ViewToggle view={view} onViewChange={updateView} />}
        </div>

        {/* Filter Component (unchanged) */}
        {!isGenresLoading && (
          <AdvancedFilter
            genresList={genres}
            filters={filters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
          />
        )}

        {/* Movies Grid/List (using selected component) */}
        {isLoading ? (
          <MovieListSkeletonGrid count={20} />
        ) : movies.length > 0 ? (
          <>
            {view === 'grid' ? (
              // Grid layout
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {movies.map((movie) => (
                  <CardComponent
                    key={`movie-${movie.id}`}
                    movie={{
                      id: movie.id,
                      title: movie.title || movie.name,
                      posterPath: movie.poster_path,
                      rating: movie.vote_average,
                      liked: false,
                    }}
                    onToggleLike={() => {}}
                  />
                ))}
              </div>
            ) : (
              // List layout
              <div className="space-y-3">
                {movies.map((movie) => (
                  <CardComponent
                    key={`movie-${movie.id}`}
                    movie={{
                      id: movie.id,
                      title: movie.title || movie.name,
                      posterPath: movie.poster_path,
                      rating: movie.vote_average,
                      releaseYear: movie.release_date?.split('-')[0],
                      overview: movie.overview,
                      liked: false,
                    }}
                    onToggleLike={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Pagination (unchanged) */}
            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.min(data.totalPages, 500)}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div>No movies found</div>
        )}
      </div>
    </div>
  )
}

export default Movies
```

### Key Points

1. **URL params stay unchanged** - `useMediaFilters()` still controls year, genres, minRating, page
2. **Query key unchanged** - TanStack Query still caches based on filters
3. **Data is the same** - Both views render the exact same `movies` array
4. **View preference is separate** - localStorage only affects UI layout, not data fetching
5. **No additional API calls** - Switching views doesn't refetch data

---

## 4. Glassmorphism Styling Breakdown

### What is Glassmorphism?

A modern design trend that makes UI elements look like frosted glass overlays. It combines:
- Translucent dark backgrounds (`bg-black/40` = 40% opacity black)
- Blur effects (`backdrop-blur-md`)
- Subtle borders (`border-white/10`)
- Smooth transitions

### Tailwind Classes Explained

#### ViewToggle.jsx

```html
<div class="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-1">
```

- `bg-black/40` - 40% opaque black background (lighter = more see-through)
- `backdrop-blur-md` - Medium blur effect on everything behind the element
- `border border-white/10` - Thin white border at 10% opacity (very subtle)
- `rounded-lg` - 8px border radius for modern look
- `p-1` - Small padding inside

#### Active Button State (Glassmorphism + Red Accent)

```html
<button class="bg-white/10 text-red-500">
```

- `bg-white/10` - Slightly brighter background when active (10% white overlay)
- `text-red-500` - Red color for primary accent (brand color)

#### Inactive Button State (Muted)

```html
<button class="text-white/60 hover:text-white hover:bg-white/5">
```

- `text-white/60` - 60% opaque white (appears gray/muted)
- `hover:text-white` - Full white text on hover
- `hover:bg-white/5` - Subtle background on hover

#### MovieCardList.jsx - Glassmorphism Container

```html
<div class="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 
            hover:bg-black/60 hover:border-white/20 hover:shadow-2xl">
```

- `bg-black/40` - Base translucent dark background
- `backdrop-blur-md` - Frosted glass effect
- `border border-white/10` - Subtle white border
- `rounded-lg` - Smooth corners
- `p-4` - Padding for breathing room
- `hover:bg-black/60` - Darker on hover (darker = more opaque)
- `hover:border-white/20` - More visible border on hover
- `hover:shadow-2xl` - Large shadow for depth

#### Image Hover Effect

```html
<img class="group-hover:scale-110 transition-transform duration-300">
```

- `group-hover:scale-110` - Scale up 10% when parent is hovered
- `transition-transform duration-300` - Smooth animation over 300ms

#### Text Hierarchy

```html
<h3 class="text-white font-semibold text-sm sm:text-base">
<p class="text-white/50">
<span class="text-white/80">
```

- `text-white` - Full white (primary text)
- `text-white/50` - 50% opaque (secondary text, deemphasized)
- `text-white/80` - 80% opaque (slightly deemphasized)

### Pattern Recognition

All glassmorphism elements follow this pattern:

```
Base Layer:
  bg-[color]/[opacity]
  backdrop-blur-[size]
  border border-white/[opacity]
  rounded-[size]

Hover Layer:
  hover:bg-[darker-color]/[higher-opacity]
  hover:border-white/[higher-opacity]
  hover:shadow-[size]

Transition:
  transition-all
  duration-[time]
```

---

## 5. Integration Steps (How to Add to Your App)

### Step 1: Add the Hook

Copy `useViewPreference.js` to `client/src/hooks/`

### Step 2: Add ViewToggle Component

Copy `ViewToggle.jsx` to `client/src/components/common/`

### Step 3: Add MovieCardList Component

Copy `MovieCardList.jsx` to `client/src/components/common/`

### Step 4: Update Movies Page

```javascript
import { useViewPreference } from '../../hooks/useViewPreference'
import { ViewToggle } from '../../components/common/ViewToggle'
import MovieCardList from '../../components/common/MovieCardList'

const Movies = () => {
  const { view, updateView, isLoaded } = useViewPreference()
  // ... rest of component
}
```

### Step 5: Update Render Logic

```javascript
const CardComponent = view === 'grid' ? MovieCard : MovieCardList

// In JSX:
{view === 'grid' ? (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {movies.map(movie => <CardComponent key={movie.id} movie={movie} />)}
  </div>
) : (
  <div className="space-y-3">
    {movies.map(movie => <CardComponent key={movie.id} movie={movie} />)}
  </div>
)}
```

---

## 6. Common Questions

**Q: What if the user clears browser data?**
A: localStorage is cleared, so the preference resets to 'grid' (the default in useState).

**Q: Why use the key `'media-view-preference'` instead of something shorter?**
A: Descriptive keys prevent collisions with other parts of the app that might use localStorage. It's also easier to debug.

**Q: Can I sync this view preference across tabs/windows?**
A: Yes! Add a storage event listener:
```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEY) {
      setView(e.newValue)
    }
  }
  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])
```

**Q: What if I want to add a third view (e.g., "Compact")?**
A: Update `useViewPreference` to accept 'compact', add another button to ViewToggle, and create a `MovieCardCompact` component. The architecture scales easily.

---

## Summary

- **localStorage** = Browser storage for user preferences
- **useViewPreference** = Custom hook that manages view state + persistence
- **ViewToggle** = UI component for toggling between grid/list
- **MovieCard vs MovieCardList** = Two separate components for two different layouts
- **Data stays the same** = URL filters and TanStack Query are unaffected
- **Glassmorphism** = Tailwind's opacity modifiers + blur effects
