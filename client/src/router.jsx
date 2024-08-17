import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import VideoList from './pages/VideoList/VideoList';
import UploadVideo from './pages/UploadVideo/UploadVideo';
import Profile from './pages/Profile/Profile';
import AuthUser from './pages/AuthUser/AuthUser';
import Login from './pages/LoginUser/LoginUser';
import NoRegister from './pages/NoRegister/NoRegister';
import ProtectedRoute from './ProtectedRoute'
import ShowVideo from './pages/ShowVideo/ShowVideo';
import axios from 'axios';


const createRoutes = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '/',
          element: <VideoList />,
          loader: async () => {
            const response = await axios.get('http://localhost:3000/api/video');
            return response.data;
          },
        },
        {
          path: '/upload',
          element: (
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          ),
        },
        {
          path: '/auth',
          element: <AuthUser />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: '/no-register',
          element: <NoRegister />,
        },
        {
          path: '/show-video/:id', 
          element: <ShowVideo />,
        }
      ],
    },
  ]);
};

export default createRoutes;
