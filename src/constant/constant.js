export let BACKEND_URL = 'http://localhost:4100';

if (process.env.NODE_ENV === 'prod') {
    BACKEND_URL = 'http://localhost:4100';
} else if(process.env.NODE_ENV === 'staging') {
    BACKEND_URL = 'http://localhost:4100';
}

export const COLORS = {
    blue: '#1E90FF',
    blueGreen: '#25B0B9',
    yellow: '#FFD81B',
    green: '#95F189',
    orange: '#FF991B',
    skyBlue: '#1BE1FF',
    grey: '#3D3D3D',
    light_grey: '#C1C1C1',
    white: '#fff',
    black: '#000',
    black_opacity: '#00000050',
    white_opacity: '#ffffff70',
    grey_opacity: '#ffffff20',
};