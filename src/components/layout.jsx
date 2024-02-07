/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react'
import { getRandomImage } from '../utils/setBackground';
import '../assets/styles/layout.css'
import { useSelector } from 'react-redux';

const Layout = ({Component}) => {
    
    const [background, setBackground] = useState(getRandomImage());
    useEffect(() => {
        const interval = setInterval(() => {
            setBackground(getRandomImage());
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const { isActive } = useSelector(state => state.timer);


  return (
    <div>
        <div id='background' className={isActive ? 'ghibli-background-start': 'ghibli-background-idle'} style={{ backgroundImage: `url(${background})`}}>
        </div>
        <Component />
    </div>
  )
}

Layout.propTypes = {
    
}

export default Layout