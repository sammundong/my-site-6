// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import { lightbox } from 'wix-window-frontend';

$w.onReady(function () {
    // Lightbox가 열릴 때 전달된 데이터를 가져옵니다.
    const receivedData = lightbox.getContext();

    // 오류 메시지를 전달받고 텍스트 요소에 설정합니다.
    if (receivedData && receivedData.message) {
        $w("#text121").text = receivedData.message;
    }

    // 닫기 버튼 클릭 시 라이트박스 닫기
    $w("#button24").onClick(() => {
        lightbox.close();
    });
});

