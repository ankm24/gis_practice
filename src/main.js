import Map from "ol/Map";
import {default as defaultInteractions} from "./interaction";
import {onChangeCenter, onLoadEnd, view} from "./view";
import {layers} from "./layers";

//olMap을 지도옵션으로 생성
const olMap = new Map({
    interactions: defaultInteractions,
    layers: [
        layers
    ],
    target: "olmap",
    view: view
});

view.on('loadend', onLoadEnd);

view.on('change:center', onChangeCenter);

export {olMap}