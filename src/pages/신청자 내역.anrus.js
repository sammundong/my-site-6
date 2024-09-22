// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import wixWindow from 'wix-window-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";
import { getApiKey, kakaoApiKey } from "backend/apikey.jsw";
import { session } from 'wix-storage-frontend';
import { query } from 'wix-data';


let combinedContent = [];
let applyIdList = [];
let memberIdList = [];
let jpi = 0;
let pji = 0;

var loginKey = session.getItem("loginKey");

$w.onReady(async function () {

    if(loginKey) {
      $w("#button21").label = "로그아웃"
      $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
      })
    }
    
    $w("#text142").collapse;
    $w("#text141").collapse;
    $w('#button25').style.color = "#C7C7C7";
    $w('#button25').style.borderColor = "#C7C7C7";

    const query = wixLocation.query;
    jpi = query.jobPostId
    pji = query.projectId
    console.log(pji)
    const url = `https://asdfdsas.p-e.kr/api/job-post/worker/${query.jobPostId}`
    var { data, message } = await getDataWithGetMethod(url, loginKey);
    console.log(data);
  
    let workDateList = []
    workDateList = data.workDateResponseList

    combinedContent = [];
      $w("#repeater8").data = [];
      for(let i=0;i<workDateList.length;i++) {
          const url3 = `https://asdfdsas.p-e.kr/api/apply/company/accepted/${query.jobPostId}/${workDateList[i].workDateId}?page=0&size=100`
          await gDWGM(url3, workDateList[i].date, workDateList[i].workDateId);
      }
      console.log(combinedContent)
      $w("#repeater8").data = combinedContent;
      console.log($w("#repeater8").data)
      if(combinedContent.length == 0) {
        $w("#text142").text = "확정된 인원이 없습니다.";
        $w("#text142").show;
      }
      initComponents8();
      $w("#section2").collapse();
    
    // 7
    $w('#button25').onClick(async (event) => {
      const clickedElement = event.target;
      clickedElement.style.color = "#3971FF";
      clickedElement.style.borderColor = "#3971FF";

      $w('#button12').style.color = "#C7C7C7";
      $w('#button12').style.borderColor = "#C7C7C7";

      $w("#repeater7").data = []
      for(let i=0;i<workDateList.length;i++) {
          const url2 = `https://asdfdsas.p-e.kr/api/apply/company/pending/${query.jobPostId}/${workDateList[i].workDateId}?page=0&size=100`
          await gDWGM(url2, workDateList[i].date, workDateList[i].workDateId);
      }
      $w("#repeater7").data = combinedContent;
      console.log($w("#repeater7").data)
      if(combinedContent.length == 0) {
        $w("#text141").text = "지원 인원이 없습니다.";
        $w("#text141").show;
      }
      initComponents7();
      $w('#Section1Regular').collapse();
      $w('#section2').expand();
    })

    // 8
    $w('#button12').onClick(async (event) => {
      const clickedElement = event.target;
      clickedElement.style.color = "#3971FF";
      clickedElement.style.borderColor = "#3971FF";

      $w('#button25').style.color = "#C7C7C7";
      $w('#button25').style.borderColor = "#C7C7C7";
      combinedContent = [];
      $w("#repeater8").data = [];
      for(let i=0;i<workDateList.length;i++) {
          const url3 = `https://asdfdsas.p-e.kr/api/apply/company/accepted/${query.jobPostId}/${workDateList[i].workDateId}?page=0&size=100`
          await gDWGM(url3, workDateList[i].date, workDateList[i].workDateId);
      }
      console.log(combinedContent)
      $w("#repeater8").data = combinedContent;
      console.log($w("#repeater8").data)
      if(combinedContent.length == 0) {
        $w("#text142").text = "확정된 인원이 없습니다.";
        $w("#text142").show;
      }
      initComponents8();
      $w('#section2').collapse();
      $w('#Section1Regular').expand();
    })

      $w("#button24").onClick(() => {
        wixLocation.to(`/general-4?projectId=${query.projectId}`);
      }) 
  });

function process_request(bool, jid, wid) {
  
  const project = {
    "jobPostId" : jid,
    "applyIdList" : applyIdList,
    "memberIdList" : memberIdList,
    "isAccept" : bool,
    "workDateId" : wid
  };
  console.log(project)
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginKey}`
      },
      body: JSON.stringify(project)
  };

  // 외부 API에 데이터 삽입 요청
  fetch('https://asdfdsas.p-e.kr/api/apply/company/process-request', options)
      .then(response => response.json())
      .then(data => {
          // 삽입 성공 시 처리
          // const fullData = { ...project, ...data };
          console.log("데이터 삽입 성공:", data)
          wixLocation.to(`/general-4?projectId=${pji}`);
          //$w('#text142').text = "회원 정보가 성공적으로 등록되었습니다.";
          memberIdList = []
          applyIdList = []
      })
      .catch((error) => {
          // 삽입 실패 시 처리
          console.error("데이터 삽입 실패:", error);
          memberIdList = []
          applyIdList = []
          //$w('#text142').text = "회원 정보 등록에 실패했습니다.";
      });
  }



async function gDWGM(url, workDate, workId) {
    const data = await getDataWithGetMethod(url, loginKey);
      //console.log("가져온 데이터:", data);
      for(let i = 0; i < data.data.content.length; i++) {
        data.data.content[i].memberResponse._id = `${combinedContent.length + 1}`;
        data.data.content[i].memberResponse.date = workDate
        data.data.content[i].memberResponse.dateId = workId 
        data.data.content[i].memberResponse.applyId = data.data.content[i].applyId      
        combinedContent.push(data.data.content[i].memberResponse);
      }
    }
  
  function initComponents7() {
      initRepeater7()
    }

  function initComponents8() {
    initRepeater8()
  }
    
    function initRepeater7() {
      $w("#repeater7").onItemReady(($item, itemData, index) => {
        //initItemBackground($item, itemData)
        initItemName($item, itemData)
        initItemPhone($item, itemData)
        initItemInfo($item, itemData)
        initItemDate($item, itemData)
        initItemButtion($item, itemData)
      });
    }
  
    function initItemName($item, itemData) {
      $item("#text132").text = itemData.workerName;
    }
    
    function initItemPhone($item, itemData) {
      $item("#text134").text = itemData.phone;
    }

    function initItemInfo($item, itemData) {
        if(itemData.gender == "MALE") {
            $item("#text133").text = itemData.age + ", 남, " + itemData.workTimes + "번 출역" ;
        }
        else {
            $item("#text133").text = itemData.age + ", 여, " + itemData.workTimes + "번 출역" ;
        }
      }
  
    function initItemDate($item, itemData) {
      $item("#text138").text = itemData.date;
    }

    function initItemButtion($item, itemData) {
        $item("#button22").onClick(() => {
          applyIdList.push(itemData.applyId);
          memberIdList.push(itemData.memberId);
          process_request(true, jpi, itemData.dateId)
        }) 
        $item("#button23").onClick(() => {
          applyIdList.push(itemData.applyId);
          memberIdList.push(itemData.memberId);
          process_request(false, jpi, itemData.dateId)
        })
      } 

    function initRepeater8() {
      $w("#repeater8").onItemReady(($item, itemData, index) => {
        //initItemBackground($item, itemData)
        initItemName8($item, itemData)
        initItemPhone8($item, itemData)
        initItemInfo8($item, itemData)
        initItemDate8($item, itemData)
        //initItemButtion($item, itemData)
      });
    }
    function initItemName8($item, itemData) {
      $item("#text137").text = itemData.workerName;
    }
    
    function initItemPhone8($item, itemData) {
      $item("#text135").text = itemData.phone;
    }

    function initItemInfo8($item, itemData) {
        if(itemData.gender == "MALE") {
            $item("#text136").text = itemData.age + ", 남, " + itemData.workTimes + "번 출역" ;
        }
        else {
            $item("#text136").text = itemData.age + ", 여, " + itemData.workTimes + "번 출역" ;
        }
      }
  
    function initItemDate8($item, itemData) {
      $item("#text139").text = itemData.date;
    }
