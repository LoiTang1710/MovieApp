import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Auth/Login/Login'
import Register from './pages/Auth/Register/Register'
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword'
import MyList from './pages/MyList/MyList'

import { HomeProvider } from './providers/HomeProvider'
import { AppProvider } from './providers/AppProvider'
import MainLayout from './components/layouts/MainLayout'
import MediaDetails from './pages/MediaDetails/MediaDetails'
import DetailProvider from './providers/DetailProvider'
import MediaPlayer from './pages/MediaPlayer/MediaPlayer'
import ScrollToTop from './utils/scrollToTop'
import PremiumCheckout from './pages/PremiumCheckout/PremiumCheckout'
import { AuthProvider } from './contexts/AuthContext'

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ScrollToTop />
        <Outlet />
      </AuthProvider>
    </AppProvider>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // === NHÓM 1: CÁC TRANG CÓ NAVBAR & FOOTER ===
      {
        element: <MainLayout />, // Đặt khung Layout ở đây
        children: [
          {
            path: '/',
            element: (
              <HomeProvider>
                <Home />
              </HomeProvider>
            ),
          },
          {
            path: '/movie/:slug',
            element: (
              <DetailProvider>
                <MediaDetails />
              </DetailProvider>
            ),
          },
          {
            path: '/video/:slug',
            element: (
              <DetailProvider>
                <MediaPlayer />
              </DetailProvider>
            ),
          },
          {
            path: '/my-list',
            element: <MyList />,
          },
          {
            path: '/premium',
            element: <PremiumCheckout />,
          },
        ],
      },

      // === NHÓM 2: CÁC TRANG ĐỘC LẬP (KHÔNG CÓ NAVBAR/FOOTER) ===
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
