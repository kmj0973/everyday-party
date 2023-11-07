import { Header } from "../../public/header/header.js";

// import로 헤더 렌더링
const headerRender = () => {
    return Header();
}

headerRender();

// best_card_container에 innerHTML로 넣어줄 템플릿
// const bestCardTemplate = (categoryData, highSales) => {

//     // categoryData가 null이 false면 card
//     // true면 에러페이지
//     if (categoryData !== null) {

//         let rankArr = [];
//         for (let i = 0; i < highSales.length; i++) {
//             rankArr.push(i + 1);
//         }

//         // 숫자 천 단위로(,)
//         const priceComma = categoryData.price
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//         return `
//             <div class="category_card">
//                 <span class="card_rank"></span>
//                 <div class="card_img_wrap">
//                     <img class="card_img" src=${categoryData.file.path} 
//                         alt=${categoryData.file.name}
//                     >
//                 </div>
//                 <div class="card_contents">
//                     <h3 class="card_title">${categoryData.name}</h3>
//                     <div class="purchase_info_wrap">
//                         <span class="card_price">${priceComma}원</span>
//                         <button class="card_cart_button">장바구니 버튼</button>
//                     </div>
//                     <p class="card_review">${categoryData.review}+</p>
//                 </div>
//             </div>    
//         `;
//         // })
//     } else {
//         return `
//             <div class="not_found_card">
//                 <iconify-icon 
//                     icon="iconamoon:cloud-no-light" 
//                     style="color: #ccc;"
//                     width="46"
//                 >
//                 </iconify-icon>
//                 <p>상품이 존재하지 않습니다.</p>
//             </div>    
//         `;
//     }
// }

// card_container에 innerHTML로 넣어줄 템플릿
const cardTemplate = (categoryData) => {

    // categoryData가 null이 false면 card
    // true면 에러페이지

    if (categoryData !== null) {
        // 숫자 천 단위로(,)
        const priceComma = categoryData.price
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `
            <div class="category_card">
                <div class="card_img_wrap">
                    <img class="card_img" src=${categoryData.file.path} 
                        alt=${categoryData.file.name}
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
    } else {
        return `
            <div class="not_found_card">
                <iconify-icon 
                    icon="iconamoon:cloud-no-light" 
                    style="color: #ccc;"
                    width="46"
                >
                </iconify-icon>
                <p>상품이 존재하지 않습니다.</p>
            </div>    
        `;
    }
}

const categoryList = document.querySelectorAll(".category li a");
const categoryTitle = document.querySelector(".category_title");
const categoryBestCardElement = document.querySelector(".best_card_container");
const categoryCardElement = document.querySelector(".card_container");
const categoryBestErrorElement = document.querySelector(".best_error_container");
const categoryErrorElement = document.querySelector(".card_error_container");
const cardAmountElement = document.querySelector(".card_amount");
const selectElement = document.querySelectorAll(".option_list li");

// 페이지 로드 시 저장된 카테고리 정보를 렌더링
document.addEventListener("DOMContentLoaded", () => {
    const selectedCategory = localStorage.getItem("selectedCategory");

    if (selectedCategory) {
        cardRender(selectedCategory);
    }
});

// 카테고리 버튼을 클릭했을 때 실행되는 이벤트 함수 
for (let i = 0; i < categoryList.length; i++) {
    categoryList[i].addEventListener("click", (e) => {
        e.preventDefault();
        // 현재는 id 값으로 가져오지만 api가 완성되면 
        // href 값을 가져와서 구현 예정
        const categoryId = categoryList[i].getAttribute("href");

        // localStorage에 categoryId값 저장
        localStorage.setItem("selectedCategory", categoryId);

        cardRender(categoryId);
        categoryURLParams(categoryId)
    });
}

// 카테고리에 해당하는 상품 렌더링
const cardRender = async (categoryId) => {
    try {
        // 쿼리 파라미터에 해당 카테고리 id를 보내면 
        // 해당 카테고리의 데이터를 반환해주는 api
        const response = await fetch(`/api/products?category=${categoryId}`);
        const data = await response.json();

        console.log(data)

        // 최신 순 정렬
        const latest = [...data.products].sort((a, b) => b.stockedAt - a.stockedAt);
        console.log(latest);

        // 베스트 순 정렬
        const highSales = [...data.products].sort((a, b) => b.sales - a.sales);
        console.log(highSales);

        // 가격 높은 순 정렬
        const highPrice = [...data.products].sort((a, b) => b.price - a.price);
        console.log(highPrice);

        // 가격 낮은 순 정렬
        const rowPrice = [...data.products].sort((a, b) => a.price - b.price);
        console.log(rowPrice);

        // product 단수로 
        data.products.map((product, i) => {
            const categoryName = product.category[i].categoryName;

            // 카테고리에 해당하는 베스트 상품을 렌더링
            if (categoryId === categoryName) {
                categoryBestCardElement.innerHTML =
                    highSales.map(categoryData => cardTemplate(categoryData))
                        .join("");
            }

            // 카테고리에 상품을 렌더링
            if (categoryId === categoryName) {
                cardAmountElement.innerHTML = `총 ${data.products.length}건`;
                categoryTitle.innerHTML = categoryName;

                categoryCardElement.innerHTML =
                    data.products.map(categoryData => cardTemplate(categoryData))
                        .join("");

                if (latest) {
                    selectElement[0].addEventListener("click", () => {
                        categoryCardElement.innerHTML =
                            latest.map(categoryData => cardTemplate(categoryData))
                                .join("");
                    })
                }

                if (highSales) {
                    selectElement[1].addEventListener("click", () => {
                        categoryCardElement.innerHTML =
                            highSales.map(categoryData => cardTemplate(categoryData))
                                .join("");
                    })
                }

                if (highPrice) {
                    selectElement[2].addEventListener("click", () => {
                        categoryCardElement.innerHTML =
                            highPrice.map(categoryData => cardTemplate(categoryData))
                                .join("");
                    })
                }

                if (rowPrice) {
                    selectElement[3].addEventListener("click", () => {
                        categoryCardElement.innerHTML =
                            rowPrice.map(categoryData => cardTemplate(categoryData))
                                .join("");
                    })
                }
            }
        });
    }
    catch (error) {
        console.log(error.message)
        if (error.message = "404") {
            categoryErrorElement(null);
            categoryBestErrorElement(null);
        }
    }
}

const categoryURLParams = (categoryId) => {
    // const urlStr = `http://localhost:5000/category/category.html#?category=${categoryId}`;
    // const url = new URL(urlStr);
    // const urlParams = url.searchParams;
    // console.log(urlParams.get("category"));

    const searchParams = new URLSearchParams(location.href);
    console.log(searchParams);
} 

categoryURLParams()

const label = document.querySelector(".label");
const options = document.querySelectorAll(".option");

const dropDownFilter = () => {
    // 클릭한 옵션의 텍스트를 라벨에 넣어주기
    const handleSelect = (option) => {
        label.firstElementChild.innerHTML = option.textContent;
        label.parentNode.classList.remove('active');
    }

    options.forEach(option => {
        option.addEventListener("click", () => handleSelect(option))
    })

    // 라벨을 클릭했을 때 옵션 목록 열림/닫힘
    label.addEventListener('click', function () {
        if (label.parentNode.classList.contains('active')) {
            label.parentNode.classList.remove('active');
        } else {
            label.parentNode.classList.add('active');
        }
    });
}

dropDownFilter();
