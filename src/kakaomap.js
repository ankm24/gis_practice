var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(36.805679, 128.624043), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
        draggable: false,
        disableDoubleClick: true,
        disableDoubleClickZoom: true,
        scrollwheel: false,
        tileAnimation: false,
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
kakaoMap.setMinLevel(1);
kakaoMap.setMaxLevel(9);

const viewSyncOptions = {
    zoom: {
        base: 12.3,
        max: 14,
        decimal: 0.3,
        coefficient: -1,
        delta: 15,
    },
    rotation: -0.02307
}


// 마커가 표시될 위치입니다
var markerPosition = new kakao.maps.LatLng(36.805679, 128.624043);

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(kakaoMap);

var iwContent = '<div style="padding-left:18px; padding-right:5px; font-weight: bold;">Yeongju City Hall</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwPosition = new kakao.maps.LatLng(36.805679, 128.624043), //인포윈도우 표시 위치입니다
    iwRemoveable = false; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    position: iwPosition,
    content: iwContent,
    removable: iwRemoveable
});

// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
infowindow.open(kakaoMap, marker);

export { kakaoMap, viewSyncOptions, mapContainer, marker }
