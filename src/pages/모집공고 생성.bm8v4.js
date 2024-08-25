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

import { query } from 'wix-data';
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';

//import { fetch } from 'wix-fetch';

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
    $w("#text13").hide();
    $w("#button8").onClick(formSubmit);
});

// 폼 제출 함수
async function formSubmit() {
    //event.preventDefault(); // 기본 폼 제출 동작 방지
    const query = wixLocation.query;
    // 입력 필드 값 가져오기
    const title = $w('#input1').value;
    const tech = $w('#dropdown1').value;
    const recruitNum = parseInt($w('#input2').value, 10);
    const money = parseInt($w('#input3').value, 10);
    const dateList = []
    let date = $w("#datePicker1").value;
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    const date_st = `${year}-${month}-${day}`;
    dateList.push(date_st);
    const startTime = $w('#timePicker1').value;
    const endTime = $w('#timePicker2').value;
    const address = $w('#addressInput1').value;
    const pickup = ($w('#radioGroup1').value === 'False') ? false : true;
    const pickupAddressList = []
    console.log(pickup)
    console.log($w('#radioGroup1').value)
    if (pickup == true) {
        pickupAddressList.push($w('#addressInput2').value.formatted)
    }
    const meal = ($w('#radioGroup2').value === 'false') ? false : true;
    const park = $w('#radioGroup3').value;
    const parkDetail = $w('#input4').value;
    const preparation = $w('#input5').value;
    const manager = $w('#input6').value;
    const phone = $w('#input7').value;
    const images = $w("#uploadButton1").value
    let image = []
    // let type = []
    
    if(title == "" || tech == "" || recruitNum == null || money == null || date == null || startTime == "" || endTime == "" || address == null || manager == "" || phone == "" || preparation == "") {
        if((pickup == true && pickupAddressList == []) || (park != "NONE" && parkDetail == ""))
        $w("#text13").text = "빈칸을 모두 채워주세요";
        $w("#text13").show();
    }

    else {
        let imageList = null;
        imageList = imageList ? imageList : [];

        const latitude = address.location.latitude;
        const longitude = address.location.longitude;
    
        console.log(dateList)
        // 새로운 데이터 객체 생성
        const request = {
            "title" : title,
            "tech" : tech,
            "startTime" : startTime,
            "endTime" : endTime,
            "recruitNum" : recruitNum,
            "wage" : money,
            "preparation" : preparation,
            "parkDetail" : parkDetail,
            "meal" : meal,
            "pickup" : pickup,
            "park" : park,
            "address" : address.formatted,
            "latitude" : latitude,
            "longitude" : longitude,
            "dateList" : dateList,
            "pickupList" : pickupAddressList,
            "managerName" : manager,
            "phone" : phone,
            "projectId" : parseInt(query.projectId, 10)
        };

        const data = {   
            request : request
        }

        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(data.request)], {
            type: "application/json",
        }));

        if (images == null) {
            // 이미지 리스트가 null일 경우 빈 배열을 전송
            console.log('No images to upload');
        } else {
            images.forEach((image, index) => {
                formData.append('imageList', image); // 파일 자체를 추가
            });
            
            console.log('Images appended to FormData');
        }

        console.log(request)
        const options = {
            method: 'POST',
            headers: {
                //'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${loginKey}`
            },
            body: formData
        };

        // 외부 API에 데이터 삽입 요청
        fetch(`https://asdfdsas.p-e.kr/api/job-post/company`, options)
            .then(response => response.json())
            .then(data => {
                // 삽입 성공 시 처리
                // const fullData = { ...project, ...data };
                $w("#text13").text = "프로젝트 생성이 완료되었습니다.";
                $w("#text13").show();
                console.log("데이터 삽입 성공:", data);
                //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
                wixLocation.to(`/general-4?projectId=${query.projectId}`);
            })
            .catch((error) => {
                // 삽입 실패 시 처리
                console.error("데이터 삽입 실패:", error);
                //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
        });
    }   
}

