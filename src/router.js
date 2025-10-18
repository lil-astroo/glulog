import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Records from './pages/Records';

let routes = [
    { path: '/login', element: <Login /> },
    { path: '/', element: <Home /> },
    { path: '/records', element: <Records /> },
    { path: '*', element: <Navigate to="/" /> }
]

export default routes;