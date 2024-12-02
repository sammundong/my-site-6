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
import { session } from 'wix-storage-frontend';
import wixWindow from 'wix-window-frontend';

//import { fetch } from 'wix-fetch';

var loginKey = session.getItem("loginKey");

var pickupAddressList = []
var workDate = []
let receivedMessage = null;

let imageUrls = []; // 업로드된 이미지 파일을 저장할 배열

// 페이지가 로드될 때 실행됩니다.
$w.onReady(function () {
    const query = wixLocation.query;
    $w("#button22").disable();
    try {
        if(!loginKey) {
            wixLocation.to(`/프로젝트관리`);
        }
        if(!query.projectId) {
            wixLocation.to(`/프로젝트관리`);
          }
        $w("#html1").hide();

        $w("#html1").onMessage((imageData) => {
            console.log("Received image data:", imageData);
            imageUrls.push(imageData);
        }); 

        $w("#html2").onMessage((event) => {
            receivedMessage = event.data;
            console.log(receivedMessage)
            $w("#text158").text = receivedMessage.address
        });

        $w("#radioGroup1").onClick((event) => {
            let selectedIndex = $w("#radioGroup1").selectedIndex;
            if(selectedIndex == 1) {
                $w("#button22").disable();
            }
            else {
                $w("#button22").enable();
            }
          });
        
        $w("#selectionTags2").options = workDate
        $w("#selectionTags1").options = pickupAddressList

        // 오늘 날짜 가져오기
        let today = new Date();
        
        // 내일 날짜 계산
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        // DatePicker의 최소 날짜를 내일로 설정
        $w("#datePicker1").minDate = tomorrow;
        $w("#datePicker1").value = tomorrow;

        $w("#text13").hide();

        $w("#button22").onClick(async () => {
            let result = await wixWindow.openLightbox("픽업장소창");

            pickupAddressList.push({
                'value':result.formatted,
                'label':result.formatted
            })
            $w("#selectionTags1").options = pickupAddressList
        });
        $w("#button26").onClick(async () => {
            let result = await wixWindow.openLightbox("작업일자창", query.projectId);
            console.log(result)
            workDate.push({
                'value':result,
                'label':result
            })
            $w("#selectionTags2").options = workDate
        });

        $w("#button8").onClick(formSubmit);
    } catch (error) {
        console.error('Error:', error);
        showErrorToUser(error.message);
    }
    $w("#button25").onClick(async () => {
        wixLocation.to(`/모집공고관리?projectId=${query.projectId}`);
      });
});

function showErrorToUser(errorMessage) {
    $w("#text13").text = errorMessage;
    $w("#text13").show();
  }

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
    for(let i=0; i<workDate.length; i++){
        dateList.push(workDate[i].value);
    }
    const startTime = $w('#timePicker1').value;
    const endTime = $w('#timePicker2').value;
    const address = receivedMessage;
    const pickup = ($w('#radioGroup1').value === 'False') ? false : true;

    const meal = ($w('#radioGroup2').value === 'false') ? false : true;
    const park = $w('#radioGroup3').value;
    const parkDetail = $w('#input4').value;
    const preparation = $w('#input5').value;
    const manager = "";
    const phone = "";
    const description = $w('#textBox1').value;
    let image = []
    let city = '';
    let district = '';
    // let type = []

    console.log(receivedMessage)
    if(receivedMessage) {

        const addressParts = receivedMessage.address.split(' ');
    
        // 각 단어를 순회하며 시와 군/구를 확인
        addressParts.forEach(part => {
            if (part.endsWith('시')) {
                city = part;
            } else if (part.endsWith('구') || part.endsWith('군')) {
                district = part;
            }
        });

        console.log(city);
        console.log(district);
    }

    if(title == "" || tech == "" || recruitNum == null || money == null || dateList == [] || startTime == "" || endTime == "" || address == null) {
        $w("#text13").text = "빈칸을 모두 채워주세요";
        $w("#text13").show();
    }

    else if(pickup == true && pickupAddressList == []) {
            $w("#text13").text = "픽업 주소를 추가해주세요";
            $w("#text13").show();
    }

    else if(park != "NONE" && parkDetail == "") {
        $w("#text13").text = "주차 정보 칸을 채워주세요";
        $w("#text13").show();
    }

    else {
        let imageList = null;
        imageList = imageList ? imageList : [];

        const latitude = address.lat;
        const longitude = address.lng;
    
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
            "address" : address.address,
            "latitude" : latitude,
            "longitude" : longitude,
            "city" : city,
            "district" : district,
            "dateList" : dateList,
            "pickupList" : pickupAddressList,
            "managerName" : manager,
            "phone" : phone,
            "description" : description,
            "projectId" : parseInt(query.projectId, 10)
        };

        const data = {   
            request : request
        }

        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(data.request)], {
            type: "application/json",
        }));

        // 파일 업로드 추가
        // const files = $w("#uploadButton1").value;

        /* if (files.length > 0) {
            //console.log("파일 업로드 시작...");
            //const uploadResults = await $w("#uploadButton1").uploadFiles();
            
            formData.append('imageList', `@${files[0].name};type=image/png`); // fileObject로 파일 추가
        } */
  
        formData.append('imageList', JSON.stringify(imageList));

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loginKey}`
            },
            body: formData
        };


        // 외부 API에 데이터 삽입 요청
        fetch(`https://asdfdsas.p-e.kr/api/job-post/company`, options)
            .then(response => response.json())
            .then(async data => {
                // 삽입 성공 시 처리
                // const fullData = { ...project, ...data };
                $w("#text13").text = "모집공고 생성이 완료되었습니다.";
                $w("#text13").show();
                console.log("데이터 삽입 성공:", data);
                //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
                if(data.message == "커스텀 예외 반환") {
                    if(data.data.errorMessage == "모집 공고 날짜가 프로젝트 기간에 포함되지 않습니다") {
                        $w("#text13").text = "모집 공고 날짜가 프로젝트 기간에 포함되지 않습니다";
                    }
                    else if(data.data.errorMessage == "프로젝트 정보가 없습니다.") {
                        $w("#text13").text = "모집공고를 참조하는 프로젝트가 없습니다. 프로젝트 관리로 들어가서 다시 시도해주십시오.";
                    }
                }
                else {
                    let result = await wixWindow.openLightbox("모집공고생성확인창");
                    if(result == "confirmed") {
                        wixLocation.to(`/모집공고관리?projectId=${query.projectId}`);
                    }
                }
            })
            .catch((error) => {
                // 삽입 실패 시 처리
                console.error("데이터 삽입 실패:", error);
                //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
        });
    }   
}

