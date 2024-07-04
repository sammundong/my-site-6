import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
    $w("#listRepeater").data = []
    const query = wixLocation.query;
    getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/job-post/company/${query.jobPostId}`)
        .then(data => {
            console.log("가져온 데이터:", data);
            // Repeater에 데이터 연결
            $w('#listRepeater').data = data.data.workDateResponseList;
            console.log(data.data.workDateResponseList);
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
      initItemDate($item, itemData)
      //initItemButtion($item, itemData)
    });
  }
  
  function initItemTitle($item, itemData) {
    console.log(`${itemData.workDateId}`);
    $item("#text121").text = `${itemData.workDateId}`;
  }

  function initItemDate($item, itemData) {
    console.log(itemData.workDateResponseList.date);
    $item("#text122").text = itemData.workDateResponseList.date;
  }

  /* function initItemButtion($item, itemData) {
    $item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?jobPostId=${itemData.jobPostId}`);
    })
    $item("#button9").onClick(() => {
      wixLocation.to(`/general-4?jobPostId=${itemData.jobPostId}`);
    })
  } */