import { getDataWithGetMethod } from "backend/dataFetcher";
import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';

// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
const query = wixLocation.query;

let combinedContent = [];

let currentPage = 0;
const itemsPerPage = 10;

var loginKey =  `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiYWJjZGVmZzAiLCJleHAiOjE3MjYyMjY3NDB9.fztvihYHiIqMviCdHRxu5CBbCv9yN3gOIQy_8U4olMI` // session.getItem("loginKey");

$w.onReady(async function () {
  $w("#text13").text = "공고가 없습니다.";
    // Write your JavaScript here
    // To select an element by ID use: $w('#elementID')
    // Click 'Preview' to run your code
  try {
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
    if(loginKey) {
      $w("#button21").label = "로그아웃"
      $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
      })
    }
    $w("#repeater3").data = []
    
    await gDWGM_m(query, "IN_PROGRESS");
    await gDWGM_m(query, "PLANNED");
    await gDWGM_m(query, "COMPLETED");

    updateRepeater();

    if ($w("#repeater3").data.length !== 0) {
      $w("#text13").hide();
    }
    else {
      $w("#currentPageText").hide();
      $w("#prevButton").hide();
      $w("#nextButton").hide();
    }

    initComponents();

    $w("#button22").onClick(() => {
      wixLocation.to(`/jobs-2?projectId=${query.projectId}`);
    });

    $w("#nextButton").onClick(() => {
      if ((currentPage + 1) * itemsPerPage < combinedContent.length) {
        currentPage++;
        updateRepeater();
      }
    });

    $w("#prevButton").onClick(() => {
      if (currentPage > 0) {
        currentPage--;
        updateRepeater();
      }
    });
  } catch (error) {
    console.error('Error:', error);
    showErrorToUser(error.message);
  }
});

async function gDWGM_m(query, condition) {
  const data = await getDataWithGetMethod(`https://asdfdsas.p-e.kr/api/job-post/company/list/${query.projectId}?jobPostStatus=${condition}&page=0&size=100`, loginKey);
  console.log("가져온 데이터:", data);
  for (let i = 0; i < data.data.content.length; i++) {
    data.data.content[i]._id = `${combinedContent.length + 1}`;
    if (condition === "IN_PROGRESS") {
      data.data.content[i].condition = "진행 중";
    } else if (condition === "COMPLETED") {
      data.data.content[i].condition = "완료";
    } else if (condition === "PLANNED") {
      data.data.content[i].condition = "예정";
    }
    combinedContent.push(data.data.content[i]);
  }
}

function updateRepeater() {
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  $w("#repeater3").data = combinedContent.slice(start, end);

  // 페이지 번호 업데이트
  $w("#currentPageText").text = `${currentPage + 1}`;

  // 버튼 활성화/비활성화 상태 설정
  $w("#prevButton").enable();
  $w("#nextButton").enable();

  if (currentPage === 0) {
    $w("#prevButton").disable();
  }
  if ((currentPage + 1) * itemsPerPage >= combinedContent.length) {
    $w("#nextButton").disable();
  }
}

function showErrorToUser(errorMessage) {
  $w("#text13").text = errorMessage;
  $w("#text13").show();
  $w("#currentPageText").hide();
  $w("#prevButton").hide();
  $w("#nextButton").hide();
}

function initComponents() {
  initRepeater();
}

function initRepeater() {
  $w("#repeater3").onItemReady(($item, itemData, index) => {
    initItemCondition($item, itemData);
    initItemTitle($item, itemData);
    initItemDate($item, itemData);
    initItemButtion($item, itemData);
  });
}

function initItemCondition($item, itemData) {
  $item("#text130").text = itemData.condition;
}

function initItemTitle($item, itemData) {
  $item("#title").text = itemData.title;
}

function initItemDate($item, itemData) {
  let date = ""
  for(let i=0; i<itemData.workDateResponseList.length; i++) {
    if(i != itemData.workDateResponseList.length - 1) {
      date += `${itemData.workDateResponseList[i].date}, ` 
    }
    else {
      date += `${itemData.workDateResponseList[i].date}`
    }
  }
  $item("#text14").text = date;
}

function initItemButtion($item, itemData) {
  $item("#button23").onClick(() => {
    wixLocation.to(`/jobs?jobPostId=${itemData.jobPostId}&projectId=${query.projectId}`);
  });
  $item("#button24").onClick(() => {
    wixLocation.to(`/blank-4?jobPostId=${itemData.jobPostId}&projectId=${query.projectId}`);
  });
}
