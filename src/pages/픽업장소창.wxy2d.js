// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {
    $w("#button24").onClick(() => {
        var address = $w("#addressInput2").value
        console.log(address)
        wixWindowFrontend.lightbox.close(address);
    })
});
