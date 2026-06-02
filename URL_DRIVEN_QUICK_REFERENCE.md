# 🚀 URL-Driven Filtering System - Quick Reference

## 3-Minute Quick Start

### Install in Your Page

```javascript
import { useMediaFilters } from '@/hooks/useMediaFilters'
import { AdvancedFilter } from '@/components/common/Filters/AdvancedFilter'
import { useQuery } from '@tanstack/react-query'

const MyPage = () => {
  // 1. Get filters from URL
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

  // 2. Fetch genres once
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.getGenres(),
  })

  // 3. Fetch data with filters
  const { data } = useQuery({
    queryKey: ['items', filters.year, filters.genres, filters.minRating, filters.page],
    queryFn: () => api.getItems({
      year: filters.year,
      genres: filters.genres,
      minRating: filters.minRating,
      page: filters.page,
    }),
    placeholderData: (previousData) => previousData,
  })

  // 4. Render
  return (
    <>
      <AdvancedFilter
        genresList={genres}
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />
      <Grid items={data?.results} />
      <Pagination page={filters.page} onPageChange={setPage} />
    </>
  )
}
```

---

## Hook API

```javascript
const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()

// filters object
{
  year: 2024 || null,
  genres: [16, 18] || [],
  minRating: 7.5 || 0,
  page: 1
}

// Update filters (auto resets page to 1)
updateFilters({ year: 2024, genres: [16], minRating: 8 })

// Clear everything
resetFilters()

// Update page only
setPage(2)
```

---

## Component API

```javascript
<AdvancedFilter
  genresList={[{ id: 16, name: 'Action' }, ...]}
  filters={{ year, genres, minRating, page }}
  onFiltersChange={(newFilters) => {}}
  onReset={() => {}}
/>
```

---

## URL Format

```
/movies
/movies?year=2024&page=1
/movies?year=2024&genre=16&genre=18&page=1
/movies?year=2024&genre=16&genre=18&minRating=8&page=3
```

---

## File Locations

```
✅ client/src/hooks/useMediaFilters.js
✅ client/src/components/common/Filters/AdvancedFilter.jsx
✅ client/src/pages/Movies/MoviesPageExample.jsx (example)

📚 URL_DRIVEN_FILTERING_GUIDE.md (full architecture)
📚 URL_DRIVEN_MIGRATION_GUIDE.md (migration steps)
📚 URL_DRIVEN_DELIVERY_SUMMARY.md (overview)
```

---

## Key Features

✅ URL-driven state (no local state)  
✅ Auto page reset on filter change  
✅ TanStack Query integration  
✅ Browser back/forward support  
✅ Shareable URLs  
✅ Fully reusable component  
✅ Zero dependencies on page logic  

---

## Copy-Paste Template

```javascript
// Your page
import { useMediaFilters } from '@/hooks/useMediaFilters'
import { AdvancedFilter } from '@/components/common/Filters/AdvancedFilter'

const YourPage = () => {
  const { filters, updateFilters, resetFilters, setPage } = useMediaFilters()
  
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: () => api.getGenres(),
  })
  
  const { data } = useQuery({
    queryKey: ['items', filters.year, filters.genres, filters.minRating, filters.page],
    queryFn: () => api.getItems({
      year: filters.year,
      genres: filters.genres,
      minRating: filters.minRating,
      page: filters.page,
    }),
    placeholderData: (previousData) => previousData,
  })
  
  return (
    <div>
      <AdvancedFilter
        genresList={genres}
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />
      <ItemGrid items={data?.results} />
      <Pagination page={filters.page} onPageChange={setPage} />
    </div>
  )
}
```

---

## Troubleshooting

### Filter changes don't trigger refetch
- ✅ Make sure all filters are in queryKey
- ✅ Check hook is from correct import path

### Page doesn't reset to 1 after filter change
- ✅ Use `updateFilters()` not manual state update
- ✅ `updateFilters()` auto sets page=1

### URL not updating
- ✅ Ensure component wrapped in `<BrowserRouter>`
- ✅ Check `useMediaFilters` is inside router

### Shareable URLs not working
- ✅ Test with full URL: `?year=2024&genre=16&page=1`
- ✅ Verify all filter types are handled

---

## Browser Support

✅ Chrome, Firefox, Safari, Edge  
✅ Back/Forward buttons work  
✅ Bookmarkable  
✅ Shareable URLs  

---

## Performance

- 🚀 TanStack Query caching: 5min stale, 10min gc
- 🚀 placeholderData for smooth UX
- 🚀 No unnecessary re-renders
- 🚀 Efficient URL parsing

---

## Migration Checklist

- [ ] Create `useMediaFilters` hook
- [ ] Create `AdvancedFilter` component
- [ ] Update Movies page
- [ ] Update TV Shows page
- [ ] Update Search page
- [ ] Test URL state persistence
- [ ] Test back button
- [ ] Test shareable URLs
- [ ] Deploy to production

---

## Support & Questions

Refer to:
- **Architecture**: `URL_DRIVEN_FILTERING_GUIDE.md`
- **Migration**: `URL_DRIVEN_MIGRATION_GUIDE.md`
- **Example**: `MoviesPageExample.jsx`
- **Overview**: `URL_DRIVEN_DELIVERY_SUMMARY.md`

---

**Status: ✅ READY TO USE**

