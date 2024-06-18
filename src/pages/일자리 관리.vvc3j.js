import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
    $w("#listRepeater").data = []
    getDataWithGetMethod()
        .then(data => {
            console.log("가져온 데이터:", data);

            // Repeater에 데이터 연결
            $w('#listRepeater').data = data.content;
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
    $item("#title").text = itemData.title;
  }

  function initItemAddress($item, itemData) {
    $item("#text14").text = itemData.address;
  }

  function initItemButtion($item, itemData) {
    $item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?jobPostId=${itemData.jobPostId}`);
    })
  }
