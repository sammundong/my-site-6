// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {
    $w("#button24").onClick(() => {
        var workDate = $w("#datePicker1").value
        let date = workDate;
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        const date_st = `${year}-${month}-${day}`;
        wixWindowFrontend.lightbox.close(date_st);
    })
});
