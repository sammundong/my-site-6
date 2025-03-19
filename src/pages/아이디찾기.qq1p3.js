// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from 'wix-location-frontend';
import { session } from 'wix-storage-frontend';
import wixWindow from 'wix-window-frontend';

let isTimerRunning = false; // 타이머 상태를 저장하는 변수
let countdownTime = 180; // 3분(180초)
let timerInterval; // 타이머 인터벌 저장 변수
let authPhCode = 0;

$w.onReady(function () {

    $w("#text160").hide();
    var authPhoneCode = "";

    var phoneNum = "";

    const smsurl = "https://www.jikgong.p-e.kr/api/member-info/loginId-verification"
    $w("#button22").onClick(async () => {
        $w("#button23").enable()
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
                        toggleTimer();
                    }
                })
                .catch((error) => {
                    // 삽입 실패 시 처리
                    resetTimer();
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
        if(countdownTime <= 0) {
            $w("#button23").disable()
        }
        else {
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
                            stopTimer();
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

function toggleTimer() {
    if (isTimerRunning) {
        // 타이머가 실행 중이라면 멈추기
        //stopTimer();
        resetTimer();
        startTimer();
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
        $w("#button22").label = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // 시간이 끝났으면 타이머 정지
        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            $w("#text160").text = "다시 인증번호 버튼을 눌러주세요.";
            //onTimerEnd(); // 타이머 종료 시 실행할 함수 호출
        }

        countdownTime--; // 1초 감소
    }, 1000); // 1초마다 반복
}

function stopTimer() {
    if (timerInterval) {
        isTimerRunning = false;
        $w("#button22").label = "인증번호";
        //$w("#startButton").label = "시작하기"; // 첫 번째 버튼 라벨을 '시작하기'로 변경
        clearInterval(timerInterval); // 타이머 멈춤
    }
}

function resetTimer() {
    stopTimer(); // 타이머 멈추기
    countdownTime = 180; // 시간 초기화 (3분)
    $w("#button22").label = "인증번호";
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    //$w("#timerText").text = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // 텍스트 "3:00"으로 초기화
    //$w("#startButton").label = "시작하기"; // 버튼 라벨을 '시작하기'로 변경
}