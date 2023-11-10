// import로 헤더 렌더링
import { Header } from "../public/header/header.js";

const headerRender = () => {
    return Header();
};

headerRender();

const token = localStorage.getItem("access-token");
//상품 정보 관련
const productName = document.querySelector("#name");
const productPrice = document.querySelector("#price");
const productCategory = document.querySelector("#category");
const productColor = document.querySelector("#color");
const productSize = document.querySelector("#size");

//상품 리스트
const mainList = document.querySelector(".main-list");
const mainCategory = document.querySelector(".main-category");

await getAllProductData();

async function getAllProductData() {
    //전체 상품데이터 받아오기
    try {
        const data = await fetch("/api/products").then((result) => result.json());

        const products = await data.products;
        console.log(products);
        // console.log(products);
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
        <div>${products[i].option.color.map((result) => result)} / ${products[i].option.size.map((result) => result)}</div>
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
}

fileImage.addEventListener("change", onFileChange);

//db에 상품 추가 이벤트
const addProductBtn = document.querySelector(".add-product-btn");

async function onAddBtn(e) {
    e.preventDefault();
    try {
        if (!confirm("추가하시겠습니까?")) {
            return;
        }
        if (!productName.value || !productPrice.value) {
            throw new Error("상품 이름 또는 가격을 확인해주세요");
        }
        console.log(productCategory.value.split(","));
        const form = new FormData();
        form.append("product_name", fileImage.files[0]);
        form.append("name", productName.value);
        form.append("price", productPrice.value);
        form.append("category", JSON.stringify(productCategory.value.split(",")));
        form.set("option", JSON.stringify({ color: productColor.value.split(","), size: productSize.value.split(",") }));

        const response = await fetch("/api/products", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
        });
        window.location.href = "/admin/admin.html";
    } catch (err) {
        alert(err.message);
    }
}

addProductBtn.addEventListener("click", onAddBtn);

//db 상품 수정 이벤트
const modifyBtn = document.querySelectorAll(".modify-btn");
const modifyCheckBtn = document.querySelector(".modify-product-btn");
let fileName = "";
let path = "";
let imageId = "";
async function onModifyBtn(e) {
    console.log(e.target.previousElementSibling.children[1].innerText.substr(3));
    imageId = e.target.previousElementSibling.children[1].innerText.substr(3);
    try {
        const data = await fetch(`/api/products?products=${imageId}`).then((result) => result.json());

        const products = await data.products;
        const catelist = [];

        products[0].category.map((n) => {
            catelist.push(n.categoryName);
        });
        console.log(products[0].file.name);
        productName.value = products[0].name;
        productPrice.value = products[0].price;
        productCategory.value = catelist.join(",");
        productColor.value = products[0].option.color.join(",");
        productSize.value = products[0].option.size.join(",");
        document.querySelector(".product-image-preview").src = products[0].file.path;
        path = products[0].file.path;
        if (fileImage.files[0] === undefined) {
            fileName = products[0].file.name;
        }
        console.log(fileImage);
    } catch (err) {
        alert(err.message);
    }
}
async function onModifyCheckBtn(e) {
    try {
        if (!confirm("수정하시겠습니까?")) {
            return;
        }
        if (!productName.value || !productPrice.value) {
            throw new Error("상품 이름 또는 가격을 확인해주세요");
        }
        console.log(productCategory.value.split(","));
        const form = new FormData();
        form.append("product_name", { name: fileImage.files[0] !== undefined ? fileImage.files[0].name : fileName, path: path });
        form.append("name", productName.value);
        form.append("price", productPrice.value);
        form.append("category", JSON.stringify(productCategory.value.split(",")));
        form.set("option", JSON.stringify({ color: productColor.value.split(","), size: productSize.value.split(",") }));

        const data = {
            name: productName.value,
            price: productPrice.value,
            //category: "halloween",
            option: { color: productColor.value.split(","), size: productSize.value.split(",") },
            file: { name: fileImage.files[0] !== undefined ? fileImage.files[0].name : fileName, path: path },
        };
        console.log(data);
        const response = await fetch(`/api/products/${imageId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: form,
        });
        console.log(response);
        //window.location.href = "/admin/admin.html";
    } catch (err) {
        alert(err.message);
    }
}
modifyCheckBtn.addEventListener("click", onModifyCheckBtn);
modifyBtn.forEach((m) => {
    m.addEventListener("click", onModifyBtn);
    m.addEventListener("click", onShowProductDetailsPage);
});

//db 상품 삭제 이벤트
const deleteCheck = document.querySelectorAll(".delete-check");
const deleteBtn = document.querySelector(".delete-product-btn");
let deleteid = []; // 삭제 아이디 배열
async function onDeleteBtn(e) {
    if (!confirm("삭제하시겠습니까?")) {
        return;
    }
    for (let i = 0; i < deleteCheck.length; i++) {
        if (deleteCheck[i].checked) {
            deleteid.push(deleteCheck[i].nextSibling.nextSibling.innerText.substr(3)); //삭제할 아이디 하나씩 넣기
            deleteCheck[i].parentElement.parentElement.parentElement.remove();
        }
    }
    try {
        for (let i = 0; i < deleteid.length; i++) {
            const response = await fetch(`/api/products/${deleteid[i]}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
        }
    } catch (err) {
        alert(err.message);
    }
}

deleteBtn.addEventListener("click", onDeleteBtn);

//오더 정보 가져오기
const mainOrderList = document.querySelector(".main-order-list");

await getAllOrderData();

async function getAllOrderData() {
    try {
        const response = await fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }).then((result) => result.json());

        const orders = response.orderlist;

        mainOrderList.appendChild(createOrderList(orders));
    } catch (err) {
        console.log(err);
    }
}
// async function findPhoto(id) {
//     //상품 사진 찾아주는 함수
//     try {
//         const data = await fetch(`/api/products?products=654a5b1c4b35e1a3bcf867c5`).then((result) => result.json());

//         const products = data.products;
//         console.log(data);
//         return products[0].file.path;
//     } catch (err) {
//         console.log(err);
//     }
// }
//${findPhoto(orders[i].products[0]._id)}
function createOrderList(orders) {
    const listWrapper = document.createElement("div");
    listWrapper.setAttribute("class", "list-container");

    for (let i = 0; i < orders.length; i++) {
        listWrapper.innerHTML += `<div class="list-wrapper">
        <div class="list-top">
            <div style="padding-top: 10px">
                <input type="checkbox" class="delete-order-check" />
                <div class="order-id">ID:${orders[i]._id}</div>
            </div>
        </div>
        <div class="list-body">
            <img src="" />
            <div class="ordered-at" style="margin-left:2%">${String(orders[i].orderedAt).substr(0, 10)}</div>
            <select class="select-order" style="margin-left:1%" >
                <option value="배송준비" ${orders[i].deliveryStatus == "배송준비" ? "selected" : null}>배송준비</option>
                <option value="배송중" ${orders[i].deliveryStatus == "배송중" ? "selected" : null}>배송중</option>
                <option value="배송완료" ${orders[i].deliveryStatus == "배송완료" ? "selected" : null}>배송완료</option>
                <option value="주문완료" ${orders[i].deliveryStatus == "주문완료" ? "selected" : null}>주문완료</option>
                <option value="주문취소" ${orders[i].deliveryStatu == "주문취소" ? "selected" : null}>주문취소</option>
            </select>
            <div style="padding-left:2%">${Number(orders[i].totalPrice).toLocaleString()}</div>
            <button class="modify-order-btn">수정</button>
        </div>
    </div>`;
    }
    return listWrapper;
}

//오더 삭제 이벤트
const deleteOrderCheck = document.querySelectorAll(".delete-order-check");
const deleteOrderBtn = document.querySelector(".delete-order-btn");
let deleteOrderid = []; // 삭제 아이디 배열
async function onDeleteOrderBtn(e) {
    if (!confirm("삭제하시겠습니까?")) {
        return;
    }
    for (let i = 0; i < deleteOrderCheck.length; i++) {
        if (deleteOrderCheck[i].checked) {
            deleteOrderid.push(deleteOrderCheck[i].nextSibling.nextSibling.innerText.substr(3)); //삭제할 아이디 하나씩 넣기
            deleteOrderCheck[i].parentElement.parentElement.parentElement.remove();
        }
    }
    try {
        for (let i = 0; i < deleteOrderid.length; i++) {
            const response = await fetch(`/api/orders/${deleteOrderid[i]}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        }
    } catch (err) {
        alert(err.message);
    }
}

deleteOrderBtn.addEventListener("click", onDeleteOrderBtn);

//오더 수정 이벤트
const modifyOrderBtn = document.querySelectorAll(".modify-order-btn");
const selectOrder = document.querySelector(".select-order");
async function onModifyOrderBtn(e) {
    try {
        if (!confirm("배송 상태를 수정하시겠습니까?")) {
            return;
        }
        const orderId = e.target.parentElement.previousSibling.previousSibling.children[0].children[1].innerText.substr(3);
        const changedStatus = e.target.previousSibling.previousSibling.previousSibling.previousSibling.value;

        const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ changedStatus }),
        });
        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

modifyOrderBtn.forEach((m) => {
    m.addEventListener("click", onModifyOrderBtn);
});
//페이지 이동
const productPage = document.querySelector(".product-page");
const orderPage = document.querySelector(".order-page");
const productInfolPage = document.querySelectorAll(".product-info-page");
const orderInfoPage = document.querySelectorAll(".product-order-page");
const productDetailPage = document.querySelector(".product-details-page");

productInfolPage.forEach((n) =>
    n.addEventListener("click", async function (e) {
        mainList.classList.remove("hide");
        mainCategory.classList.remove("hide");
        productDetailPage.classList.add("hide");

        if (productPage.classList.contains("hide")) {
            orderPage.classList.toggle("hide");
            productPage.classList.toggle("hide");
        }
    }),
);
orderInfoPage.forEach((n) =>
    n.addEventListener("click", async function (e) {
        mainList.classList.add("hide");
        mainCategory.classList.add("hide");
        productDetailPage.classList.add("hide");
        if (orderPage.classList.contains("hide")) {
            orderPage.classList.toggle("hide");
            productPage.classList.toggle("hide");
        }
    }),
);
//상품 추가 페이지 이동 이벤트
const addProductPageBtn = document.querySelector(".add-product-page-btn");

function onShowProductDetailsPage() {
    mainList.classList.add("hide");
    mainCategory.classList.add("hide");
    productDetailPage.classList.remove("hide");
    productName.value = "";
    productPrice.value = "";
    productCategory.value = "";
    productColor.value = "";
    productSize.value = "";
    document.querySelector(".product-image-preview").src = "";
}

addProductPageBtn.addEventListener("click", onShowProductDetailsPage);
