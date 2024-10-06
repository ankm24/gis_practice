// 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
var overlayOn = false,
    container = document.getElementById('container'),    // 지도와 로드뷰를 감싸고 있는 div
    mapWrapper = document.getElementById('mapWrapper'), // 지도를 감싸고 있는 div
    mapContainer = document.getElementById('map'),    // 지도를 표시할 div
    rvContainer = document.getElementById('roadview');   // 로드뷰를 표시할 div

var mapCenter = new kakao.maps.LatLng(128.614814,35.869922),   // 지도의 중심좌표
    mapOption = {
        center: mapCenter,  // 지도의 중심좌표
        level: 3    // 지도의 확대 레벨
    };

// 지도 생성
var map = new kakao.maps.Map(mapContainer,mapOption);  // 지도 생성 및 객체 리턴

var rv = new kakao.maps.Roadview(rvContainer);  // 로드뷰 생성

// 좌표로부터 로드뷰 파노라마 id를 가져올 로드뷰 클라이언트 객체 생성
var rvClient = new kakao.maps.RoadviewClient();

// 로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트 등록
kakao.maps.event.addListener(rv,'position_changed', function () {
    // 현재 로드뷰의 위치 좌표를 얻어옵니다
    var rvPosition = rv.getPosition();

    //지도의 중심을 현재 로드뷰의 위치로 설정
    map.setCenter(rvPosition);

    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태면
    if (overlayOn) {
        // 마커의 위치를 현재 로드뷰의 위치로 설정
        marker.setPosition(rvPosition);
    }
});

// 로드뷰 마커 이미지 생성
var markImage = new kakao.maps.MarkerImage ('https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
    new kakao.maps.Size(26, 46), {
        // 스프라이트 이미지 사용
        // 스프라이트 이미지 전체 크기 지정
        spriteSize: new kakao.maps.Size(1666, 168),
        // 사용하고 싶은 영역의 좌상단 좌표 입력. background-posiiton으로 지정하는 값이며 부호는 반대
        spriteOrigin: new kakao.maps.Point(705, 114),
        offset: new kakao.maps.Point(13, 46)
    }
    );

// 드래그가 가능한 로드뷰 마커 생성 (기본 마커)
var marker = new kakao.maps.Marker({
    image: markImage,
    position:mapCenter,
    draggable: true
});

// 로드뷰 마커에 dragend 이벤트 등록
kakao.maps.event.addListener(marker,'dragend', function (mouseEvent) {
    // 현재 마커가 놓인 자리의 좌표
    var position = marker.getPosition();

    // 마커가 놓인 위치를 기준으로 로드뷰 설정
    toggleRoadview(position);
});

// 지도에 클릭 이벤트 등록
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수 호출
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    // 지도 위에 로드뷰 도로 오버레이가 추가된 상태가 아니면 클릭이벤트 무시
    if (!overlayOn) {
        return;
    }

    // 클릭한 위치의 좌표
    var position = mouseEvent.latLng;

    // 마커 위치를 클릭한 곳으로 이동
    marker.setPosition(position);

    // 클릭한 위치를 기준으로 로드뷰 설정
    toggleRoadview(position);
})

// 전달받은 좌표에 가까운 로드뷰의 파노라마 id를 추출하여 로드뷰 설정하는 함수
function toggleRoadview(position) {
    rvClient.getNearestPanoId(position,50,function (panoId) {
        // 파노라마 id가 null 이면 로드뷰 숨김
        if (panoId === null) {
            toggleMapWrapper(true,position);
        } else {
            toggleMapWrapper(false,position);

            // panoid로 로드뷰 설정
            rv.setPanoId(panoId, position);
        }
    });
}

// 지도를 감싸고 있는 div의 크기 조정하는 함수
function toggleMapWrapper(active,position) {
    if (active) {
        // 지도를 감싸고 있는 div의 너비가 100%가 되도록 class 변경
        container.className = '';

        // 지도의 크기가 변경되었기 때문에 relayout 함수 호출
        map.relayout();

        // 지도의 너비가 변경될 때 지도중심을 입력받은 위치로 설정
        map.setCenter(position);
    } else {

        // 지도만 보여지고 있는 상태면 지도의 너비가 50%가 되도록 class 변경해 로드뷰와 함께 표시
        if (container.className.indexOf('view_roadview') === -1) {
            container.className = 'view_roadview';

            // 지도의 크기가 변경되어 relayout 함수 호출
            map.relayout();

            // 지도의 너비가 변경될 때 지도중심을 입력받은 위치로 설정
            map.setCenter(position);
        }
    }
}

// 지도 위의 로드뷰 도로 오버레이를 추가, 제거하는 함수
function toggleOverlay(active) {
    if (active) {
        overlayOn = true;

        // 지도 위에 로드뷰 도로 오버레이 추가
        map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 마커를 지도에 표시
        marker.setMap(map);

        // 마커의 위치를 지도 중심으로 설정
        marker.setPosition(map.getCenter());

        // 로드뷰의 위치를 지도 중심으로 설정
        toggleRoadview(map.getCenter());
    } else {
        overlayOn = false;

        // 지도 위의 로드뷰 도로 오버레이 제거
        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

        // 지도 위의 마커 제거
        marker.setMap(null);
    }
}

var btnVisible = false;

// 지도 위의 로드뷰 버튼을 눌렀을 때 호출되는 함수
function setRoadviewRoad() {
    var control = document.getElementById('btn-map-roadviewControl');

    // 버튼을 눌린 상태가 아니면
    if (!btnVisible) {
        btnVisible = true;

        // 로드뷰 도로 오버레이가 보이게 합니다
        toggleOverlay(true);

    } else {
        btnVisible = false;

        // 로드뷰 도로 오버레이 제거
        toggleOverlay(false);

        var position = marker.getPosition();
        toggleMapWrapper(true,position);
    }
}

// 마커를 담을 배열
var markers = [];

// 장소 검색 객체 생성
var ps = new kakao.maps.services.Places();

// 키워드로 장소 검색
searchPlaces();

// 키워드 검색을 요청하는 함수
function searchPlaces() {
    var keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색 요청
    ps.keywordSearch(keyword,placesSearchCB);
}

// 키워드 검색 완료 시 호출되는 콜백함수
function placesSearchCB(data,status) {
    if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 검색 목록과 마커 표출
        displayPlaces(data);

        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
    }
}

    // 검색 결과 목록과 지도에 마커를 표시하는 함수
function displayPlaces(places) {

    var bounds = new kakao.maps.LatLngBounds();

    // 지도에 표시되고 있는 마커를 제거
    removeMarker();

    for (var i=0;i<places.length;i++) {
        // 마커를 생성하고 지도에 표시
        var placePosition = new kakao.maps.LatLng(places[i].y,places[i].x),
            marker = addMarker(placePosition,i);

        // 마커와 검색결과 항목에 mouseover 했을 때 해당 장소에 인포윈도우로 장소명 표시
        (function (marker,title) {
            kakao.maps.event.addListener(marker,'mouseover',function () {
                displayInfowindow(marker,title);
            });

        })(marker,places[i].place_name);

        bounds.extend(placePosition);
    }

    // 검색된 장소 위치를 기준으로 지도 범위 재설청
    map.setBounds(bounds);
}


// 마커를 생성하고 지도 위에 마커 표시
function addMarker(position) {

    var marker = new kakao.maps.Marker({
        position: position,
        map: map
    });

    marker.setMap(map); // 지도 위에 마커 표출
    markers.push(marker);   // 배열에 생성된 마커 추가

    return marker;
}

// 지도 위에 표시되고 있는 마커 모두 제거
function removeMarker() {
    for (var i=0;i<markers.length;i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
// 인포윈도우에 장소명 표시
function displayInfowindow(marker,title) {
    var infowindow = new kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;z-index: 3;">' + title + '</div>',
        removable:true
    });

    infowindow.open(map,marker);
}

// 지도 확대 축소를 제어할 수 있는 줌 컨트롤 생성
function zoomIn() {
    map.setLevel(map.getLevel()-1);
}
function zoomOut() {
    map.setLevel(map.getLevel()+1);
}

//지도 타입 바꾸기

function setTerrainMap() {
    var control = document.getElementById('btn-map-terrain');

    if (!btnVisible) {
        btnVisible = true;

        setOverlayMapTypeId(true);
    } else {
        btnVisible = false;

        setOverlayMapTypeId(false);
    }
}

// 내비게이션 메뉴를 클릭하면 호출되는 함수
function setOverlayMapTypeId(active) {
    if (active) {
        overlayOn = true;

        map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
    } else {
        overlayOn = false;

        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

    }
}

// 브이월드 지도 열기
function setVworldMap() {
    var control = document.getElementById('btn-map-vworldmap');

    if (!btnVisible) {
        btnVisible = true;

        openMap(true);
    }
}

function openMap(active) {

    if (active) {
        overlayOn = true;

        map.OverlayMapTypeId(kakao.maps.MapTypeId.VWORLDMAP);

        marker.setMap(map);

        marker.setPosition(map.getCenter());

        toggleVworld(map.getCenter());
    } else {
        overlayOn = false;

        map.removeOverlayMapTypeId(kakao.maps.MapTypeId.VWORLDMAP);

        marker.setMap(null);
    }
}


