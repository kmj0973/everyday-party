import { Header } from "../public/header/login-header.js";
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
};

headerRender();
// 아이디 비밀번호 검증
const inputUserId = document.querySelector("#userId");
const inputPassword = document.querySelector("#password");
const loginBtn = document.querySelector("#login-btn");
const loginAlert = document.querySelector(".login-alert");

async function onClickLoginButton(e) {
    e.preventDefault();

    const userId = inputUserId.value; //아아디 값
    const password = inputPassword.value; // 비밀번호 값

    try {
        if (userId === "" || password === "") {
            throw new Error("아이디 또는 비밀번호를 확인해주세요");
        }

        const data = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, password }), // JSON 문자열로 변환
        });

        console.log(data);
        if (data.status === 400) {
            // 아이디와 비밀번호 일치하지 않는 경우 Error전달
            throw new Error("아이디 또는 비밀번호를 확인해주세요");
        }

        const userTokens = await data.json().then((result) => result.token); // 토큰 생성
        // 로컬 스토리지에 "access-token"키 값에 토큰 저장
        localStorage.setItem("access-token", userTokens);

        window.location.href = "/main/main.html"; // 로그인 성공 시 메인페이지로 이동
    } catch (err) {
        loginAlert.classList.add("show"); // 일치하지 않는다는 경고문 보여주기
        console.log(err.message);
    }
}

// inputUserId.addEventListener("focus", () => {
//     loginAlert.classList.remove("show"); // input 클릭시 경고문 사라짐
// });
// inputPassword.addEventListener("focus", () => {
//     loginAlert.classList.remove("show"); // input 클릭시 경고문 사라짐
// });
loginBtn.addEventListener("click", onClickLoginButton);
