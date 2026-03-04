import {createBrowserRouter} from 'react-router-dom';
import Home from "../pages/Home";
import Search from "../pages/Search";
import Feedback from '../pages/Feedback';
import Detail from '../pages/Detail';

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
        path: "/feedback",
        element: <Feedback/>
    },
    {
        path: "/detail",
        element: <Detail/>
    }
])

export default router;