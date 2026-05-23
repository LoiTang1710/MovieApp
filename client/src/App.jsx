import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import MyList from './pages/MyList/MyList'
import { AuthProvider } from './providers/AuthProvider'
import { HomeProvider } from './providers/HomeProvider'
import { AppProvider } from './providers/AppProvider'
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import { ProfileSelection, ProfileManage, ProfileForm } from './pages/Profiles'

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
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
            path: '/my-list',
            element: <MyList />,
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

      // === NHÓM 3: TRANG QUẢN LÝ HỒ SƠ (AuthLayout) ===
      {
        path: '/profiles',
        element: <AuthLayout><ProfileSelection /></AuthLayout>,
      },
      {
        path: '/profiles/manage',
        element: <AuthLayout><ProfileManage /></AuthLayout>,
      },
      {
        path: '/profiles/add',
        element: <AuthLayout><ProfileForm /></AuthLayout>,
      },
      {
        path: '/profiles/edit/:id',
        element: <AuthLayout><ProfileForm /></AuthLayout>,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
