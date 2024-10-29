// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';

var checkPhoneCode = "false";
var checkRepeatPhone = "false";
var checkRepeatId = "false";
var checkJoinData = "true";
var authPhoneCode;

var joinData = {}

$w.onReady(function () {
    $w("#text185").hide()
    $w("#text176").hide()
    $w("#text173").hide()
    $w("#text188").hide()


    
    
    $w("#button29").onClick(async () => {
        let phoneNum = $w("#input22").value
        joinData.phone = phoneNum
        if(validatePhoneNumber(phoneNum)) {
            const smsurl = "https://asdfdsas.p-e.kr/api/join/sms-verification"
            const data = {phone:phoneNum}
            const smsResponse = await fetch(smsurl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
            })
            const responseData = await smsResponse.json()
            authPhoneCode = responseData.data.authCode
            console.log(authPhoneCode);
            $w("#text185").show()
            $w("#text185").text = "인증번호가 발송되었습니다."
        }
        else {
            $w("#text185").show()
            $w("#text185").text = "- 제외하고 전화번호를 입력해주세요."
        }
    })

    $w("#button28").onClick(async () => {
        let authCode = $w("#input21").value
        if(authCode != authPhoneCode) {
            $w("#text185").show()
            $w("#text185").text = "인증번호가 잘못되었습니다."
        }
        else {
            const v_phoneUrl = "https://asdfdsas.p-e.kr/api/join/validation-phone"
            let phoneNum = joinData.phone
            const data = {phone:phoneNum}
            const phoneResponse = await fetch(v_phoneUrl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
            })
            const responsePhoneData = await phoneResponse.json()
            if(responsePhoneData.message == "사용 가능한 휴대폰 입니다.") {
                $w("#text185").show()
                $w("#text185").text = "인증되었습니다."
                checkPhoneCode = "true"
                checkRepeatPhone = "true"
            }
            else {
                $w("#text185").show()
                $w("#text185").text = "이미 가입한 전화번호 입니다."
            }
        }
    })

    $w("#button27").onClick(async ()=> {
        let joinId = $w("#input18").value;
        const v_idUrl = "https://asdfdsas.p-e.kr/api/join/validation-loginId"
        const v_idData = {loginId:joinId}
        const vIdResponse = await fetch(v_idUrl, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(v_idData)
        })
        const responseIdData = await vIdResponse.json()
        if(responseIdData.message == "사용 가능한 아이디 입니다.") {
            $w("#text176").show()
            $w("#text176").text = responseIdData.message
            checkRepeatId = "true"
            joinData.loginId = joinId
        }
        else {
            $w("#text176").show()
            $w("#text176").text = "이미 등록된 id입니다."
        }
    })

    $w("#button26").onClick(async () => {
        let password = $w("#input17").value;
        let repassword = $w("#input16").value;

        if(checkPhoneCode == "false") {
            $w("#text185").show()
            $w("#text185").text = "전화번호 인증해야 합니다."
        }
        else if(checkRepeatPhone == "false") {
            $w("#text185").show()
            $w("#text185").text = "이미 가입하신 전화번호 입니다."
        }
        else if(checkRepeatId == "false") {
            $w("#text176").show()
            $w("#text176").text = "중복된 ID 입니다."
        }
        else if(password != repassword) {
            $w("#text173").show()
            $w("#text173").text = "입력하신 비밀번호와 일치하지 않습니다."
        }
        else {
            joinData.password = password
            joinData.manager = $w("#input20").value
            if(!joinData.manager) {
                checkJoinData = "false"
                $w("#button26").label = "관리자 이름을 입력해주세요."
            }
            joinData.role = "ROLE_COMPANY"

            joinData.deviceToken = "token"
            joinData.isNotification = true

            joinData.privacyConsent = true
            joinData.isNotification = true
            
            joinData.companyName = $w("#input13").value 
            if(!joinData.companyName) {
                checkJoinData = "false"
                $w("#button26").label = "회사 이름을 선택해주세요."
            }

            joinData.businessNumber = $w("#input14").value 
            if(!joinData.businessNumber) {
                checkJoinData = "false"
                $w("#button26").label = "사업자 번호를 선택해주세요."
            }
            
            const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            joinData.email = $w("#input15").value 
            
            if(!joinData.email) {
                checkJoinData = "false"
                $w("#button26").label = "이메일을 작성해주세요."
            }
	        else if(!email_regex.test(joinData.email)){
                checkJoinData = "false"
                $w("#text188").text = "올바른 이메일 형식을 작성해주세요."
            }

            let region = $w("#addressInput2").value
            joinData.region = region.formatted
            if(!joinData.region && region.formatted != "") {
                checkJoinData = "false"
                $w("#button26").label = "회사 주소를 입력해주세요."
            }
           
            joinData.bank = $w("#dropdown3").value
            if(!joinData.bank) {
                checkJoinData = "false"
                $w("#button26").label = "은행을 선택해주세요."
            }
            joinData.account = $w("#input19").value
            if(!joinData.account) {
                checkJoinData = "false"
                $w("#button26").label = "계좌번호를 입력해주세요."
            }

            if(checkJoinData == "true") {
                const joinUrl = "https://asdfdsas.p-e.kr/api/join/company/join"
                const joinResponse = await fetch(joinUrl, {
                    method: "POST",
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(joinData)
                })
                const responseJoinData = await joinResponse.json()
                
                if (responseJoinData.message == "기업 회원 가입 완료") {
                    $w("#button26").label = responseJoinData.message
                    wixLocation.to(`/로그인`);
                }
                else {
                    console.log(responseJoinData)
                    $w("#button26").label = "회원 가입 오류 : 재작성 및 재시도 부탁드립니다."
                }
            }
            else {
                $w("#button26").label = "회원 정보를 올바르게 입력해주세요."
            }
        }
    })
});

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
}

