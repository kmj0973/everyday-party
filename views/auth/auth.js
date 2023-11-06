import { Header } from "./login-header.js";
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
};

headerRender();

// 주소 검색 이벤트
const postBtn = document.querySelector(".post-btn");

function checkPost() {
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

            document.getElementById("detailAddress").focus();
            console.log(data.zonecode, addr);
        },
    }).open();
}
postBtn.addEventListener("click", checkPost);
