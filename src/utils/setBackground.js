import IMAGES from './imagesInfo.json';

export function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * IMAGES.length);
    return IMAGES[randomIndex].path
}