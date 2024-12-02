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
        
        $w("#text128").text = "미구현 입니다. 문의 시 QKfmsansdml@gmail.com으로 연락주십시오.";
        $w("#section1").collapse();
        $w("#button24").collapse();
        $w("#button25").collapse();
      }
    else {
        $w("#text128").text = "로그인 후 이용해주세요.";
        $w("#section1").collapse();
      }
});
