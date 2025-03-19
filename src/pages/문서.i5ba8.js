// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code

    let htmlComponent = $w("#html1"); // HTML Component ID

    // 버튼 클릭 시 새로운 텍스트 전달
    $w("#button22").onClick(() => {
        console.log("ff")
        htmlComponent.postMessage("새로운 계약서 제목");
    });
});
