import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';

// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

let combinedContent = [];
var loginKey = session.getItem("loginKey");
let page = 0;

$w.onReady(async function () {
  if(loginKey) {
    $w("#button21").label = "로그아웃"
    $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
    })
    $w("#text127").hide();
    $w('#section2').collapse();
    $w("#text127").text = "프로젝트가 없습니다.";
      // Write your JavaScript here
      // To select an element by ID use: $w('#elementID')
      // Click 'Preview' to run your code
    try {
      $w("#listRepeater").data = [];

      await gDWGM("IN_PROGRESS");
      await gDWGM("PLANNED");
      await gDWGM("COMPLETED");

      // 모든 데이터를 combinedContent에 합친 후 listRepeater에 설정
      console.log(combinedContent)
      $w("#listRepeater").data = combinedContent;
      console.log($w("#listRepeater").data)
      
      if($w("#listRepeater").data.length == 0) {
        $w("#text127").show();
      }
    
      initComponents();
    } catch (error) {
        console.error('Error:', error);
        showErrorToUser(error.message);
    }
    //$w("#button10").collapse();
    //$w("#button22").collapse();
  }
  else {
    $w('#text128').text = "로그인 후 이용 가능합니다"
    $w('#section1').collapse();
    //$w('#text155').collapse();
    //$w('#section1').collapse();
    }
  });

async function gDWGM(condition) {
    const data = await getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/project/list?projectStatus=${condition}&page=${page}&size=10`, loginKey);
    console.log("가져온 데이터:", data);

    // Repeater에 데이터 연결
    for(let i = 0; i < data.data.content.length; i++) {
        data.data.content[i]._id = `${combinedContent.length + 1}`;
        console.log(data.data.content);
        if(condition == "IN_PROGRESS") {
          data.data.content[i].condition = "진행 중";
        }
        else if(condition == "COMPLETED") {
          data.data.content[i].condition = "완료";
        }
        else if(condition == "PLANNED") {
          data.data.content[i].condition = "예정";
        }
        combinedContent.push(data.data.content[i]);
    }
}

function showErrorToUser(errorMessage) {
  $w("#text127").text = errorMessage;
  $w("#text127").show();
}

function initComponents() {
    initRepeater()
  }
  
  
  function initRepeater() {
    $w("#listRepeater").onItemReady(($item, itemData, index) => {
      initItemCondition($item, itemData)
      initItemTitle($item, itemData)
      initItemAddress($item, itemData)
      initItemButtion($item, itemData)
    });
  }

  function initItemCondition($item, itemData) {
    $item("#text126").text = itemData.condition;
  }
  
  function initItemTitle($item, itemData) {
    $item("#title").text = itemData.projectName;
  }

  function initItemAddress($item, itemData) {
    $item("#text14").text = itemData.startDate + " ~ " + itemData.endDate;
  }

  function initItemButtion($item, itemData) {
    $item("#button22").onClick(() => {
      wixLocation.to(`/general-clean?projectId=${itemData.projectId}`);
    }) 
    $item("#button9").onClick(() => {
      wixLocation.to(`/general-4?projectId=${itemData.projectId}`);
    })
  }
