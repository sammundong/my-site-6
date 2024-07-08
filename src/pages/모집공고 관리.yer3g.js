import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
    const query = wixLocation.query;
    $w("#listRepeater").data = []
    getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/job-post/company/list/${query.projectId}?jobPostStatus=IN_PROGRESS&page=0&size=10`)
        .then(data => {
            console.log("가져온 데이터:", data);
            // Repeater에 데이터 연결
            for(let i=0;i<data.content.length;i++) {
              data.content[i]._id = `${i+1}`
            }
            const workDateResponseList_copy = data.data.workDateResponseList;
            $w("#listRepeater").data = workDateResponseList_copy
            console.log($w("#listRepeater").data)
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
      initItemButtion($item, itemData)
    });
  }
  
  function initItemTitle($item, itemData) {
    $item("#text121").text = `${itemData.workDateId}`;
  }

  function initItemDate($item, itemData) {
    $item("#text122").text = itemData.date;
  }

  function initItemButtion($item, itemData) {
    /* item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?jobPostId=${itemData.jobPostId}`);
    }) */
    $item("#button8").onClick(() => {
      wixLocation.to(`/jobs-2?jobPostId=${itemData.jobPostId}`);
    })
  } 
 