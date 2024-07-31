// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import { fetchUserInfo } from 'backend/dataFetcher';

$w.onReady(async function () {
    try {
        const userInfo = await fetchUserInfo("");
        console.log(userInfo);
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
});
