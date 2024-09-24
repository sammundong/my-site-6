// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixLocation from 'wix-location-frontend';
import wixWindowFrontend from "wix-window-frontend";
import { session } from "wix-storage-frontend";

$w.onReady(function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code

    var loginKey = session.getItem("loginKey");

    let formFactor = wixWindowFrontend.formFactor; 
    if(formFactor == "Mobile") {
      if(!loginKey) {
        $w("#mobileButton3").label = "로그인"
        $w("#mobileButton2").label = "회원가입"
        $w("#mobileButton2").onClick(() => {
          wixLocation.to(`/blank-2`);
        })
        $w("#mobileButton3").onClick(() => {
          wixLocation.to(`/로그인`);
        })
      }
      else {
        $w("#mobileButton3").label = "로그아웃"
        $w("#mobileButton2").label = "회원가입"
        $w("#mobileButton2").onClick(() => {
          wixLocation.to(`/blank-2`);
        })
        $w("#mobileButton3").onClick(() => {
          session.removeItem("loginKey");
          wixLocation.to(`/`);
        })
      }
    }
    else {
      if(loginKey) {
        $w("#button21").label = "로그아웃"
        $w("#button21").onClick(() => {
        session.removeItem("loginKey");
        $w("#button21").label = "로그인"
        wixLocation.to(`/`);
        })
      }
      else {
        $w("#button21").onClick(() => {
        $w("#button21").label = "로그인"
        wixLocation.to(`/로그인`);
        })
      }
    }
});
