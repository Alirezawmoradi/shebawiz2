import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import {useEffect} from "react";
import {useAppContext} from "./contexts/app/app-context.jsx";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import { Helmet, HelmetProvider } from 'react-helmet-async';


function App() {
    const {theme} = useAppContext();
    useEffect(() => {
        const stylesheet = document.getElementById('theme-stylesheet');
        if (stylesheet) {
            stylesheet.href = `/css/${theme}.css`;
            if (theme === 'light') {
                document.body.style.backgroundColor = '#DAD7D7';
                document.body.style.transition = 'all 0.3s ease'
            } else {
                document.body.removeAttribute('style');
                document.body.style.transition = 'all 0.3s ease'
            }
        }
    }, [theme]);
    return (
        <>
            <HelmetProvider>
                <RouterProvider router={router}/>
                <ToastContainer rtl={true}/>
            </HelmetProvider>
        </>
    )
}

export default App
