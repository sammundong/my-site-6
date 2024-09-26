// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";

var loginKey = session.getItem("loginKey");
const query = wixLocation.query;

$w.onReady(async function () {
    if(loginKey) {
        $w("#button21").label = "로그아웃"
        $w("#button21").onClick(() => {
          session.removeItem("loginKey");
          $w("#button21").label = "로그인"
          wixLocation.to(`/`);
        })
        $w("#section3").collapse();
        $w("#text13").hide();
        const url = `https://asdfdsas.p-e.kr/api/member-info/company`
        var { data, message } = await getDataWithGetMethod(url, loginKey);

        $w("#input1").value = data.businessNumber;
        $w("#input2").value = data.email;
        $w("#input3").value = data.companyName;
        $w("#input5").value = data.region;
        $w("#input4").value = data.manager;
        
        $w('#button8').onClick( (event) => {

            const businessNumber =  $w("#input1").value;
            const email = $w("#input2").value;
            const companyName = $w("#input3").value;
            const region = $w("#input5").value;
            console.log(region);
            const manager = $w("#input4").value;

            if(businessNumber == "" || email == "" || companyName == "" || region == "" || manager == "") {
                $w("#text13").text = "빈칸을 모두 채워주세요";
                $w("#text13").show();
            }

                
            else {
                // 새로운 데이터 객체 생성
                const project = {
                    "businessNumber": businessNumber,
                    "email": email,
                    "companyName": companyName,
                    "region": region,
                    "manager": manager
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
                fetch('https://asdfdsas.p-e.kr/api/member-info/company', options)
                .then(response => response.json())
                .then(data => {
                    // 삽입 성공 시 처리
                    // const fullData = { ...project, ...data };
                    console.log("데이터 삽입 성공:", data);
                    $w("#text13").text = "정보 수정이 완료되었습니다.";
                    $w("#text13").show();
                    //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
                    wixLocation.to(`/`);
                })
                .catch((error) => {
                    // 삽입 실패 시 처리
                    console.error("데이터 수정 실패:", error);
                    //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
                });
            }
        });
    }
    else {
        $w("#section2").collapse();
        $w("#text159").text = "로그인 후 이용해주세요.";

    }
});