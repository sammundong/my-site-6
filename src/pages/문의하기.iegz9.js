// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import wixWindow from 'wix-window-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";
import { getApiKey, kakaoApiKey } from "backend/apikey.jsw";
import { session } from 'wix-storage-frontend';
import { query } from 'wix-data';

var loginKey = session.getItem("loginKey");

$w.onReady(function () {
    if(loginKey) {
        $w("#section2").collapse();
        $w("#button21").label = "로그아웃"
        $w("#button21").onClick(() => {
          session.removeItem("loginKey");
          $w("#button21").label = "로그인"
          wixLocation.to(`/`);
        })
      }
      else {
        $w("#text128").text = "로그인 후 이용해주세요.";
        $w("#section1").collapse();
      }
});
