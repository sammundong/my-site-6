import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import wixWindow from 'wix-window-frontend';

// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

let combinedContent = [];
var loginKey = session.getItem("loginKey");
let page = 0;

$w.onReady(async function () {
  if(loginKey) {
    
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
    const data = await getDataWithGetMethod(`https://www.jikgong.p-e.kr/api/project/list?projectStatus=${condition}&page=${page}&size=100`, loginKey);
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
      wixLocation.to(`/프로젝트수정?projectId=${itemData.projectId}`);
    }) 
    $item("#button9").onClick(() => {
      wixLocation.to(`/모집공고관리?projectId=${itemData.projectId}`);
    })
    $w("#button23").onClick(async () => {
      // Lightbox를 열고 결과 대기
      let result = await wixWindow.openLightbox("프로젝트삭제창");

      if (result === "confirmed") {
          const options = {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${loginKey}`
              },
          };
          // 외부 API에 데이터 삭제 요청
          fetch(`https://www.jikgong.p-e.kr/api/project/${itemData.projectId}`, options)
          .then(response => response.json())
          .then(data => {
              console.log("데이터 제거 성공:", data);
              if(data.data) {
                wixWindow.openLightbox("오류 확인창", { "message": data.data.errorMessage });
              }
              else {
                wixLocation.to(`/`);
                wixLocation.to(`/프로젝트관리`);
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
  }
