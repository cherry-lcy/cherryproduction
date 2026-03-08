import {createBrowserRouter} from 'react-router-dom';
import Home from "../pages/Home";
import Search from "../pages/Search";
import Detail from '../pages/Detail';
import AdminLogin from "../pages/AdminLogin";
import AdminUpload from "../pages/AdminUpload";

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
        path: "/admin/login",
        element: <AdminLogin/>
    },
    {
        path: "/admin/upload",
        element: <AdminUpload/>
    }
])

export default router;