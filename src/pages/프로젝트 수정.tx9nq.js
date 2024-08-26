// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";

var loginKey = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjYyMjY3NDB9.fztvihYHiIqMviCdHRxu5CBbCv9yN3gOIQy_8U4olMI`//session.getItem("loginKey");
const query = wixLocation.query;

$w.onReady(async function () {
    if(loginKey) {
        $w("#button21").label = "로그아웃"
        $w("#button21").onClick(() => {
          session.removeItem("loginKey");
          $w("#button21").label = "로그인"
          wixLocation.to(`/`);
        })
      }
    $w("#text13").hide();
    const url = `https://asdfdsas.p-e.kr/api/project/${query.projectId}`
    var { data, message } = await getDataWithGetMethod(url, loginKey);

    const startDate_bv = new Date(data.startDate); 
    const endDate_bv = new Date(data.endDate); 
     
    $w("#input1").value = data.projectName;
    $w("#datePicker1").value = startDate_bv;
    $w("#datePicker2").value = endDate_bv;
    $w("#addressInput1").value = {
        formatted: data.address,
        location: {
            latitude: data.latitude,
            longitude: data.longitude
        }
    };
    
    $w('#button8').onClick( (event) => {
    
        let latitude;
        let longitude;

        const projectName =  $w("#input1").value;
        const startDate = $w("#datePicker1").value;
        let startDate2 = formatDate(startDate);
        const endDate = $w("#datePicker2").value;
        const address = $w("#addressInput1").value;
        if(data.address == address) {
            latitude = data.latitiude;
            longitude = data.longitude;
        }
        else {
            console.log(startDate2)
            latitude = address.location.latitude;
            longitude = address.location.longitude;
        }
        
        let today = new Date();
        today.setHours(0, 0, 0, 0); 
        let formattedToday = formatDate(today);

        if(projectName == "" || startDate == null || endDate == null || address == null) {
            $w("#text13").text = "빈칸을 모두 채워주세요";
            $w("#text13").show();
        }

        else if (startDate > endDate) {
            $w("#text13").text = "시작날짜가 끝나는 날짜보다 늦습니다.";
            $w("#text13").show();
        }

        else if (startDate2 == formattedToday) {
            $w("#text13").text = "시작날짜가 오늘입니다.";
            $w("#text13").show();
        }
            
        else {
            // 새로운 데이터 객체 생성
            const project = {
                "projectId": query.projectId,
                "name": projectName,
                "startDate": startDate2,
                "endDate": formatDate(endDate),
                "address": address.formatted,
                "latitude": latitude,
                "longitude": longitude
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
                $w("#text13").text = "프로젝트 수정이 완료되었습니다.";
                $w("#text13").show();
                //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
                wixLocation.to(`/jobs-4`);
            })
            .catch((error) => {
                // 삽입 실패 시 처리
                console.error("데이터 수정 실패:", error);
                //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
            });
        }
    });
});

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

