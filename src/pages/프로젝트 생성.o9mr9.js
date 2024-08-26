// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
//  content body
// {
//   "data": {
//     "jobPostId": 2,
//     "title": "부산 강서구 명지동 빌리브 명시 듀클래스",
//     "tech": "NORMAL",
//     "startTime": "09:30:00",
//     "endTime": "18:00:00",
//     "workAddress": "부산 강서구 명지동 3605-6",
//     "distance": null,
//     "meal": false,
//     "pickup": true,
//     "pickupAddressList": [
//       "부산광역시 사하구 낙동대로 550번길 37",
//       "대한민국 부산광역시 서구 구덕로 225"
//     ],
//     "park": "FREE",
//     "parkDetail": "2번 GateWay 옆 공간",
//     "preparation": "작업복, 작업화",
//     "workDateResponseList": [
//       {
//         "workDateId": 3,
//         "date": "2024-08-01"
//       },
//       {
//         "workDateId": 4,
//         "date": "2024-08-02"
//       }
//     ],
//     "companyName": "삼성",
//     "manager": "이재용",
//     "phone": "01012345678",
//     "imageUrls": []
//   },
//   "message": "모집 공고 상세 화면 - 일반 반환 완료"
// }

import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';

var loginKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjYyMjY3NDB9.fztvihYHiIqMviCdHRxu5CBbCv9yN3gOIQy_8U4olMI`//session.getItem("loginKey");

// 페이지가 로드될 때 실행됩니다.
$w.onReady(function () {
    if(loginKey) {
      $w("#button21").label = "로그아웃"
      $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
      })
    }
    console.log(loginKey)
    $w("#text13").hide();
    $w("#button8").onClick(formSubmit);
});

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 폼 제출 함수
async function formSubmit(event) {
    //event.preventDefault(); // 기본 폼 제출 동작 방지

    // 입력 필드 값 가져오기
    const projectName = $w('#input1').value;
    let startDate = $w("#datePicker1").value;
    let startDate2 = formatDate(startDate);
    let endDate = $w("#datePicker2").value;
    const address = $w('#addressInput1').value;
    let today = new Date();
        today.setHours(0, 0, 0, 0); 
        let formattedToday = formatDate(today);

    $w("#myHtmlComponent").onMessage((event) => {
        const location = event.data;
        // 마커의 위치 정보를 받아서 처리할 수 있습니다.
        $w("#locationInput").value = `${location.lat}, ${location.lng}`;
    });

    if(projectName == "" || startDate == null || endDate == null || address == null) {
        $w("#text13").text = "빈칸을 모두 채워주세요";
        $w("#text13").show();
    }

    else if (startDate > endDate) {
        $w("#text13").text = "시작날짜가 끝나는 날짜보다 늦습니다.";
        $w("#text13").show();
    }

    else if (startDate2 == formattedToday) {
        $w("#text13").text = "시작날짜가 오늘입니다.";
        $w("#text13").show();
    }

    else {
        let startDate2 = formatDate(startDate);
        let endDate2 = formatDate(endDate);
        const latitude = address.location.latitude;
        const longitude = address.location.longitude;
    

        // 새로운 데이터 객체 생성
        const project = {
            "projectName" : projectName,
            "startDate" : startDate2,
            "endDate" : endDate2,
            "address" : address.formatted,
            "latitude" : latitude,
            "longitude" : longitude
        };
        console.log(project)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginKey}`
            },
            body: JSON.stringify(project)
        };

        // 외부 API에 데이터 삽입 요청
        fetch('https://asdfdsas.p-e.kr/api/project', options)
            .then(response => response.json())
            .then(data => {
                // 삽입 성공 시 처리
                // const fullData = { ...project, ...data };
                console.log("데이터 삽입 성공:", data);
                $w("#text13").text = "프로젝트 생성이 완료되었습니다.";
                $w("#text13").show();
                //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
                wixLocation.to(`/jobs-4`);
            })
            .catch((error) => {
                // 삽입 실패 시 처리
                console.error("데이터 삽입 실패:", error);
                //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
            });
        }
    }

