// Velo API 레퍼런스: https://www.wix.com/velo/reference/api-overview/introduction
import { getDataWithGetMethod } from "backend/dataFetcher";
import { session } from "wix-storage-frontend";
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {

	var loginKey = session.getItem("loginKey");
    if(loginKey) {
      $w("#button10").label = "프로젝트 생성"
      $w("#button21").label = "로그아웃"
      $w("#button10").onClick(() => {
        wixLocation.to(`/general-4-1`);
      })
      $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button10").label = "로그인"
        $w("#button21").label = "로그인"
        wixLocation.to(`/로그인`);
      })
    }
    else {
      $w("#button10").onClick(() => {
        wixLocation.to(`/로그인`);
      })
      $w("#button21").onClick(() => {
        wixLocation.to(`/로그인`);
      })
    }
});