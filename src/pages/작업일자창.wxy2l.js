// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import wixWindowFrontend from "wix-window-frontend";
import { session } from 'wix-storage-frontend';
import { getDataWithGetMethod } from "backend/dataFetcher";

var loginKey = session.getItem("loginKey");

$w.onReady(async function () {

    let receivedData = wixWindowFrontend.lightbox.getContext();

    const url = `https://www.jikgong.p-e.kr/api/project/${receivedData}`
    var { data, message } = await getDataWithGetMethod(url, loginKey);

    const startDate = new Date(data.startDate); 
    startDate.setDate(startDate.getDate() + 3);
    const endDate = new Date(data.endDate); 

    $w("#datePicker1").minDate = startDate;
    $w("#datePicker1").maxDate = endDate;
    $w("#datePicker1").value = startDate;


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
