// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
//  content body
/* {
  "title": "사하구  낙동5블럭  낙동강 온도 측정 센터 신축공사",
  "tech": "NORMAL",
  "startTime": "18:00:00",
  "endTime": "18:00:00",
  "recruitNum": 60,
  "wage": 150000,
  "preparation": "작업복, 작업화",
  "parkDetail": "2번 GateWay 옆 공간",
  "meal": true,
  "pickup": true,
  "park": "FREE",
  "address": "부산광역시 사하구 낙동대로 550번길 37",
  "latitude": 35.116777388697734,
  "longitude": 128.9685393114043,
  "dateList": [
    "2024-01-01",
    "2024-01-02"
  ],
  "pickupList": [
    "부산광역시 사하구 낙동대로 550번길 37",
    "대한민국 부산광역시 서구 구덕로 225"
  ],
  "managerName": "홍길동",
  "phone": "01012345678",
  "projectId": 1
} */

import wixLocation from 'wix-location-frontend';

let i = 1;
// 페이지가 로드될 때 실행됩니다.
$w.onReady(function () {
    $w("#button8").onClick(formSubmit);
});

// 폼 제출 함수
async function formSubmit(event) {
    //event.preventDefault(); // 기본 폼 제출 동작 방지
    
    // 입력 필드 값 가져오기
    const title = $w('#input1').value;
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
        "title" : title,
        "tech" : tech,
        "startTime" : startTime,
        "endTime" : endTime,
        "recuitNum" : people,
        "wage" : money,
        "preparation" : preparation,
        "parkDetail" : parkDetail,
        "meal" : meal,
        "pickup" : pickup,
        "park" : park,
        "address" : address.formatted,
        "latitude" : latitude,
        "longitude" : longitude,
        "dateList" : workDateResponseList,
        "pickupList" : pickupAddressList,
        "managerName" : manager,
        "phone" : phone,
        "projectId" : i
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
            i++;
            //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
        })
        .catch((error) => {
            // 삽입 실패 시 처리
            console.error("데이터 삽입 실패:", error);
            //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
        });
}

