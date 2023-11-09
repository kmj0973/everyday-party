// import로 헤더 렌더링
import { Header } from "../public/header/header.js";

const headerRender = () => {
    return Header();
};

headerRender();
//상품 정보 관련
const productName = document.querySelector("#product-name");
const productPrice = document.querySelector("#product-price");
const productCategory = document.querySelector("#product-category");
const productColor = document.querySelector("#product-color");
const productSize = document.querySelector("#product-size");

//상품 리스트
const mainList = document.querySelector(".main-list");
const mainCategory = document.querySelector(".main-category");

await getAllProductData();

async function getAllProductData() {
    try {
        const data = await fetch("/api/products").then((result) => result.json());

        const products = await data.products;
        console.log(products);
        mainList.appendChild(createProductList(products));
    } catch (err) {
        console.log(err);
    }
}

function createProductList(products) {
    const listWrapper = document.createElement("div");
    listWrapper.setAttribute("class", "list-container");
    for (let i = 0; i < products.length; i++) {
        listWrapper.innerHTML += `<div class="list-wrapper"><div class="list-top">
        <div style="padding-top: 10px">
            <input type="checkbox" class="delete-check"/>
            <div class="product-id">ID:${products[i]._id}</div>
        </div>
        <button class="modify-btn">수정</button>
    </div>
    <div class="list-body">
        <img src="${products[i].file ? products[i].file.path : "이미지없음"}" />
        <div class="product-details">${products[i].name}</div>
        <div>${products[i].category.map((result) => result.categoryName)}</div>
        <div>${products[i].price.toLocaleString()}</div>
        <div>${products[i].option.color.map((result) => result)}/${products[i].option.size.map(
            (result) => result
        )}</div>
    </div><div>`;
    }
    return listWrapper;
}

//상품 추가 이미지 프리뷰 이벤트
const fileImage = document.querySelector("#product-image");
let filePath = "";
function onFileChange(e) {
    let preview = new FileReader();
    preview.onload = function (e) {
        document.querySelector(".product-image-preview").src = e.target.result;
        filePath = e.target.result;
    };
    preview.readAsDataURL(fileImage.files[0]);
    console.log(fileImage.files[0]);
}

fileImage.addEventListener("change", onFileChange);

//db에 상품 추가 이벤트
const addProductBtn = document.querySelector(".add-product-btn");

async function onAddBtn(e) {
    try {
        if (!confirm("추가하시겠습니까?")) {
            return;
        }
        if (!productName.value || !productPrice.value) {
            throw new Error("상품 이름 또는 가격을 확인해주세요");
        }
        console.log(productCategory.value.split(","));
        const data = {
            name: productName.value,
            price: productPrice.value,
            //category: "halloween",
            option: { color: productColor.value.split(","), size: productSize.value.split(",") },
            file: { name: fileImage.files[0].name, path: filePath },
        };
        console.log(data);
        const response = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        //console.log(JSON.stringify(data));
    } catch (err) {
        alert(err.message);
    }
}

addProductBtn.addEventListener("click", onAddBtn);

//db 상품 삭제 이벤트
const deleteCheck = document.querySelectorAll(".delete-check");
const deleteBtn = document.querySelector(".delete-product-btn");
let deleteid = [];
async function onDeleteBtn(e) {
    if (!confirm("삭제하시겠습니까?")) {
        return;
    }
    for (let i = 0; i < deleteCheck.length; i++) {
        if (deleteCheck[i].checked) {
            deleteid.push(deleteCheck[i].nextSibling.nextSibling.innerText.substr(3));
            deleteCheck[i].parentElement.parentElement.parentElement.remove();
        }
    }
    try {
        for (let i = 0; i < deleteid.length; i++) {
            const response = await fetch(`/api/products/${deleteid[i]}`, {
                method: "DELETE",
            });
        }
    } catch (err) {
        alert(err.message);
    }
}

deleteBtn.addEventListener("click", onDeleteBtn);

//db 상품 수정 이벤트
const modifyBtn = document.querySelectorAll(".modify-btn");

async function onModifyBtn(e) {
    console.log(e.target.previousElementSibling.children[1].innerText.substr(3));
    // try {
    //     const response = await fetch(
    //         `/api/products/${e.target.previousElementSibling.children[1].innerText.substr(3)}`,
    //         {
    //             method: "PATCH",
    //         }
    //     );
    // } catch (err) {
    //     alert(err.message);
    // }
}

modifyBtn.forEach((m) => {
    m.addEventListener("click", onModifyBtn);
    m.addEventListener("click", onShowProductDetailsPage);
});

//페이지 이동
const productInfolPage = document.querySelector(".product-info-page");
const productDetailPage = document.querySelector(".product-details-page");

productInfolPage.addEventListener("click", async function (e) {
    location.reload();
    if (mainList.classList.contains("hide")) {
        mainList.classList.remove("hide");
        mainCategory.classList.remove("hide");
        productDetailPage.classList.add("hide");
    }
});

//상품 추가 페이지 이동 이벤트
const addProductPageBtn = document.querySelector(".add-product-page-btn");

function onShowProductDetailsPage() {
    mainList.classList.add("hide");
    mainCategory.classList.add("hide");
    productDetailPage.classList.remove("hide");
}

addProductPageBtn.addEventListener("click", onShowProductDetailsPage);
