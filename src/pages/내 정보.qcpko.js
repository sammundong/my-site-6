// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";
import wixWindow from 'wix-window-frontend';

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
        $w("#text160").hide();
        const url = `https://asdfdsas.p-e.kr/api/member-info/company`
        var { data, message } = await getDataWithGetMethod(url, loginKey);

        if(!data.businessNumber) {
            $w("#section2").collapse();
            $w("#text159").text = "노동자 권한으로 로그인 되었습니다."
        }
        $w("#input1").value = data.businessNumber;
        $w("#input2").value = data.email;
        $w("#input3").value = data.companyName;
        $w("#input5").value = data.region;
        $w("#input4").value = data.manager;
        
        $w('#button8').onClick(async () => {

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

            let result = await wixWindow.openLightbox("내정보수정창");

                
            if(result == "confirmed") {
                // 새로운 데이터 객체 생성
                const project = {
                    "businessNumber": businessNumber,
                    "email": email,
                    "companyName": companyName,
                    "region": region,
                    "manager": manager
                }
                //console.log(project)
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
                        //$w("#text13").text = "정보 수정이 완료되었습니다.";
                        //$w("#text13").show();
                    })
                    .catch((error) => {
                        // 삽입 실패 시 처리
                        console.error("데이터 수정 실패:", error);
                        showErrorToUser1(error.message);
                    });
                }
            });

            $w('#button22').onClick( (event) => {

                const currentPassword =  $w("#input10").value;
                const newPassword = $w("#input9").value;
                const checkPassword = $w("#input8").value;

                const project = {
                    "currentPassword": currentPassword,
                     "newPassword": newPassword
                }
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginKey}`
                    },
                    body: JSON.stringify(project)
                };

                if(newPassword == checkPassword) {
                    fetch('https://asdfdsas.p-e.kr/api/member-info/password-validation', options)
                        .then(response => response.json())
                        .then(data => {
                            // 삽입 성공 시 처리
                            // const fullData = { ...project, ...data };
                            console.log("데이터 삽입 성공:", data);
                            $w("#text13").text = "비밀번호 수정이 완료되었습니다.";
                            $w("#text13").show();
                            wixLocation.to(`/`);
                        })
                        .catch((error) => {
                            // 삽입 실패 시 처리
                            console.error("데이터 수정 실패:", error);
                            showErrorToUser2(error.message);
                    });
                }
            })
        }
    else {
        $w("#section2").collapse();
        $w("#text159").text = "로그인 후 이용해주세요.";
    }
});

function showErrorToUser1(errorMessage) {
    $w("#text13").text = errorMessage;
    $w("#text13").show();
}

function showErrorToUser2(errorMessage) {
    $w("#text160").text = errorMessage;
    $w("#text160").show();
}