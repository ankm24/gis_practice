import {fromLonLat, toLonLat} from "ol/proj";
import View from "ol/View";
import {kakaoMap} from './kakaomap';
import {default as epsg5187} from './projection';

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
    rotation: -0.02307, //맵을 회전시킴
})

function onLoadEnd() {
    const zoom = view.getZoom();
    const level = kakaoMap.getLevel();
    console.log(`ol: ${zoom} 카카오: ${level}`);
}

let currentZoom;//현재 정보, 유지되어야 하는 값, 프로그래밍 용어: 상태 state = 지금 현재 정보
function onChangeCenter(event) {
    const center = event.target.getCenter();
    const epsg4326center = toLonLat(center, 'EPSG:5187');// toLonLat은 첫번째로 들어온 인자(경도와 위도 순으로 들어와야됨) 가들어오고 두번째 인자에는 첫번째 인자좌표가 어떤 좌표인지 알려줘야함)
    console.log(epsg4326center);
    var moveLatLon = new kakao.maps.LatLng(epsg4326center[1], epsg4326center[0]); //setCenter api를 사용하기위해 필요한 좌표로 변환하기 위해서 필요한 작업
    console.log(moveLatLon)
    kakaoMap.setCenter(moveLatLon);
    if (view.getZoom() !== currentZoom) {//줌 레벨 변경시에만 실행되도록 하기위해 필요한 if
        const level =view.getZoom()//olMap의 줌레벨을 가져옴 현재 기본 12.3
        console.log(level)
        const kakaolevel = kakaoMap.getLevel()//KakaoMap의 줌레벨을 가져옴 현재 기본 3
        console.log(kakaolevel)
        kakaoMap.setLevel(15.3 - level)
        console.log(`ol: ${view.getZoom()} 카카오1: ${kakaolevel}`);
        currentZoom = level;
    }
}
// export default view
export { onChangeCenter, onLoadEnd, view }
