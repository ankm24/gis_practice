import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import View from "ol/View.js";
import MAP from "ol/Map.js";
import XYZ from 'ol/source/XYZ.js';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { Projection, fromLonLat } from 'ol/proj.js';
import { TileGrid } from 'ol/tilegrid.js';

proj4.defs('EPSG:5181', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs');
register(proj4);

const kakao = new Projection({
    code: "EPSG:5181",
    extent: [-30000, -60000,494288,988576], // 지도 범위설정
});

const map = new MAP({
    layers: [
        new TileLayer({
        source: new XYZ({
            projection : kakao,
            url: 'http://map.daumcdn.net/net/map_k3f_prod/bakery/image_map_png/PNGSD01/v21_cclzf/{z}/{-y}/{x}.png',
            tileGrid : new TileGrid({
                extent : [-30000, -60000, 494288, 988576],
                resolutions : [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
            }),
            tileLoadFunction: function (i, src) {
                let a = src.split('v21_cclzf/');
                let b = a[1].split('/');
                let z = Number(b[0]);
                let tZ = 14 -z;
                i.getImage().src = src.replace('/' + z + '/', '/' + tZ + '/');
            },
        }),
            type: 'Tile'
})
    ],
    view: new View({
    projection : kakao,
    center: fromLonLat([128.940775, 35.97005278], kakao),
    extent: [261366.037460875, 216430.6425167995, 507126.037460875, 323310.6425167995],
    zoom : 11,
    minZoom : 5
    })
});