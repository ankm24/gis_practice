// 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
var overlayOn = false,
    container = document.getElementById('container'),    // 지도와 로드뷰를 감싸고 있는 div
    mapWrapper = document.getElementById('mapWrapper'), // 지도를 감싸고 있는 div
    mapContainer = document.getElementById('map'),    // 지도를 표시할 div
    rvContainer = document.getElementById('roadview');   // 로드뷰를 표시할 div

var mapCenter = new kakao.maps.LatLng(35.869922, 128.614814),   // 지도의 중심좌표
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

// 마커 이미지 생성
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

// 드래그가 가능한 마커 생성 (기본 마커)
var marker = new kakao.maps.Marker({
    image: markImage,
    position:mapCenter,
    draggable: true
});

// 마커에 dragend 이벤트 등록
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

// 지도 위의 로드뷰 버튼을 눌렀을 때 호출되는 함수
function setRoadviewRoad() {
    var control = document.getElementById('roadviewControl');

    // 버튼을 눌린 상태가 아니면
    if (control.className.indexOf('active') === -1) {
        control.className = 'active';

        // 로드뷰 도로 오버레이가 보이게 합니다
        toggleOverlay(true);
    } else {
        control.className = '';

        // 로드뷰 도로 오버레이 제거
        toggleOverlay(false);
    }
}

// 로드뷰에서 x버튼을 눌렀을 때 로드뷰를 지도 뒤로 숨기는 함수
function closeRoadview() {
    var position = marker.getPosition();
    toggleMapWrapper(true,position);
}



// 지도 확대 축소를 제어할 수 있는 줌 컨트롤 생성
function zoomIn() {
    map.setLevel(map.getLevel()-1);
}
function zoomOut() {
    map.setLevel(map.getLevel()+1);
}

//지도 타입 바꾸기

// 지도에 추가된 지도타입정보를 가지고 있을 변수
var  currentTypeId;

// 내비게이션 메뉴를 클릭하면 호출되는 함수
function setOverlayMapTypeId(maptype) {
    var changeMaptype;

    //maptype에 따라 지도에 추가할 지도타입 결정
    if (maptype === 'terrain') {
        // 지형정보 지도타입
        changeMaptype = kakao.maps.MapTypeId.TERRAIN;
    }
    // 이미 등록된 지도 타입이 있으면 제거
    if (currentTypeId) {
        map.removeOverlayMapTypeId(currentTypeId);
    }
    // maptype에 해당하는 지도타입을 지도에 추가
    map.addOverlayMapTypeId(changeMaptype);

    // 지도에 추가된 타입정보 갱신
    currentTypeId = changeMaptype;
}

// 브이월드 지도 열기
function openMap(worldnav) {
    var openMap;

    if (worldnav === 'vworldmap') {
        location.href = 'vworldmap.html';
    }
}





//마커 위에 인포윈도우 생성하기
// 선언
var iwContent = '<div style="padding:5px;">인포윈도우</div>',
    iwPosition = new kakao.maps.LatLng(35.869922,128.614814);   // 인포윈도우 표시 위치

// 인포윈도우 생성
var infowindow = new kakao.maps.InfoWindow({
    position: iwPosition,
    content: iwContent,
    removable:true
});

// 인포윈도우 마우스오버 이벤트 등록
kakao.maps.event.addListener(marker,'mouseover',function () {
    infowindow.open(map,marker);
});
