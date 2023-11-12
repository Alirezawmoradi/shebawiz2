import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import {useEffect} from "react";
import {useAppContext} from "./contexts/app/app-context.jsx";

function App() {
    const {theme} = useAppContext();
    useEffect(() => {
        const stylesheet = document.getElementById('theme-stylesheet');
        if (stylesheet) {
            stylesheet.href = `public/css/${theme}.css`;
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
        <RouterProvider router={router}/>
    )
}

export default App
