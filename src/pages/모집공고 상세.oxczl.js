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
    if(!loginKey) {
      wixLocation.to(`/프로젝트관리`);
    }
    const query = wixLocation.query;
    if(!query.jobPostId) {
      wixLocation.to(`/프로젝트관리`);
    }
    const url = `https://www.jikgong.p-e.kr/api/job-post/worker/${query.jobPostId}`
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
    if(data.preparation == "") {
      $w("#text151").text = "없음"
    }
    
    // 이거 예외처리 생각
    var recruitNum = data.workDateResponseList[0].recruitNum;
    if(recruitNum == null) {
      recruitNum = 0;
    } 
    // 모집 인원
    $w("#text124").text = `인원 ${recruitNum} 명`;
    $w("#text142").text = `${recruitNum} 명`;

    // 근무 기간
    var resultDate = ""
    var date1 = data.workDateResponseList[0].date
    for(let i=0;i<data.workDateResponseList.length;i++) {
      resultDate += data.workDateResponseList[i].date;
      if (i != data.workDateResponseList.length-1) {
        resultDate += ", ";
      }
    }
    if(data.workDateResponseList.length == 1) {
      $w("#text130").text = `${date1}`;
    }
    else {
      $w("#text130").text = `${date1} 외 ${data.workDateResponseList.length-1}일`;
    }
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
    const replacements = {
      "NORMAL": "보통인부",
      "FOREMAN": "작업반장",
      "SKILLED_LABORER": "특별인부",
      "HELPER": "조력공",
      "SCAFFOLDER": "비계공",
      "FORMWORK_CARPENTER": "형틀목공",
      "REBAR_WORKER": "철근공",
      "STEEL_STRUCTURE_WORKER": "철골공",
      "WELDER": "용접공",
      "CONCRETE_WORKER": "콘크리트공",
      "BRICKLAYER": "조적공",
      "DRYWALL_FINISHER": "견출공",
      "CONSTRUCTION_CARPENTER": "건축목공",
      "WINDOW_DOOR_INSTALLER": "창호공",
      "GLAZIER": "유리공",
      "WATERPROOFING_WORKER": "방수공",
      "PLASTERER": "미장공",
      "TILE": "타일공",
      "PAINTER": "도장공",
      "INTERIOR_FINISHER": "내장공",
      "WALLPAPER_INSTALLER": "도배공",
      "POLISHER": "연마공",
      "STONEMASON": "석공",
      "GROUT_WORKER": "줄눈공",
      "PANEL_ASSEMBLER": "판넬조립공",
      "ROOFER": "지붕잇기공",
      "LANDSCAPER": "조경공",
      "CAULKER": "코킹공",
      "PLUMBER": "배관공",
      "BOILER_TECHNICIAN": "보일러공",
      "SANITARY_TECHNICIAN": "위생공",
      "DUCT_INSTALLER": "덕트공",
      "INSULATION_WORKER": "보온공",
      "MECHANICAL_EQUIPMENT_TECHNICIAN": "기계설비공",
      "ELECTRICIAN": "내선전공",
      "TELECOMMUNICATIONS_INSTALLER": "통신내선공",
      "TELECOMMUNICATIONS_EQUIPMENT_INSTALLER": "통신설비공"
    };
    
    let tech_ko = data.tech
    tech_ko = replacements[tech_ko] || tech_ko;

    $w("#title").text = tech_ko;
    $w("#text141").text = tech_ko;
   
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
    if(data.description == "") {
      $w("#text174").text = "없음"
    }

    $w("#button23").onClick(async () => {
      // Lightbox를 열고 결과 대기
      let result = await wixWindow.openLightbox("모집공고삭제창");

      if (result === "confirmed") {
          const options = {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${loginKey}`
              },
          };
          // 외부 API에 데이터 삭제 요청
          fetch(`https://www.jikgong.p-e.kr/api/job-post/company/${query.jobPostId}`, options)
          .then(response => response.json())
          .then(data => {
              console.log("데이터 제거 성공:", data);
              if(data.data) {
                wixWindow.openLightbox("오류 확인창", { "message": data.data.errorMessage });
              }
              else {
                wixLocation.to(`/모집공고관리?projectId=${query.projectId}`);
              }
          })
          .catch((error) => {
              console.error("데이터 제거 실패:", error);
              wixWindow.openLightbox("오류 확인창", { "message": "데이터 제거 실패: " + error.message });
          });
      } else {
          console.log("삭제가 취소되었습니다.");
      }
  });
  $w("#button24").onClick(async () => {
    wixLocation.to(`/신청자내역?jobPostId=${query.jobPostId}&projectId=${query.projectId}`);
  });
  $w("#button25").onClick(async () => {
    wixLocation.to(`/모집공고관리?projectId=${query.projectId}`);
  });
});