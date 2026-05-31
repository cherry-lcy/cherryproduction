import {createBrowserRouter} from 'react-router-dom';
import Home from "../pages/Home";
import Search from "../pages/Search";
import Detail from '../pages/Detail';
import AdminLogin from "../pages/AdminLogin";
import AdminUpload from "../pages/AdminUpload";
import Privacy from '../pages/Privacy';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/search",
        element: <Search/>
    },
    {
        path: "/detail",
        element: <Detail/>
    },
    {
        path: "/privacy",
        element: <Privacy/>
    },
    {
        path: "/admin/login",
        element: <AdminLogin/>
    },
    {
        path: "/admin/upload",
        element: <AdminUpload/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
])

export default router;