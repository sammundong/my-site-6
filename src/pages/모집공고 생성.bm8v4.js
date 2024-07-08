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
    const query = wixLocation.query;
    // 입력 필드 값 가져오기
    const projectName = $w('#input1').value;
    const tech = $w('#dropdown1').value;
    const people = $w('#input2').value;
    const money = $w('#input3').value;
    const startDate = $w('#input8').value
    const endDate = $w('#input8').value
    const workDateResponseList = []
    workDateResponseList.push({ 'workDateId' : 1,
                                'date' : $w('#input8').value});
    const startTime = $w('#timePicker1').value;
    const endTime = $w('#timePicker2').value;
    const address = $w('#addressInput1').value;
    const pickup = $w('#radioGroup1').value;
    const pickupAddressList = []
    if (pickup == "True") {
        pickupAddressList.push($w('#addressInput2').value)
    }
    const meal = $w('#radioGroup2').value;
    const park = $w('#radioGroup3').value;
    const parkDetail = $w('#input4').value;
    const preparation = $w('#input5').value;
    const companyName = $w('#input9').value;
    const manager = $w('#input6').value;
    const phone = $w('#input7').value;
    
    const latitude = address.location.latitude;
    const longitude = address.location.longitude;
 

    // 새로운 데이터 객체 생성
    const project = {
        "jobPostId": query.jobPostId,
        "projectName" : projectName,
        "tech" : tech,
        "startTime" : startTime,
        "endTime" : endTime,
        "address" : address.formatted,
        "latitude" : latitude,
        "longitude" : longitude,
        "distance": null,
        "meal" : meal,
        "pickup" : pickup,
        "pickupAddressList" : pickupAddressList,
        "park" : park,
        "parkDetail" : parkDetail,
        "preparation" : preparation,
        "workDateResponseList" : workDateResponseList,
        "companyName" : companyName,
        "manager" : manager,
        "phone" : phone,
        "imageUrls" : []
    };
    console.log(project)
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjA5NzA5MTB9.yg1G0zizw-BoGxcWGUPNgudBhi7CLsM1359eHYMOujQ'
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
        })
        .catch((error) => {
            // 삽입 실패 시 처리
            console.error("데이터 삽입 실패:", error);
            //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
        });
}

