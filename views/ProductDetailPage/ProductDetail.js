import { Header } from "../public/header/header.js";
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
};

headerRender();

//1. 개수선택 카운트 업,다운 구현하기
//+,- 버튼과 number input을 가져와서 onclick했을때 num value값 바꿔주기
const plusBtn = document.querySelector("#up");
const minusBtn = document.querySelector("#down");
const numInput = document.querySelector(".number-select input");

plusBtn.onclick = function () {
    //console.log('+ clicked');
    numInput.value++;
};
minusBtn.onclick = function () {
    if (numInput.value <= 1) {
        numInput.value == 0;
    } else {
        numInput.value--;
    }
};

//2. 탭버튼 구현하기
const links = document.querySelectorAll(".tab-list li a");
const items = document.querySelectorAll(".tab-list li");

//a 태그 기능 막기
for (let i = 0; i < links.length; i++) {
    links[i].onclick = function (e) {
        e.preventDefault();
    };
}
//클릭한 item 은 active 클래스 추가, 아닌것은 active 클래스 제거
for (let i = 0; i < items.length; i++) {
    items[i].onclick = function () {
        //items의 a 태그의 href 속성을 불러와서 어떤 탭을 선택했는지 확인
        //tab-content-container 안에 있는 .tab, .tab-list li 을 모두 불러온 후, active class를 제거
        //items에만 active 클래스 추가
        //console.log(this);
        const tabId = this.querySelector("a").getAttribute("href");
        document.querySelectorAll(".tab-list li, .tab-content-container .tab").forEach(function (item) {
            item.classList.remove("active");
        });

        document.querySelector(tabId).classList.add("active");
        this.classList.add("active");
    };
}

//3. 데이터 가져오기
//3-1. 쿼리스트링 속의 id값 받아오기
/**
 * const nowUrl = location.href;
 * const productId = nowUrl.split('?id=');
 * 키값이 하나가 아닐 수도 있음 => 그럴땐 어떻게 ??
 * => URLSearchParams (key,value값으로 뽑아줌, 여기에 location.href를 보내주면 객체 형태로 현재 쿼리 스트링으로 날라온 키,value값을 뽑아줌)
 */

// 현재 URL을 가져옵니다.
const currentUrl = new URL(window.location.href);

const newSearch = currentUrl.hash.replace("#product", "");
console.log(newSearch);
const productId = new URLSearchParams(newSearch).get("id");

console.log("id:", productId);

//받아온 아이디를 기준으로 products 배열에서 객체를 찾음, 그리고 name, price 등등 조회하기

const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productDescription = document.querySelector(".product-description");
const colorOptionSelect = document.querySelector(".color");
const sizeOptionSelect = document.querySelector(".size");
let productImg = "";
//const productId = "654a60f295cd6f5052eaad3c";

//api 호출하여 이름, 가격, 상품 설명을 보여준다.

fetch(`/api/products?products=${productId}`)
    .then((response) => response.json())
    .then((data) => {
        console.log("아이디값으로 받아온 데이터", data);
        //const product = data.products.find(({_id})=>_id===productId);
        const product = data.products[0];
        //console.log(data.products[0]);
        productName.innerHTML = product.name;
        productPrice.innerHTML = product.price;
        productDescription.innerHTML = product.description;
        productImg = product.file.path;
        document.querySelector(".product-img").setAttribute("src", productImg);
        // product.option 배열의 길이 체크, 포문 돌면서 option 생성

        const colorOption = product.option.color;
        const sizeOption = product.option.size;
        //console.log(colorOption);
        for (let i = 0; i < colorOption.length; i++) {
            const optionElement = document.createElement("option");
            optionElement.setAttribute("class", "option-select");

            optionElement.innerText = colorOption[i];
            console.log(optionElement.value);
            colorOptionSelect.appendChild(optionElement);
        }

        for (let i = 0; i < sizeOption.length; i++) {
            const optionElement = document.createElement("option");
            optionElement.setAttribute("class", "option-select");

            optionElement.innerText = sizeOption[i];
            console.log(optionElement.value);
            sizeOptionSelect.appendChild(optionElement);
        }
    })
    .catch((error) => {
        alert("상품 상세 정보를 불러오지 못했습니다.");
        console.log(error);
    });

//4. 장바구니,구매하기 버튼 클릭했을 때 로컬스토리지에 개수,옵션값 저장
const productQuantity = document.querySelector("#productNumber");
const cartBtn = document.querySelector(".cart");
const buyBtn = document.querySelector(".buy");
let selectedColorOption = "";
let selectedSizeOption = "";
let selectedQuantity = "";

//카트 추가하는 함수
function addCartItem(selectedColorOption, selectedSizeOption, selectedQuantity) {
    //원래방식대로라면 prooductInfo에는 id, option, quantity만 넣는방식 추천
    const productInfo = {
        id: productId,
        name: productName.innerText,
        price: productPrice.innerHTML,
        quantity: selectedQuantity,
        option: [selectedColorOption, selectedSizeOption],
        imgsrc: productImg,
    };
    //카트 배열 가져오기 -> string 형태의 prevCart를 배열로 변환
    const previousCart = JSON.parse(localStorage.getItem("cart"));
    //console.log('isArray?',Array.isArray(previousCart),previousCart);
    if (previousCart === null) {
        localStorage.setItem("cart", JSON.stringify([productInfo]));
    } else {
        //배열인지 확인
        const isArray = Array.isArray(previousCart);
        if (isArray) {
            previousCart.push(productInfo);
            localStorage.setItem("cart", JSON.stringify(previousCart));
        } else {
            console.log("배열이 존재하지 않거나 데이터가 배열 형태가 아님");
        }
    }
}

//5. 구매하기 버튼 눌렀을 때

cartBtn.addEventListener("click", () => {
    if (colorOptionSelect.options.length === 0 && sizeOptionSelect.options.length !== 0) {
        selectedColorOption = null;
        selectedSizeOption = sizeOptionSelect.options[sizeOptionSelect.selectedIndex].value;
    } else if (colorOptionSelect.options.length !== 0 && sizeOptionSelect.options.length === 0) {
        selectedColorOption = colorOptionSelect.options[colorOptionSelect.selectedIndex].value;
        selectedSizeOption = null;
    } else if (colorOptionSelect.options.length !== 0 && sizeOptionSelect.options.length !== 0) {
        selectedColorOption = colorOptionSelect.options[colorOptionSelect.selectedIndex].value;
        selectedSizeOption = sizeOptionSelect.options[sizeOptionSelect.selectedIndex].value;
    } else if (colorOptionSelect.options.length === 0 && sizeOptionSelect.options.length === 0) {
        selectedColorOption = null;
        selectedSizeOption = null;
    }

    selectedQuantity = productQuantity.value;
    addCartItem(selectedColorOption, selectedSizeOption, selectedQuantity);
});

buyBtn.addEventListener("click", () => {
    if (colorOptionSelect.options.length === 0 && sizeOptionSelect.options.length !== 0) {
        selectedColorOption = null;
        selectedSizeOption = sizeOptionSelect.options[sizeOptionSelect.selectedIndex].value;
    } else if (colorOptionSelect.options.length !== 0 && sizeOptionSelect.options.length === 0) {
        selectedColorOption = colorOptionSelect.options[colorOptionSelect.selectedIndex].value;
        selectedSizeOption = null;
    } else if (colorOptionSelect.options.length !== 0 && sizeOptionSelect.options.length !== 0) {
        selectedColorOption = colorOptionSelect.options[colorOptionSelect.selectedIndex].value;
        selectedSizeOption = sizeOptionSelect.options[sizeOptionSelect.selectedIndex].value;
    } else if (colorOptionSelect.options.length === 0 && sizeOptionSelect.options.length === 0) {
        selectedColorOption = null;
        selectedSizeOption = null;
    }
    addCartItem(selectedColorOption, selectedSizeOption, selectedQuantity);
});
