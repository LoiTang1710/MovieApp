import { HomeProvider } from './contexts/HomeContext'
import Home from './pages/Home/Home'

function App() {
  return (
    <div>
      <HomeProvider>
        <Home />
      </HomeProvider>
    </div>
  )
}

export default App
