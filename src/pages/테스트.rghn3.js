// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import { session } from 'wix-storage-frontend';
import { uploadImage } from 'backend/upload';

$w.onReady(function () {
    let image = ""
    const loginKey = session.getItem("loginKey");
    
    $w("#uploadButton1").onChange((event) => {
        // 사용자가 파일을 업로드하면 실행되는 코드
        let uploadedFile = event.target.value[0]; // 업로드된 파일 정보
        
        if (uploadedFile) {
            // 이미지 URL 가져오기
            uploadedFile.getFileUrl()
                .then((url) => {
                    console.log("업로드된 이미지 URL:", url);
                    image = url;
                    // URL을 다른 곳에서 사용하거나, 예를 들어 이미지 요소에 표시
                    //$w("#image1").src = url;
                })
                .catch((error) => {
                    console.error("파일 URL을 가져오는 데 오류가 발생했습니다:", error);
                });
        }
    });

    // 업로드 버튼 클릭 이벤트
    $w("#button22").onClick(async () => {

        // FormData 생성
        const request = {
            title: "사하구sss  낙동5블럭낙동강온도 측정 센터 신축공사",
            tech: "NORMAL",
            startTime: "18:00:00",
            endTime: "18:00:00",
            recruitNum: 60,
            wage: 150000,
            preparation: "작업복, 작업화",
            parkDetail: "2번 GateWay 옆 공간",
            meal: true,
            pickup: true,
            park: "FREE",
            address: "부산광역시 사하구 낙동대로 550번길 37",
            latitude: 35.116777388697734,
            longitude: 128.9685393114043,
            city: "부산광역시",
            district: "사하구",
            dateList: ["2024-12-11", "2024-12-22"],
            pickupList: [
                "부산광역시 사하구 낙동대로 550번길 37",
                "대한민국 부산광역시 서구 구덕로 225"
            ],
            managerName: "홍길동",
            phone: "01012345678",
            description: "주요업무\n(업무내용)\n- 건축구조물의 내·외벽, 바닥, 천장 등에 각종 장비를 사용해 타일을 시멘트 또는 기타 접착제로 붙여서 마감\n- 주택, 상업시설, 문화시설 등의 고품질화\n- 외벽, 바닥, 천정 등에 각종 도기류 및 화학 제품류의 타일을 접착\n",
            projectId: 54
        };

        const response = await fetch(image); //url 넣으면 잘됨
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], { type: "application/json" }));

        const fileName = image.split('/').pop(); // URL에서 파일 이름 추출
        formData.append('imageList', blob, fileName); // FormData에 파일 추가

        // API 요청
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loginKey}`,
            },
            body: formData,
        };

        try {
            const response = await fetch("https://asdfdsas.p-e.kr/api/job-post/company", options);
            const data = await response.json();

            if (response.ok) {
                console.log("good")
                $w("#text13").text = "모집공고 생성이 완료되었습니다.";
            } else {
                console.error("오류 발생:", data);
                $w("#text13").text = "모집공고 생성 중 오류가 발생했습니다.";
            }
        } catch (error) {
            console.error("요청 실패:", error);
            $w("#text13").text = "서버와 통신 중 오류가 발생했습니다.";
        }
    });
});


