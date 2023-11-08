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

const userName = 'user8';
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

  getOrderList();

//3. 해당 사용자의 구매 목록 가져오기 
async function getOrderList(){
    const ProductInfoBox = document.querySelector('.product-list-container');
    const data = await fetch('/api/orders');
    const orderList = await data.json().then((res)=>res.orderlist);

    try{
        //주문 목록에서 구매자를 기준으로 필터링, 빈 배열일경우를 대비하여 OPTIONAL CHAINING 사용
        const userOrders = orderList?.filter(({orderedBy})=>orderedBy===userName);
        ProductInfoBox.appendChild(createProductInfo(userOrders));
        //아이디를 기준으로 상품 정보 가져오기 
        

    }catch{
        
        alert('주문 목록을 불러올 수 없습니다.')
    }
    console.log(orderList);

    //아이디를 기준으로 상품 정보 가져오기 

}

async function getProductInfo(id){
    const productInfo = await fetch(`/api/orders/${id}`).then((res)=>res.json());
    console.log('dkdkdk' , productInfo);
}

function createProductInfo(orderInfo){
    const productInfoContainer = document.createElement('div');
    productInfoContainer.setAttribute('class','product-info-container');
    orderInfo.forEach((order,i)=>{
        console.log('test: ',order.products[0]._id);
        //getProductInfo(order.products[i]._id);
        getProductInfo("65487b7c4bfb67d17e8a0bbe");
        productInfoContainer.innerHTML += `
        <div class="total-num">총 ${order.products.length}건</div>
            <div class="order-date">주문일자 ${order.orderedAt}</div>
            <div class="product-info">
                <img class='product-img' src='/everyday-party/images/product/dummy/balloons.jpg'alt="이미지" >
                <div class="product-name">${order.products[i].product}</div>
                <div class="product-price">${order.products[i]._id}</div>
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

//4. 탭버튼 구현하기 
const links = document.querySelectorAll('.menu-tab-container li a');
const items = document.querySelectorAll('.menu-tab-container li');

//a 태그 기능 막기 
for (let i = 0; i < links.length; i++) {
    links[i].onclick = function(e) {
        e.preventDefault();
    }
}
//클릭한 item 은 active 클래스 추가, 아닌것은 active 클래스 제거 
for(let i=0;i<items.length;i++){
    items[i].onclick=function(){
        //items의 a 태그의 href 속성을 불러와서 어떤 탭을 선택했는지 확인
        //tab-content-container 안에 있는 .tab, .tab-list li 을 모두 불러온 후, active class를 제거
        //items에만 active 클래스 추가 
        //console.log(this);
        const tabId = this.querySelector('a').getAttribute('href');
        document.querySelectorAll('.menu-tab-container li, .tab-content-container .tab').forEach(function(item){
            item.classList.remove('active');
        })
        
        document.querySelector(tabId).classList.add('active');
        this.classList.add('active');
    }
}