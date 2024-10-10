import Map from "ol/Map";
import {default as defaultInteractions} from './Interaction';
import {onChangeCenter, onLoadEnd, view} from "./view"
import {layers} from "./layers";


//olMap을 지도옵션으로 생성
const olMap = new Map({
    interactions: defaultInteractions,
    layers: [
        layers
    ],
    target: "olMap",
    view: view
});

//모든 로드를 마치고 마지막에 현재지도의 줌level을 보여주는 이벤트
view.on('loadend', onLoadEnd);

//olMap에서 뷰값을 가져와서 센터값을 가져와서 카카오맵 센터 좌표를 따라 가게 만듬
view.on('change:center', onChangeCenter);

export {olMap}