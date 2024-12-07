// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import { session } from 'wix-storage-frontend';
import { uploadImage } from 'backend/media';
import wixData from 'wix-data';

$w.onReady(function () {
    let image = ""
    let wixUrl = ""
    const loginKey = session.getItem("loginKey");
    $w('#html1').onMessage((event) => {
        if (event.data.type === 'imageUploaded') {
            const imageData = event.data.data;

            uploadImage(imageData.base64, imageData.name)
                .then((imageUrl) => {
                    console.log('Uploaded Image URL:', imageUrl);
                    try {
                        const staticUrl = convertWixImageToStaticUrl(imageUrl);
                        console.log('Static URL:', staticUrl);
                        wixUrl = imageUrl;
                        image = staticUrl;
                    } catch (error) {
                        console.error(error.message);
                    }
                })
                .catch((error) => {
                    console.error('Image Upload Failed:', error);
                });
        }
    });

    // 업로드 버튼 클릭 이벤트
    $w("#button22").onClick(async () => {

        // FormData 생성
        const request = {
            title: "사하",
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
        const response1 = await fetch("https://static.wixstatic.com/media/763a49_faeb3fbab21d41c48a982317ef74aaec~mv2.png");
        
        const blob = await response.blob();
        const blob1 = await response1.blob();
        console.log(blob)
        console.log(blob1)

        const formData = new FormData();
        formData.append('request', JSON.stringify(request));
        
        let fileName = wixUrl.split('/').pop(); // URL에서 파일 이름 추출
        fileName = fileName.split('#')[0];
        console.log(fileName)
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

  function convertWixImageToStaticUrl(wixImageUrl) {
    // wix:image://로 시작하는지 확인
    if (wixImageUrl.startsWith('wix:image://')) {
        // 필요한 부분 추출
        const extractedPart = wixImageUrl.split('/')[3].split('#')[0]; // '763a49_87d35fcedda94fd29b80e0ae94875e36~mv2.png' 추출
        // 정적 URL 생성
        const staticUrl = `https://static.wixstatic.com/media/${extractedPart}`;
        return staticUrl;
    } else {
        throw new Error('Invalid wix:image URL format');
    }
}
  



