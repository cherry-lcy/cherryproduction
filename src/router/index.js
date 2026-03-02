import {createBrowserRouter} from 'react-router-dom';
import Home from "../pages/Home";
import App from "../pages/Default";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/default",
        element: <App/>
    }
])

export default router;