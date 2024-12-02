// Velo API 레퍼런스: https://www.wix.com/velo/reference/api-overview/introduction
import { getDataWithGetMethod } from "backend/dataFetcher";
import { session } from "wix-storage-frontend";
import wixLocation from 'wix-location-frontend';
import wixWindowFrontend from "wix-window-frontend";


$w.onReady(function () {

	var loginKey = session.getItem("loginKey");
    $w("#section4").collapse();
    let formFactor = wixWindowFrontend.formFactor; 
    if(loginKey) {
      $w("#button10q").label = "프로젝트 생성"
      $w("#button21").label = "로그아웃"
      $w("#button10q").onClick(() => {
        wixLocation.to(`/프로젝트생성`);
      })
      if(formFactor == "Desktop") {
        $w("#button21").onClick(() => {
          session.removeItem("loginKey");
          $w("#button10q").label = "로그인"
          $w("#button21").label = "로그인"
          $w("#button10q").onClick(() => {
            wixLocation.to(`/로그인`);
            console.log("1")
          })
          wixLocation.to(`/로그인`);
        }) 
      }
      else {
        $w("#mobileButton3").onClick(() => {
          $w("#button10q").label = "로그인"
        })
      }
    }
    else {
      $w("#button10q").onClick(() => {
        wixLocation.to(`/로그인`);
      })
    }
});