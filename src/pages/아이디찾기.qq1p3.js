// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import wixWindow from 'wix-window-frontend';

$w.onReady(function () {

    $w("#text160").hide();
    var authPhoneCode = "";

    var phoneNum = "";

    const smsurl = "https://www.jikgong.p-e.kr/api/member-info/loginId-verification"
    $w("#button22").onClick(async () => {
        const company = $w('#input10').value;
        const phone = $w('#input9').value;
        phoneNum = phone;

        const data = {
            "name" : company,
            "phone" : phone 
        }

        console.log(data)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };

        if(validatePhoneNumber(phone)) {
            
            await fetch(smsurl, options)
                .then(response => response.json())
                .then(async data => {
                    console.log(data)
                    if(data.message == "커스텀 예외 반환") {
                        showErrorToUser(data.data.errorMessage);
                    }
                    else {
                        $w("#text160").show()
                        $w("#text160").text = "인증번호가 발송되었습니다."
                    }
                })
                .catch((error) => {
                    // 삽입 실패 시 처리
                    console.error("데이터 삽입 실패:", error);
                    showErrorToUser(error.message);
                }); 
            }
        else {
            $w("#text160").show()
            $w("#text160").text = "- 제외하고 전화번호를 입력해주세요."
        }
    }); 

    $w("#button23").onClick(async () => {
        let authCode = $w("#input8").value

            const v_phoneUrl = "https://www.jikgong.p-e.kr/api/member-info/loginId/retrieve"
            const data = {
                "phone" : phoneNum,
                "authCode" : authCode
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            };

            await fetch(v_phoneUrl, options)
                .then(response => response.json())
                .then(async data => {
                    console.log(data)
                    if(data.message == "커스텀 예외 반환") {
                        showErrorToUser(data.data.errorMessage);
                    }
                    else {
                        $w("#text160").show()
                        $w("#text160").text = `아이디 : ${data.data.loginId}`
                    }
                })
                .catch((error) => {
                    // 삽입 실패 시 처리
                    console.error("데이터 삽입 실패:", error);
                    showErrorToUser(error.message);
                }); 
        }
    )
});

function showErrorToUser(errorMessage) {
    $w("#text160").text = errorMessage;
    $w("#text160").show();
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
}