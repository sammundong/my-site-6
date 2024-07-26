import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
const query = wixLocation.query;

$w.onReady(async function () {
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code

    let condition = "PLANNED";

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
    gDWGM(query,condition);
});

function gDWGM(query, condition) {
  $w("#repeater3").data = []
  getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/job-post/company/list/${query.projectId}?jobPostStatus=${condition}&page=0&size=10`)
      .then(data => {
          console.log("가져온 데이터:", data);
          // Repeater에 데이터 연결
          for(let i=0;i<data.data.content.length;i++) {
            data.data.content[i]._id = `${i+1}`
          }
          const content = data.data.content;
          $w(`#repeater3`).data = content
          console.log($w("#repeater3").data)
          initComponents()
        }
  )}

function initComponents() {
    initRepeater()
  }
  
  
  function initRepeater() {
    $w("#repeater3").onItemReady(($item, itemData, index) => {
      //initItemBackground($item, itemData)
      initItemTitle($item, itemData)
      initItemDate($item, itemData)
      initItemButtion($item, itemData)
    });
  }
  
  function initItemTitle($item, itemData) {
    $item("#text128").text = itemData.title;
  }

  function initItemDate($item, itemData) {
    $item("#text127").text = itemData.createdDate;
  }

  function initItemButtion($item, itemData) {
    $item("#MoreButton").onClick(() => {
      wixLocation.to(`/jobs-4?jobPostId=${itemData.jobPostId}`);
    }) 
      $item("#button22").onClick(() => {
        wixLocation.to(`/jobs-2?projectId=${query.projectId}`);
      })
  } 
 