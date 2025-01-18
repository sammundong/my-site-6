// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import wixWindow from 'wix-window';

var checkPhoneCode = "false";
var checkRepeatPhone = "true" //"false";
var checkRepeatId = "false";
var checkJoinData = "true";
var authPhoneCode;

var joinData = {}

let isTimerRunning = false; // 타이머 상태를 저장하는 변수
let countdownTime = 180; // 3분(180초)
let timerInterval; // 타이머 인터벌 저장 변수
let authPhCode = 0;

$w.onReady(function () {
    $w("#text185").hide()
    $w("#text176").hide()
    $w("#text173").hide()
    $w("#text188").hide()
    
    $w("#section2").collapse();
    $w("#section3").collapse();
    
    $w("#button29").collapse();
    $w("#button28").collapse();
    $w("#input21").collapse();

    /* $w("#button29").onClick(async () => {
        let phoneNum = $w("#input22").value
        joinData.phone = phoneNum
        if(validatePhoneNumber(phoneNum)) {
            const smsurl = "https://jikgong.p-e.kr/api/join/sms-verification"
            const data = {phone:phoneNum}
            const smsResponse = await fetch(smsurl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(data)
            })
            $w("#button28").enable()
            const responseData = await smsResponse.json()
            authPhoneCode = responseData.data.authCode
            console.log(authPhoneCode);
            authPhCode = authPhoneCode
            toggleTimer();
            $w("#text185").show()
            //$w("#text185").text = "인증번호가 발송되었습니다."
        }
        else {
            $w("#text185").text = "- 제외하고 전화번호를 입력해주세요."
            $w("#text185").show()
        }
    }) */

    /* $w("#button28").onClick(async () => {
        let authCode = $w("#input21").value
        resetTimer();
        if(authCode != authPhoneCode) {
            $w("#text185").show()
            $w("#text185").text = "인증번호가 잘못되었습니다."
        }
        else if(countdownTime =< 0) {
            $w("#button28").disable()
        }
        else {
            const v_phoneUrl = "https://jikgong.p-e.kr/api/join/validation-phone"
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
                console.log(responsePhoneData)
                $w("#text185").text = "이미 가입한 전화번호 입니다."
            }
        }
    }) */

    $w("#button27").onClick(async ()=> {
        let joinId = $w("#input18").value;
        const v_idUrl = "https://www.jikgong.p-e.kr/api/join/validation-loginId"
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
    $w("#text259").hide()
    $w("#text260").hide()

    $w("#text257").onClick(async ()=> {
        let result = await wixWindow.openLightbox("개인 정보 수집 및 이용 동의 (필수)");
        if(result == "confirmed") {
            joinData.privacyConsent = true;
            $w("#text259").show();
        }
    })

    $w("#text258").onClick(async ()=> {
        let result = await wixWindow.openLightbox("이용 약관 동의 (필수)");
        if(result == "confirmed") {
            joinData.isNotification = true;
            $w("#text260").show()
        }
    })

    $w("#button26").onClick(async () => {

        checkJoinData = "true";

        /* if(checkPhoneCode == "false") {
            $w("#text185").show()
            $w("#text185").text = "전화번호 인증해야 합니다."
        } */
        if(checkRepeatPhone == "false") {
            $w("#text185").show()
            $w("#text185").text = "이미 가입하신 전화번호 입니다."
        }
        else {
            joinData.manager = $w("#input20").value
            if(!joinData.manager) {
                checkJoinData = "false"
                $w("#button26").label = "관리자 이름을 입력해주세요."
            }
            joinData.role = "ROLE_COMPANY"

            joinData.deviceToken = "token"
            
            joinData.companyName = $w("#input13").value 

            joinData.phone = $w("#input22").value 

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
                $w("#text188").show();
                console.log("1");
                $w("#text188").text = "올바른 이메일 형식을 작성해주세요."
            }

            let region = $w("#addressInput2").value
            joinData.region = region.formatted
            if(!joinData.region && region.formatted != "") {
                checkJoinData = "false"
                $w("#button26").label = "회사 주소를 입력해주세요."
            }

            if(checkJoinData == "true") {
                $w("#section1").collapse();
                $w("#section2").expand();
            }
        }
    });

    $w("#button30").onClick(async () => {  
        //joinData.bank = $w("#dropdown3").value
        checkJoinData = "true";
        
        /* if(!joinData.bank) {
            checkJoinData = "false"
            $w("#button30").label = "은행을 선택해주세요."
        } */
        //joinData.account = $w("#input19").value
        /* if(!joinData.account) {
            checkJoinData = "false"
            $w("#button30").label = "계좌번호를 입력해주세요."
        } */
        if(checkJoinData == "true") {
            $w("#section2").collapse();
            $w("#section3").expand();
        }
    })

    $w("#button34").onClick(async () => {  

        let password = $w("#input17").value;
        let repassword = $w("#input16").value;

        checkJoinData = "true";

        if(checkRepeatId == "false") {
            $w("#text176").show()
            $w("#text176").text = "중복된 ID 입니다."
        }
        else if(password != repassword) {
            $w("#text173").show()
            $w("#text173").text = "입력하신 비밀번호와 일치하지 않습니다."
        }
        else if(!joinData.privacyConsent || !joinData.isNotification) {
            $w("#button34").label = "모든 약관에 동의하지 않았습니다."
        }
        else if(checkJoinData == "true") {
            console.log(joinData);
            joinData.password = password
            //joinData.role = "ROLE_COMPANY"
            //joinData.requestContent = "직공 서비스에 가입하고 싶습니다."

            const joinUrl = "https://www.jikgong.p-e.kr/api/join/company/join"
            const joinResponse = await fetch(joinUrl, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(joinData)
            })
            const responseJoinData = await joinResponse.json()
            
            if (responseJoinData.message == "기업 회원 가입 완료") {
                $w("#button34").label = responseJoinData.message
                let result = await wixWindow.openLightbox("회원가입확인창");
                if(result == "confirmed") {
                    wixLocation.to(`/로그인`);
                }
            }
            else {
                console.log(responseJoinData)
                $w("#button34").label = "회원 가입 오류 : 재작성 및 재시도 부탁드립니다."
            }
        }
        else {
            $w("#button34").label = "회원 정보를 올바르게 입력해주세요."
        }
    })
})

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phoneNumber);
}

function toggleTimer() {
    if (isTimerRunning) {
        // 타이머가 실행 중이라면 멈추기
        //stopTimer();
        resetTimer()
        //한번 확인해보기
    } else {
        // 타이머가 멈춘 상태라면 시작
        startTimer();
    }
}

function startTimer() {
    // 타이머 초기화
    clearInterval(timerInterval);
    countdownTime = 180;

    // 타이머 실행
    timerInterval = setInterval(() => {
        // 분과 초 계산
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;

        // 텍스트 업데이트
        $w("#text185").text = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // 시간이 끝났으면 타이머 정지
        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            $w("#text185").text = "다시 인증번호 버튼을 눌러주세요.";
            //onTimerEnd(); // 타이머 종료 시 실행할 함수 호출
        }

        countdownTime--; // 1초 감소
    }, 1000); // 1초마다 반복
}

function stopTimer() {
    if (timerInterval) {
        isTimerRunning = false;
        //$w("#startButton").label = "시작하기"; // 첫 번째 버튼 라벨을 '시작하기'로 변경
        clearInterval(timerInterval); // 타이머 멈춤
    }
}

function resetTimer() {
    stopTimer(); // 타이머 멈추기
    countdownTime = 180; // 시간 초기화 (3분)
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    //$w("#timerText").text = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // 텍스트 "3:00"으로 초기화
    //$w("#startButton").label = "시작하기"; // 버튼 라벨을 '시작하기'로 변경
}




