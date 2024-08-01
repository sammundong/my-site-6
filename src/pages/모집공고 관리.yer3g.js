import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
const query = wixLocation.query;

let combinedContent = [];

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code

    $w('#section1').collapse();
    $w('#section2').collapse();
    $w('#button12').collapse();
    $w('#button13').collapse();
    $w('#button14').collapse();
    /* $w('#button13').style.color = "#C7C7C7";
    $w('#button13').style.borderColor = "#C7C7C7";

    $w('#button14').style.color = "#C7C7C7";
    $w('#button14').style.borderColor = "#C7C7C7";

    $w("#button8").onClick(() => {
      wixLocation.to(`/jobs-2?projectId=${query.projectId}`);
    })
    

    $w('#button12').onClick( (event) => {
        const clickedElement = event.target;
        clickedElement.style.color = "#FD5521";
        clickedElement.style.borderColor = "#FD5521";

        $w('#button13').style.color = "#C7C7C7";
        $w('#button13').style.borderColor = "#C7C7C7";

        $w('#button14').style.color = "#C7C7C7";
        $w('#button14').style.borderColor = "#C7C7C7";

        condition = "PLANNED";
        
        gDWGM(query,condition);

        $w('#section3').expand();
        // $w('#section1').collapse();
        // $w('#section2').collapse();

        console.log(clickedElement.id,"onclick");
    })

    //button 9 예약

    $w('#button13').onClick( (event) => {
        const clickedElement = event.target;
        clickedElement.style.color = "#FD5521";
        clickedElement.style.borderColor = "#FD5521";

        $w('#button12').style.color = "#C7C7C7";
        $w('#button12').style.borderColor = "#C7C7C7";

        $w('#button14').style.color = "#C7C7C7";
        $w('#button14').style.borderColor = "#C7C7C7";

        condition = "IN_PROGRESS";
        
        gDWGM(query,condition);

        // $w('#section3').collapse();
        $w('#section3').expand();
        // $w('#section2').collapse();

        console.log(clickedElement.id,"onclick");
    })

    //button 10 마감

    $w('#button14').onClick( (event) => {
        const clickedElement = event.target;
        clickedElement.style.color = "#FD5521";
        clickedElement.style.borderColor = "#FD5521";

        $w('#button12').style.color = "#C7C7C7";
        $w('#button12').style.borderColor = "#C7C7C7";

        $w('#button13').style.color = "#C7C7C7";
        $w('#button13').style.borderColor = "#C7C7C7";

        condition = "COMPLETED";
        
        gDWGM(query,condition);

       //  $w('#section3').collapse();
       // $w('#section1').collapse();
        $w('#section3').expand();

        console.log(clickedElement.id,"onclick");
    }) */
    $w("#repeater3").data = []
    await gDWGM(query, "IN_PROGRESS");
    await gDWGM(query, "PLANNED");
    await gDWGM(query, "COMPLETED");

    $w("#repeater3").data = combinedContent;
    console.log($w("#repeater3").data)
    initComponents();

    $w("#button22").onClick(() => {
      wixLocation.to(`/jobs-2?projectId=${query.projectId}`);
    })
});

async function gDWGM(query, condition) {
  const data = await getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/job-post/company/list/${query.projectId}?jobPostStatus=${condition}&page=0&size=10`);
    console.log("가져온 데이터:", data);
    for(let i = 0; i < data.data.content.length; i++) {
      data.data.content[i]._id = `${combinedContent.length + 1}`;
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

function initComponents() {
    initRepeater()
  }
  
  
  function initRepeater() {
    $w("#repeater3").onItemReady(($item, itemData, index) => {
      //initItemBackground($item, itemData)
      initItemCondition($item, itemData)
      initItemTitle($item, itemData)
      initItemDate($item, itemData)
      initItemButtion($item, itemData)
    });
  }

  function initItemCondition($item, itemData) {
    $item("#text130").text = itemData.condition;
  }
  
  function initItemTitle($item, itemData) {
    $item("#title").text = itemData.title;
  }

  function initItemDate($item, itemData) {
    $item("#text14").text = itemData.createdDate;
  }

  function initItemButtion($item, itemData) {
    $item("#button23").onClick(() => {
      wixLocation.to(`/jobs?jobPostId=${itemData.jobPostId}`);
    }) 
    $item("#button24").onClick(() => {
      wixLocation.to(`/jobs-2?projectId=${query.projectId}`);
    })
  } 
 