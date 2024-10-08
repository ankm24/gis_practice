import {Vector as VectorLayer} from "ol/layer";
import {Vector as VectorSource} from "ol/source";
import {GeoJSON} from "ol/format";
import {Stroke, Style} from "ol/style";

const layers = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: "http://djgis.iptime.org:8000/geoserver/yeongju_a/wfs?typename=yeongju_a%3Aviw_wtl_pipe_lm&service=WFS&version=2.0.0&request=GetFeature&outputFormat=application%2Fjson&propertyName=geom,레이어"
    }),
    style: function (feature) {
        const [[x1, y1], [x2, y2]] = feature.getGeometry().getCoordinates().reverse();

        switch (feature.get("레이어")) {
            case "배수관": {
                return new Style({
                    stroke: new Stroke({
                        color: '#0033ff',
                        width: 1.5
                    })
                })
            }
            default: {
                return new Style({
                    stroke: new Stroke({
                        color: '#ff0000',
                        width: 1.5
                    })
                })
            }
        }
    }
})

export {layers}