// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world


import wixLocation from 'wix-location-frontend';
import wixWindow from 'wix-window-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";
import { getApiKey, kakaoApiKey } from "backend/apikey.jsw";
import { session } from 'wix-storage-frontend';

var loginKey = session.getItem("loginKey");

$w.onReady(async function () {
    // Write your JavaScript here
    if(loginKey) {
      $w("#button21").label = "로그아웃"
      $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
      })
    }
    const query = wixLocation.query;
    const url = `https://asdfdsas.p-e.kr/api/job-post/worker/${query.jobPostId}`
    var { data, message } = await getDataWithGetMethod(url, loginKey);
    
    console.log(data);
    // title
    $w("#text126").text = data.title;
    $w("#text136").text = data.title;

    // 근무 환경
    var sectionTag = []
    if(data.pickup == true) {
      sectionTag.push( {'label':'픽업장소 지원','value':`${data.pickup}`});
      var pickupAddress = data.pickupAddressList.join('\n\n');
      $w("#text157").text = pickupAddress;
    }
    else {
      $w("#text157").text = "제공하지 않음";
    }

    if(data.meal == true) {
      sectionTag.push( {'label':'식사','value':`${data.meal}`});
      $w("#text156").text = "식사 제공";
    }
    else {
      $w("#text156").text = "제공하지 않음";
    }
    //park free가 아닌 경우
    if(data.park == "FREE") {
      sectionTag.push( {'label':'주차무료','value':`${data.park}`});
      $w("#text155").text = data.parkDetail;
    }
    else if(data.park == "PAID") {
      sectionTag.push( {'label':'주차우료','value':`${data.park}`});
      $w("#text155").text = data.parkDetail;
    }
    else {
      $w("#text155").text = "제공하지 않음";
    }
      
    $w("#selectionTags4").options = sectionTag;
    
    $w("#text151").text = data.preparation;
    
    // 이거 예외처리 생각
    var recruitNum = data.workDateResponseList[0].recruitNum;
    if(recruitNum == null) {
      recruitNum = 0;
    } 
    // 모집 인원
    $w("#text124").text = `인원 ${recruitNum} 명`;
    $w("#text142").text = `${recruitNum} 명`;

    // 근무 기간
    var startDate = data.workDateResponseList[0].date;
    var endDate = data.workDateResponseList[data.workDateResponseList.length-1].date
    var resultDate = ""
    for(let i=1;i<data.workDateResponseList.length;i++) {
      var date1 = new Date(startDate);
      var date2 = new Date(data.workDateResponseList[i].date);
      var date3 = new Date(endDate);
      if (date1 > date2) {
        startDate = data.workDateResponseList[i].date;
      }
      if (date2 > date3) {
        endDate = data.workDateResponseList[i].date;
      }
    }
    if (startDate == endDate) {
      resultDate = startDate;
    }
    else {
      resultDate = startDate + " ~ " + endDate;
    }
    $w("#text130").text = resultDate;
    $w("#text147").text = resultDate;

    //노동 시간
    var resultTime = data.startTime.slice(0,5) + " ~ "+ data.endTime.slice(0,5);
    $w("#text131").text = resultTime
    $w("#text146").text = resultTime

    //급여
    var amount = Number(data.wage);
    var formmatedAmout = amount.toLocaleString('ko-KR');
    $w("#text135").text = `${formmatedAmout} 원`
    $w("#text143").text = `${formmatedAmout} 원`

    // 직종
    if (data.tech == "NORMAL") {
      $w("#title").text = "보통인부";
      $w("#text141").text = "보통인부";
    }
      
    else if (data.tech == "TILE") {
      $w("#title").text = "타일";
      $w("#text141").text = "타일";
    }
      
    //작업 장소
    $w("#text132").text = data.workAddress
    $w("#text149").text = data.workAddress
    // 지도
    const mapUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(data.workAddress)}`
    const ApiKey = await getApiKey() //"483e4425efc50d6891881bece6845a9e"
    const mapResponse = await fetch(mapUrl, {
      method: "GET",
      headers: {
        'Authorization': `KakaoAK ${ApiKey}`
      },
    })
    const mapdata = await mapResponse.json();
    if (mapdata.documents && mapdata.documents.length > 0) {
      const { x, y, description } = mapdata.documents[0];
      $w("#googleMaps1").location = {
        "latitude": y*1,
        "longitude": x*1,
        "description": description
      };
    } else {
      console.log('No documents found');
    }

    // 담당자 정보
    $w("#text133").text = data.companyName
    $w("#text168").text = data.companyName
    $w("#text166").text = data.phone
    $w("#text167").text = data.manager

    $w("#text174").text = data.description

    $w("#button23").onClick(async () => {
      // Lightbox를 열고 결과 대기
      let result = await wixWindow.openLightbox("확인창");

      if (result === "confirmed") {
          const options = {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${loginKey}`
              },
          };
          // 외부 API에 데이터 삭제 요청
          fetch(`https://asdfdsas.p-e.kr/api/job-post/company/${query.jobPostId}`, options)
          .then(response => response.json())
          .then(data => {
              console.log("데이터 제거 성공:", data);
              wixLocation.to(`/general-4?projectId=${query.projectId}`);
          })
          .catch((error) => {
              console.error("데이터 제거 실패:", error);
          });
      } else {
          console.log("삭제가 취소되었습니다.");
      }
  });
});