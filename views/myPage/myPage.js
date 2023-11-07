//1. 헤더 렌더링

import { Header } from '../public/header/header.js';
// import로 헤더 렌더링
const headerRender = () => {
    return Header();
}

headerRender();

//2. 사용자 정보 가져오기 
//로그인시 생성되는 토큰값을 로컬스토리지에서 꺼내온다. 
//토큰 없을 경우 (실행x) 예외처리 (페이지 이동 )

const userName = 'user6';
/**
 * const token = localStorage.getItem('token'); -> 여기서 예외처리해줘야함 
 * getUserInfo 함수를 만들고 그 함수의 실행 조건을 토큰 유무로 ! ! async await + try, catch 로 fetch 감싸주기 

fetch('/api/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('사용자 정보를 가져오지 못함:', error);
  });
 */

  /**
   * 하나 더 하면 좋은 것 
   */

//3. 해당 사용자의 구매 목록 가져오기 
const ProductInfoBox = document.querySelector('.product-list-container');

fetch('/api/orders')
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data);
    //orderlist가 빈 배열일 경우 => optional chaining : 물음표 
    const orderInfo = data.orderlist?.filter(({orderedBy})=>orderedBy===userName);
    console.log(orderInfo);
    ProductInfoBox.appendChild(createProductInfo(orderInfo));
  })
  .catch((error)=> alert('주문목록을 불러올 수 없습니다.')) //catch에 콘솔찍는건 의미없음 (사용자)

function createProductInfo(orderInfo){
    const productInfoContainer = document.createElement('div');
    productInfoContainer.setAttribute('class','product-info-container');
    orderInfo.forEach((order)=>{
        productInfoContainer.innerHTML += `
        <div class="total-num">총 ${order.products.length}건</div>
            <div class="order-date">주문일자 ${order.orderedAt}</div>
            <div class="product-info">
                <img class='product-img' src='/everyday-party/images/product/dummy/balloons.jpg'alt="이미지" >
                <div class="product-name">${order.products.product}</div>
                <div class="product-price">${order.products._id}</div>
                <div class="btn-container">
                    <div>${order.deliveryStatus}</div>
                    <div>리뷰쓰기</div>
                </div>
            </div>
            <div class="show-all">
                <div>총 ${Number(order.totalPrice).toLocaleString()}원 주문 전체보기</div>
            </div>
        </div>
        `
    })
    
    
    return productInfoContainer;
}