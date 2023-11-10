//오더 정보 가져오기
const mainOrderList = document.querySelector(".main-order-list");

await getAllOrderData();

async function getAllOrderData() {
    try {
        const response = await fetch("/api/orders").then((result) => result.json());

        const orders = response.orderlist;
        console.log(orders);
        mainOrderList.appendChild(createOrderList(orders));
    } catch (err) {
        console.log(err);
    }
}
async function findPhoto(id) {
    //상품 사진 찾아주는 함수
    try {
        const data = await fetch(`/api/products?products=654a5b1c4b35e1a3bcf867c5`).then((result) => result.json());

        const products = data.products;
        console.log(data);
        return products[0].file.path;
    } catch (err) {
        console.log(err);
    }
}
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
            <img src="findPhoto(orders[0].products[0]._id)" />
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
        const orderId = e.target.parentElement.previousSibling.previousSibling.children[0].children[1].innerText.substr(3);
        const changedStatus = e.target.previousSibling.previousSibling.previousSibling.previousSibling.value;

        const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
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
