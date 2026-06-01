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
import { AuthProvider } from './providers/AuthProvider'
import ProfileSelection from './profile/Profiles/ProfileSelection'
import ProfileManage from './profile/Profiles/ProfileManage'
import ProfileForm from './profile/Profiles/ProfileForm'
import PremiumContentGate from './components/common/PremiumContentGate/PremiumContentGate'

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
                <PremiumContentGate>
                  <MediaPlayer />
                </PremiumContentGate>
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

      // === NHÓM 3: PROFILE (KHÔNG CÓ NAVBAR/FOOTER) ===
      {
        path: '/profiles',
        element: <ProfileSelection />,
      },
      {
        path: '/profiles/manage',
        element: <ProfileManage />,
      },
      {
        path: '/profiles/add',
        element: <ProfileForm />,
      },
      {
        path: '/profiles/edit/:id',
        element: <ProfileForm />,
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
