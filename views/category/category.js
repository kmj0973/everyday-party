import { Header } from "../../public/header/header.js";

// import로 헤더 렌더링
const headerRender = () => {
    return Header();
}

headerRender();

// best_card_container, card_container에
// innerHTML로 넣어줄 템플릿
const cardTemplate = (categoryData) => {

    // 숫자 천 단위로(,)
    const priceComma = categoryData.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `
        <div class="category_card">
            <div class="card_img_wrap">
                <img class="card_img" src="../../public/image/test.png" 
                    alt="크리스마스 카드 이미지"
                >
            </div>
            <div class="card_contents">
                <h3 class="card_title">${categoryData.name}</h3>
                <div class="purchase_info_wrap">
                    <span class="card_price">${priceComma}원</span>
                    <button class="card_cart_button">장바구니 버튼</button>
                </div>
                <p class="card_review">${categoryData.review}+</p>
            </div>
        </div>    
        `;
}

const categoryList = document.querySelectorAll(".category li a");
const categoryBestCardElement = document.querySelector(".best_card_container");
const categoryContainerElement = document.querySelector(".card_container");
const cardAmountElement = document.querySelector(".card_amount");

// 페이지 로드 시 저장된 카테고리 정보를 렌더링
document.addEventListener("DOMContentLoaded", () => {
    const selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory) {
        cardRender(selectedCategory);
    }
});

// 카테고리 버튼을 클릭했을 때 실행되는 이벤트 함수 
for (let i = 0; i < categoryList.length; i++) {
    categoryList[i].addEventListener("click", () => {

        // 현재는 id 값으로 가져오지만 api가 완성되면 
        // href 값을 가져와서 구현 예정
        const categoryId = categoryList[i].getAttribute("id");

        // localStorage에 categoryId값 저장
        localStorage.setItem("selectedCategory", categoryId);

        cardRender(categoryId);
    });
}

const cardRender = async (categoryId) => {
    try {
        // 쿼리 파라미터에 해당 카테고리 id를 보내면 
        // 해당 카테고리의 데이터를 반환해주는 api
        const response = await fetch(`http://localhost:5000/api/products?category=${categoryId}`);
        const data = await response.json();

        data.products.map(products => {
            // 카테고리에 해당하는 베스트 상품을 렌더링
            if(categoryId === products.category) {
                categoryBestCardElement.innerHTML = 
                    data.products.map(categoryData => cardTemplate(categoryData))
                        .join("");
            } 

            // 카테고리에 상품을 렌더링
            if(categoryId === products.category) {
                cardAmountElement.innerHTML = `총 ${data.products.length}건`;
                categoryContainerElement.innerHTML = 
                    data.products.map(categoryData => cardTemplate(categoryData))
                        .join("");

            } 
        });
    } 
    catch (error) {
        console.log(error.message);
    }
}

const label = document.querySelector(".label");
const options = document.querySelectorAll(".option");

// 클릭한 옵션의 텍스트를 라벨에 넣어주기
const handleSelect = (option) => {
    label.firstElementChild.innerHTML = option.textContent;
    label.parentNode.classList.remove('active');
  }


options.forEach(option => {
	option.addEventListener("click", () => handleSelect(option))
})

// 라벨을 클릭했을 때 옵션 목록 열림/닫힘
label.addEventListener('click', function(){
    if(label.parentNode.classList.contains('active')) {
      label.parentNode.classList.remove('active');
    } else {
      label.parentNode.classList.add('active');
    }
  });