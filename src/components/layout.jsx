/* eslint-disable react/prop-types */
import {useState, useEffect} from 'react'
import { getRandomImage } from '../utils/setBackground';
import '../assets/styles/layout.css'

const Layout = ({Component}) => {
    
    const [background, setBackground] = useState(getRandomImage());
    useEffect(() => {
        const interval = setInterval(() => {
            setBackground(getRandomImage());
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);


  return (
    <div>
        <div className='ghibli-background' style={{ backgroundImage: `url(${background})`}}>
        </div>
        <Component />
    </div>
  )
}

Layout.propTypes = {
    
}

export default Layout