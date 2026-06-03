import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { lazy } from 'react'
import {HomeProvider} from './providers/HomeProvider'
import AppProvider from './providers/AppProvider'
import MainLayout from './components/layouts/MainLayout'
import DetailProvider from './providers/DetailProvider'
import { AuthProvider } from './providers/AuthProvider'
import ScrollToTop from './utils/scrollToTop'
import { ToastContainer } from 'react-toastify'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Auth/Login/Login'))
const Register = lazy(() => import('./pages/Auth/Register/Register'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword/ForgotPassword'))
const MyList = lazy(() => import('./pages/MyList/MyList'))
const Search = lazy(() => import('./pages/Search/Search'))
const Movies = lazy(() => import('./pages/Movies'))
const TVShows = lazy(() => import('./pages/TVShows'))
const MediaDetails = lazy(() => import('./pages/MediaDetails/MediaDetails'))
const MediaPlayer = lazy(() => import('./pages/MediaPlayer/MediaPlayer'))
const PremiumCheckout = lazy(() => import('./pages/PremiumCheckout/PremiumCheckout'))
const AccountSettings = lazy(() => import('./pages/Account/AccountSettings'))

const PageLoader = () => <div className="min-h-screen flex items-center justify-center" />

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ScrollToTop />
        <Outlet />
        <ToastContainer position='bottom-right' autoClose={1000} theme='dark'/>
      </AuthProvider>
    </AppProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: (
              <Suspense fallback={<PageLoader />}>
                <HomeProvider>
                  <Home />
                </HomeProvider>
              </Suspense>
            ),
          },
          {
            path: '/movie/:slug',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DetailProvider>
                  <MediaDetails />
                </DetailProvider>
              </Suspense>
            ),
          },
          {
            path: '/video/:slug',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DetailProvider>
                  <MediaPlayer />
                </DetailProvider>
              </Suspense>
            ),
          },
          {
            path: '/my-list',
            element: (
              <Suspense fallback={<PageLoader />}>
                <MyList />
              </Suspense>
            ),
          },
          {
            path: '/premium',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PremiumCheckout />
              </Suspense>
            ),
          },
          {
            path: '/search',
            element: (
              <Suspense fallback={<PageLoader />}>
                <Search />
              </Suspense>
            ),
          },
          {
            path: '/movies',
            element: (
              <Suspense fallback={<PageLoader />}>

                  <Movies />

              </Suspense>
            ),
          },
          {
            path: '/tv-shows',
            element: (
              <Suspense fallback={<PageLoader />}>
                <TVShows />
              </Suspense>
            ),
          },
          {
            path: '/account',
            element: (
              <Suspense fallback={<PageLoader />}>
                <AccountSettings />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForgotPassword />
          </Suspense>
        ),
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

