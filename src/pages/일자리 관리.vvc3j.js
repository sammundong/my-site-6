import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
    const jobUrl = "https://asdfdsas.p-e.kr/api/project/list"
   
    const jobResponse = await fetch(jobUrl, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjA5NzA5MTB9.yg1G0zizw-BoGxcWGUPNgudBhi7CLsM1359eHYMOujQ'
        }
    })
        
    const responseData = await jobResponse.json()
    console.log(responseData)

    $w('#listRepeater').data = []
    initComponents()
    render()
});

function initComponents() {
    initRepeater()
  }
  
  async function render(){
      $w("#listRepeater").data = []
      var { data, message } = await getDataWithGetMethod({
      url: "https://asdfdsas.p-e.kr/api/project/list",
    });
    console.log(data)
    $w("#listRepeater").data = []
    $w("#listRepeater").data = data.content;
  }
  
  function initRepeater() {
    $w("#listRepeater").onItemReady(($item, itemData, index) => {
      //initItemBackground($item, itemData)
  
      initItemTitle($item, itemData)
      initItemButtion($item, itemData)
    });
  }
  
  function initItemTitle($item, itemData) {
    $item("#title").text = itemData.title;
  }
  
  function initItemButtion($item, itemData) {
    $item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?jobPostId=${itemData.jobPostId}`);
    })
  }
