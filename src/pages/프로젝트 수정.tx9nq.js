// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';

var loginKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjYyMjY3NDB9.fztvihYHiIqMviCdHRxu5CBbCv9yN3gOIQy_8U4olMI`//session.getItem("loginKey");

$w.onReady(function () {
    if(loginKey) {
        $w("#button21").label = "로그아웃"
        $w("#button21").onClick(() => {
          session.removeItem("loginKey");
          $w("#button21").label = "로그인"
          wixLocation.to(`/`);
        })
      }
    $w('#button8').onClick( (event) => {
        // 새로운 데이터 객체 생성
        const project = {
            "projectId": 1,
            "name": "사하구 낙동5블럭 낙동강 온도 측정 센터 신축공사 ",
            "startDate": "2024-08-11",
            "endDate": "2024-12-01",
            "address": "부산광역시 사하구 낙동대로 550번길 37",
            "latitude": 35.116777388697734,
            "longitude": 128.9685393114043
          }
        console.log(project)
        const options = {
            method: 'PUT',
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
    });
});
