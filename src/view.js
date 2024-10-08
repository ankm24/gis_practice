import {fromLonLat, toLonLat} from "ol/proj";
import {kakaoMap} from "./kakaomap"
import View from "ol/View";
import {default as epsg5187} from "./interaction";

const lonLatCoord = [128.624043, 36.805679];
const epsg5187Coord = fromLonLat(lonLatCoord, "EPSG:5187");

const view = new View({
    center: epsg5187Coord,
    zoom: 12.3,
    constrainResolution: false,
    constrainRotation: false,
    minZoom: 5.3,
    maxZoom: 14.3,
    projection: epsg5187,
    rotation: -0.02307,
})

function onLoadEnd() {
    const zoom = view.getZoom();
    const level = kakaoMap.getLevel();
    console.log(`ol: ${zoom} 카카오: ${level}`);
}

let currentZoom;
function onChangeCenter(event) {
    const center = event.target.GetCenter();
    const epsg4326center = toLonLat(center, 'EPSG:5187');
    console.log(epsg4326center);
    // setCenter api를 사용하기 위해 필요한 좌표로 변환
    var moveLatLon = new kakao.maps.LatLng(epsg4326center[1], epsg4326center[0]);
    console.log(moveLatLon)
    kakaoMap.setCenter(moveLatLon);
    if (view.getZoom() !== currentZoom) {
        const level = view.getZoom()    // olmap의 줌 레베을 가져옴 = 12.3
        console.log(level)
        const kakaolevel = map.getLevel()   //카카오맵 줌 레벨을 가져옴 = 3
        console.log(kakaolevel)
        kakaoMap.setLevel(15.3-level)
        console.log(`ol: ${view.getZoom()} 카카오1: ${kakaolevel}`);
        currentZoom = level;
    }
}

export {onChangeCenter, onLoadEnd, view}