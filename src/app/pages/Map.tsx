// export default function AppMap(){
//     return (<div>map</div>)
// }

// src/Map.js

import Map from 'react-map-gl';


const AppMap = () => {
    return (
        <div >
            <Map
                mapboxAccessToken="pk.eyJ1IjoibHVjYXMtcnlhbiIsImEiOiJjbTFiZ3h5bnkwbnlyMmtwd3g3Y2ptZW91In0.ek8hIfI7hjKGB-OhoRMs4Q"
                initialViewState={{
                    longitude: -80.23466,
                    latitude: 26.17356,
                    zoom: 12,
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/lucas-ryan/cm1boeydo00mf01nw37f1a4hb" />
            </div>
    );
};


export default AppMap;
