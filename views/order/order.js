import { Header } from "../public/header/header.js";

const headerRender = () => {
    return Header();
};

headerRender();

// "orderlist": [
//     {
//         "_id": "6549d50e6efbc2356c1efcd4",
//         "orderedAt": "2023-11-06T13:00:00.697Z",
//         "totalPrice": 16457547,
//         "orderedBy": "user6",
//         "phoneNumber": "010-3333-3333",
//         "address": [
//             "주소1",
//             "주소2"
//         ],
//         "products": [
//             {
//                 "product": "65491fef6b0762c9aa44acf5",
//                 "count": 7,
//                 "_id": "6549d50e6efbc2356c1efcd5"
//             }
//         ],
//         "deliveryStatus": "주문완료",
//         "__v": 0
//     },

const orderTemplate = () => {
    return`
        <div class="order_details">
            <div class="order_time_wrap details">
                <span>주문 시간</span>
                <span class="order-time">2023-11-06 19:53:00</span>
            </div>
            <div class="order_number_wrap details">
                <span>주문 번호</span>
                <span class="order-number">1231231213131313123</span>
            </div>
            <div class="order_id_wrap details">
                <span>주문 아이디</span>
                <span class="order_id">sdsfdd</span>
            </div>
            <div class="order_items_wrap details">
                <span>주문 상품</span>
                <span class="order_item">크리스마스 트리 중형 사이즈 150cm 외 3종</span>
            </div>
            <div class="order_status_wrap details">
                <span>주문 상태</span>
                <span class="order_status">주문 완료</span>
            </div>
            <ul class="order_amount_price_wrap details">
                <li>
                    <span>결제 금액</span>
                    <span class="order_price">120,000 원</span>
                </li>
                <li>
                    <span>총 상품 금액</span>
                    <span class="order_amount_price">120,000 원</span>
                </li>
                <li>
                    <span>배송비</span>
                    <span class="order_delivery_price">0 원</span>
                </li>
            </ul>
        </div>
    `;
};

const orderRender = async () => {
    try{
        const id = "6549d50e6efbc2356c1efcd4"
        const response = await fetch(`/api/orders/${id}`);
        const orderData = await response.json();
    
        console.log(orderData);
    } catch (error) {
        if (error.message === "404") {
            alert(`${error.message} 에러가 발생했습니다. 다시 시도해 주세요.`)
        }
    }
};

orderRender();