const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginBtn = document.querySelector("#login-btn");

async function onClickLoginButton(e) {
    e.preventDefault();
    const userId = userIdInput.value;
    const password = passwordInput.value;

    const user = JSON.stringify({ userId, password }); //json형태로 변경

    const data = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, //데이터 json 타입
        body: user,
    });
    console.log(data);
    console.log(user);
    const checkLogin = await data
        .json()
        .then((result) => console.log(result))
        .catch((e) => console.log(e));
}
onClickLoginButton();
loginBtn.addEventListener("click", onClickLoginButton);
