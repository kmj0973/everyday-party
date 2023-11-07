import { Header } from "../public/header/login-header.js";
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
};

headerRender();

//회원가입 정보 중복 확인
const userIdInput = document.querySelector(".id-input"); //아이디
const passwordInput = document.querySelector(".password-input"); //비밀번호
const passwordCheckInput = document.querySelector(".password-check-input"); //비밀번호 확인
const nameInput = document.querySelector(".name-input"); //이름
const emailInput = document.querySelector(".email-input"); //이메일
//전화번호
const tel1 = document.querySelector(".tel1");
const tel2 = document.querySelector(".tel2");
const tel3 = document.querySelector(".tel3");
//주소
const postCode = document.getElementById("postcode");
const address = document.getElementById("address");
const detailAddress = document.getElementById("detailAddress");

const birthday = document.getElementById("birth"); //생일
//중복 체크 버튼, 회원가입 버튼
const idCheckBtn = document.querySelector(".id-check-btn");
const emailCheckBtn = document.querySelector(".email-check-btn");
const phoneCheckBtn = document.querySelector(".phone-check-btn");
const authBtn = document.querySelector(".auth-btn");

const objectData = new Object(); //회원가입 정보 보내줄 객체

//회원가입 버튼 이벤트
async function onAuthorize(e) {
    e.preventDefault();
    try {
        if (objectData.userId === undefined || objectData.userId === null) {
            throw new Error("아이디 중복 확인을 해주세요");
        }
        if (passwordInput.value.length < 8) {
            throw new Error("비밀번호를 8글자 이상 입력해주세요");
        }
        if (passwordInput.value !== passwordCheckInput.value) {
            throw new Error("비밀번호를 확인해주세요");
        }
        //객체 정보 저장
        objectData.grade = "uesr";
        objectData.password = passwordInput.value;
        objectData.name = nameInput.value;
        objectData.address += ` ${detailAddress.value}`;
        objectData.birthday = birthday.value;
        console.log(objectData);

        //db로 객체 정보 저장
        const data = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objectData), // JSON 문자열로 변환
        });

        window.location.href = "/login/login.html";
    } catch (err) {
        alert(err.message);
    }
}

//아이디 검증 이벤트
async function onUserIdCheck(e) {
    e.preventDefault();
    console.log(birthday.value);
    const userId = userIdInput.value;

    try {
        if (userId.length < 4) {
            throw new Error("4글자 이상 입력해주세요");
        }

        const data = await fetch(`/api/auth/check?userId=${userId}`);
        const status = data.status;

        if (status === 409) {
            userIdInput.value = "";
            throw new Error("이미 존재하는 아이디입니다");
        } else if (status === 400) {
            userIdInput.value = "";
            throw new Error("아이디가 유효하지 않습니다");
        }

        objectData.userId = userId;
        console.log(objectData);
        alert("사용 가능한 아이디입니다");
    } catch (err) {
        objectData.userId = null; //검증 완료 이후 정보 변화로 인해 에러가 나는 경우
        alert(err.message);
    }
}

//이메일 검증 이벤트
async function onEmailCheck(e) {
    e.preventDefault();

    const email = emailInput.value;

    try {
        var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

        if (exptext.test(email) == false) {
            //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우
            throw new Error("이메일 형식이 올바르지 않습니다");
        }

        const data = await fetch(`/api/auth/check?email=${email}`);
        const status = data.status;

        if (status === 409) {
            userIdInput.value = "";
            throw new Error("이미 존재하는 이메일입니다");
        } else if (status === 400) {
            userIdInput.value = "";
            throw new Error("이메일이 유효하지 않습니다");
        }

        objectData.email = email;
        console.log(objectData);
        alert("사용 가능한 이메일입니다.");
    } catch (err) {
        objectData.email = null; //검증 완료 이후 정보 변화로 인해 에러가 나는 경우
        alert(err.message);
    }
}

//전화번호 검증 이벤트
async function onPhoneCheck(e) {
    e.preventDefault();

    const phone = `${tel1.value}-${tel2.value}-${tel3.value}`;

    try {
        if (phone.length > 13 || phone.length < 12) {
            //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우
            throw new Error("전화번호 형식이 올바르지 않습니다");
        }

        const data = await fetch(`/api/auth/check?phone=${phone}`);
        const status = data.status;

        if (status === 409) {
            userIdInput.value = "";
            throw new Error("이미 존재하는 전화번호입니다.");
        } else if (status === 400) {
            userIdInput.value = "";
            throw new Error("전화번호가 유효하지 않습니다");
        }

        objectData.phone = phone;
        console.log(objectData);
        alert("사용 가능한 전화번호입니다.");
    } catch (err) {
        objectData.phone = null; //검증 완료 이후 정보 변화로 인해 에러가 나는 경우
        alert(err.message);
    }
}

// 주소 검색 이벤트
const postBtn = document.querySelector(".post-btn");

function checkPost() {
    //daum 우편번호 API
    // 주소 검색 이벤트
    console.log("우편번호");
    new daum.Postcode({
        oncomplete: function (data) {
            let addr = "";
            let extraAddr = "";

            if (data.userSelectedType === "R") {
                addr = data.roadAddress;
            } else {
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === "R") {
                if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== "" && data.apartment === "Y") {
                    extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
                }
            }
            document.getElementById("postcode").value = data.zonecode;
            document.getElementById("address").value = addr;

            objectData.address = `${data.zonecode} ${addr}`;
            document.getElementById("detailAddress").focus();
            console.log(data.zonecode, addr);
        },
    }).open();
}

authBtn.addEventListener("click", onAuthorize); //회원가입 버튼

idCheckBtn.addEventListener("click", onUserIdCheck);
emailCheckBtn.addEventListener("click", onEmailCheck);
phoneCheckBtn.addEventListener("click", onPhoneCheck);

postBtn.addEventListener("click", checkPost); //우편 검색
