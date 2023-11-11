import { Header } from "../public/header/header.js";

const headerRender = () => {
    return Header();
};

headerRender();

// 주문 상세 템플릿
const orderTemplate = (latestOrderData) => {

    // 날짜, 시간 조합
    const fullOrderedAt = latestOrderData[0].orderedAt;
    const getYearMonthDate = fullOrderedAt.substr(0, 10);
    const getHour = fullOrderedAt.substr(11, 2);
    const getMinutes = fullOrderedAt.substr(14, 2);
    const getSeconds = fullOrderedAt.substr(17, 2);
    const getAllDate = `${getYearMonthDate} ${getHour}:${getMinutes}:${getSeconds}`;
    // 주문 정보
    const orderId = latestOrderData[0]._id;
    const orderedById = latestOrderData[0].orderedBy;
    const productName = latestOrderData[0].products[0].name;
    const deliveryStatus = latestOrderData[0].deliveryStatus;
    // 가격 정보
    const deliveryPrice = 3000;
    const amountProductPrice = latestOrderData[0].totalPrice.toLocaleString();
    const amountOfPayment = (latestOrderData[0].totalPrice + deliveryPrice).toLocaleString();
    
    return`
        <div class="order_time_wrap details">
            <span>주문 시간</span>
            <span class="order-time">${getAllDate}</span>
        </div>
        <div class="order_number_wrap details">
            <span>주문 아이디</span>
            <span class="order-number">${orderId}</span>
        </div>
        <div class="order_id_wrap details">
            <span>주문자 아이디</span>
            <span class="order_id">${orderedById}</span>
        </div>
        <div class="order_items_wrap details">
            <span>주문 상품</span>
            <span class="order_item">${productName}</span>
        </div>
        <div class="order_status_wrap details">
            <span>주문 상태</span>
            <span class="order_status">${deliveryStatus}</span>
        </div>
        <ul class="order_amount_price_wrap details">
            <li>
                <span>결제 금액</span>
                <span class="order_price">${amountOfPayment} 원</span>
            </li>
            <li>
                <span>총 상품 금액</span>
                <span class="order_amount_price">${amountProductPrice} 원</span>
            </li>
            <li>
                <span>배송비</span>
                <span class="order_delivery_price">3,000 원</span>
            </li>
        </ul>
    `;
};

const orderRender = async () => {
    try{
        // 모든 주문 목록을 보여주는 api 
        const response = await fetch(`/api/orders`);
        const orderData = await response.json();
        const orderList = orderData.orderlist;

        // 배열에서 가장 마지막 값이 최근 주문이기 때문에
        // slice로 마지막 주문 하나만 가져옴
        const latestOrderData = orderList.slice(-1);

        // 태그에 템플릿 넣기
        document.querySelector(".order_details").innerHTML = 
            orderTemplate(latestOrderData);

    } catch (error) {
        if (error.message === "404") {
            alert(`${error.message} 에러가 발생했습니다. 다시 시도해 주세요.`)
        }
    }
};

orderRender();