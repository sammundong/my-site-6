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

// 페이지가 로드될 때 실행됩니다.
$w.onReady(function () {
    $w("#button8").onClick(formSubmit);
});

// 폼 제출 함수
async function formSubmit(event) {
    //event.preventDefault(); // 기본 폼 제출 동작 방지

    // 입력 필드 값 가져오기
    const projectName = $w('#input1').value;
    const startDate = $w('#input8').value
    const endDate = $w('#input8').value
    const address = $w('#addressInput1').value;
    
    const latitude = address.location.latitude;
    const longitude = address.location.longitude;
 

    // 새로운 데이터 객체 생성
    const project = {
        "projectName" : projectName,
        "startDate" : startDate,
        "endDate" : endDate,
        "address" : address.formatted,
        "latitude" : latitude,
        "longitude" : longitude
    };
    console.log(project)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjYyMjY3NDB9.fztvihYHiIqMviCdHRxu5CBbCv9yN3gOIQy_8U4olMI'
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
            //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
            wixLocation.to(`/jobs-4`);
        })
        .catch((error) => {
            // 삽입 실패 시 처리
            console.error("데이터 삽입 실패:", error);
            //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
        });
}

