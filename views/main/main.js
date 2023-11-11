import { Header } from "../public/header/header.js";
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
};

headerRender();

//순차 함수 실행
Processing();
//promiseAll
async function Processing() {
    await getBestProductData(); //베스트 상품
    await getReviewData(); //리뷰
    await reviewSlideEvent(); //리뷰 슬라이드
}
// getBestProductData();
// getReviewData();
// reviewSlideEvent();
// 베스트 상품 데이터 받아오기
const bestCardContainer = document.querySelector(".best-products-container");

async function getBestProductData() {
    try {
        const data = await fetch("/api/products");
        const products = await data.json().then((result) => result.products);

        const newProductsArr = products;
        newProductsArr.sort((a, b) => b.sales - a.sales); //판매량 많은 순

        bestCardContainer.appendChild(createBestCard(newProductsArr));
    } catch (err) {
        console.log(err);
    }
}

function createBestCard(products) {
    const cardContainer = document.createElement("article");
    cardContainer.setAttribute("id", "best_card_container");
    for (let i = 0; i < 8; i++) {
        cardContainer.innerHTML += `<div class="menu_card">
        <div class="card_img_wrap">
        <a href="/ProductDetailPage/productDetail.html#product?id=${products[i]._id}"><img class="card_img" src="${products[i].file.path}" alt="테스트 이미지" /></a>
        </div>
    <div class="card_contents">
        <h3 class="card_title">${products[i].name}</h3>
        <div class="purchase_info_wrap">
            <span class="card_price">${products[i].price}원</span>
            <button class="card_cart_button">장바구니 버튼</button>
        </div>
        <p class="card_review">${products[i].review.length}</p>
        </div>
    </div>`;
    }
    return cardContainer;
}

// 리뷰 최신순으로 데이터 받아오기
const reviewCardContainer = document.querySelector(".reviews-container");

async function getReviewData() {
    try {
        const data = await fetch(`/api/reviews`);
        const reviews = await data.json().then((result) => result.reviews);

        reviewCardContainer.appendChild(createReviewCard(reviews));
    } catch (err) {
        console.log(err);
    }
}
function createReviewCard(reviews) {
    const cardContainer = document.createElement("ul");
    cardContainer.setAttribute("class", "reviews-list");
    for (let i = 0; i < 8; i++) {
        cardContainer.innerHTML += `<li>
        <img src="${reviews[i].product.file.path}" />
        <div class="review-details">
            <span>${reviews[i].product.name.length > 20 ? reviews[i].product.name.substr(0, 18) + "..." : reviews[i].product.name}</span>
            <p>${reviews[i].article.content}</p>
            <div>${!reviews[i].article.author ? "null" : reviews[i].article.author.name} | ${reviews[i].createdAt.substr(0, 10)}</div>
        </div>
    </li>`;
    }
    return cardContainer;
}

// 배너 슬라이드 바 이벤트
const swiper = new Swiper(".swiper", {
    //swiper 라이브러리 사용
    loop: true,
    centeredSlides: true,
    spaceBetween: 2,
    slidesPerView: 2,
    grabCursor: true,
    slideToClickedSlide: false,
    effect: "coverflow",
    coverflowEffect: {
        rotate: 0,
        slideShadows: true,
        stretch: 70,
    },
    autoplay: {
        // 자동 슬라이드 설정 , 비 활성화 시 false
        delay: 5000, // 시간 설정
        disableOnInteraction: false, // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
    },
    navigation: {
        // 버튼 사용자 지정
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// 리뷰 슬라이드 바 이벤트
async function reviewSlideEvent() {
    const slideList = document.querySelector(".reviews-list");
    const slides = document.querySelectorAll(".reviews-list li");

    let currentIdx = 0; //현재 인덱스
    let slideCount = slides.length; //슬라이드 개수
    let slideWidth = 250;
    let slideMargin = 20;

    makeClone(); //초기 클론 생성

    function makeClone() {
        for (var i = 0; i < slideCount; i++) {
            var clonSlide = slides[i].cloneNode(true); // 원본 list 복제하기
            clonSlide.classList.add("clone");
            slideList.appendChild(clonSlide);
        }
        for (var i = slideCount - 1; i >= 0; i--) {
            var clonSlide = slides[i].cloneNode(true); // 원본 list 복제하기
            clonSlide.classList.add("clone");
            slideList.prepend(clonSlide);
        }
        updateWidth(); //너비 설정
        setInitialPos(); //위치 설정
        setTimeout(() => {
            // 새로고침 시 애니메이션 보이지 않게 하기위해 비동기처리
            slideList.classList.add("animated");
        }, 100);
    }

    function updateWidth() {
        const currentSlides = document.querySelectorAll(".reviews-list li"); //복제된 list 가져오기
        const newSlideCount = currentSlides.length; // 복제된 리스트 길이

        const newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + "px"; // 복제된 list 길이 구하기
        slideList.style.width = newWidth; // 총 width값 전달
    }
    function setInitialPos() {
        // 처음 위치 설정
        const initialTranslateValue = -(slideWidth + slideMargin) * slideCount;
        slideList.style.transform = `translateX(${initialTranslateValue}px)`;
    }

    function moveSlide(num) {
        slideList.style.left = -num * (slideWidth + slideMargin) + "px"; //이동거리
        currentIdx = num;
        if (currentIdx === slideCount || currentIdx === -slideCount) {
            setTimeout(() => {
                slideList.classList.remove("animated"); //트랜지션이 끝난 후 눈 속임을 위한 애니메이션 제거
                slideList.style.left = "0px";
                currentIdx = 0;
            }, 1000);
            setTimeout(() => {
                slideList.classList.add("animated"); //
            }, 1100);
        }
    }
    setInterval(() => {
        moveSlide(currentIdx + 1);
    }, 3000);
}
