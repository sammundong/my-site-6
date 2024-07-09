import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
    $w("#listRepeater").data = []
    getDataWithGetMethod('https://asdfdsas.p-e.kr/api/project/list?projectStatus=COMPLETED')
        .then(data => {
            console.log("가져온 데이터:", data);
            for(let i=0;i<data.data.length;i++) {
              data.data[i]._id = `${i+1}`
            }
            // Repeater에 데이터 연결
            $w('#listRepeater').data = data.data;
        initComponents()
    });
});

function initComponents() {
    initRepeater()
  }
  
  
  function initRepeater() {
    $w("#listRepeater").onItemReady(($item, itemData, index) => {
      //initItemBackground($item, itemData)
      initItemTitle($item, itemData)
      initItemAddress($item, itemData)
      initItemButtion($item, itemData)
    });
  }
  
  function initItemTitle($item, itemData) {
    $item("#title").text = itemData.projectName;
  }

  function initItemAddress($item, itemData) {
    $item("#text14").text = itemData.startDate + " ~ " + itemData.endDate;
  }

  function initItemButtion($item, itemData) {
    $item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?projectId=${itemData.projectId}`);
    })
    $item("#button9").onClick(() => {
      wixLocation.to(`/general-4?projectId=${itemData.projectId}`);
    })
  }
