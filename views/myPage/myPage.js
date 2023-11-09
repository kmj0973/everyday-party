//넘겨주는 부분 처리 
// 내 정보수정하기 -> 인풋창으로 바꾸고 put으로 요청만 하면 됨 

//1. 헤더 렌더링

import { Header } from '../public/header/header.js';

const headerRender = () => {
    return Header();
}

headerRender();

//2. 사용자 정보 가져오기 
//로그인시 생성되는 토큰값을 로컬스토리지에서 꺼내온다. 
//토큰 없을 경우 (실행x) 예외처리 (페이지 이동 )
//토큰 있을 경우 getUserInfo 함수 실행
//! 테스트 token
//let token = localStorage.getItem('token'); 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0MSIsImdyYWRlIjoidXNlciIsImlhdCI6MTY5OTQyNzQ5MSwiZXhwIjoxNjk5NDI4OTkxfQ.9fSXsE-wQZrKH_-HIuOrP-b74tAQ4lO9gOZSyeedwWE'

pageRender();

async function pageRender(){
    
    const profileUserName = document.querySelector('.profile-userName');
    const profileUserID = document.querySelector('.profile-userID');
    
    if(token === null){
        alert('접근불가. 로그인하세요')
    }else{
        console.log('정상접근');
        getUserInfo()
            .then(userData=>{
                console.log('유저 데이터',userData);
                profileUserName.innerHTML = userData.user.name;
                profileUserID.innerHTML = userData.user.userId
                //주문내역 뿌려주기
                getOrderList('test001'); //인자로 사용자 이름을 보내주는 방식 getOrderList(userData.user.name)
    
            })
            .catch(error=>{
                console.log(error);
                alert('유저 정보를 가져오지 못함');
            })
    }
}

 async function getUserInfo(){
    const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      try{
          const userData = await response.json();
          return userData;
      }catch(error){
        console.log(error);
      }
 }

 

  /**
   * 하나 더 하면 좋은 것 
   */

 

//3. 해당 사용자의 구매 목록 가져오기 
async function getOrderList(userName){
    const ProductInfoBox = document.querySelector('.product-list-container');
    const data = await fetch('/api/orders');
    const orderList = await data.json().then((res)=>res.orderlist);
    //console.log('orderlist ',orderList);

    try{
        //주문 목록에서 구매자를 기준으로 필터링, 빈 배열일경우를 대비하여 OPTIONAL CHAINING 사용
        const userOrders = orderList?.filter(({orderedBy})=>orderedBy===userName);
        console.log('userOrders' , userOrders);
        ProductInfoBox.appendChild(createProductInfo(userOrders));        

    }catch{
        alert('주문 목록을 불러올 수 없습니다.')
    }

}

//4. id를 기준으로 상품 정보 가져오기 
async function getProductInfo(id){
    const productInfo = await fetch(`/api/products?products=${id}`).then((res)=>res.json());
    //console.log('dkdkdk' , productInfo);
    return productInfo;
}

//5. 사용자의 날짜별 구매 목록 렌더링하기
//!로케일스트링 통일하기 (가격)
function createProductInfo(orderInfo){
    const productInfoContainer = document.createElement('div');
    productInfoContainer.setAttribute('class','product-info-container');
    
    // Promise.all(orderInfo)
    //     .then((productInfo)=>getProductInfo('654a60f195cd6f5052eaad13'))
    //     .then(productData=>{
    //         console.log('상품데이터 확인',productData.products[0]);
    //             productInfoContainer.innerHTML += `
    //             <div class="total-num">총 ${order.products.length}건</div>
    //                 <div class="order-date">주문일자 ${order.orderedAt}</div>
    //                 <div class="product-info">
    //                     <img class='product-img' src='${productData.products[0].file.path}' >
    //                     <div class="product-name">${productData.products[0].name}</div>
    //                     <div class="product-price">${productData.products[0].price}</div>
    //                     <div class="btn-container">
    //                         <div>${order.deliveryStatus}</div>
    //                         <div>리뷰쓰기</div>
    //                     </div>
    //                 </div>
    //                 <div class="show-all">
    //                     <div>총 ${Number(order.totalPrice).toLocaleString()}원 주문 전체보기</div>
    //                 </div>
    //             </div>
    //             `
    //     })
    //? 프로미스를 반환하는 함수는 getProductInfo 아닌가요? promise.all을 어떻게 써야할지 모르겠다 
    orderInfo.forEach((order,i)=>{
        //! 9일 오피스아워 (promise all 사용해서 한번에처리)
        getProductInfo("654a60f195cd6f5052eaad13")
            .then(productData=>{
                console.log('상품데이터 확인',productData.products[0]);
                productInfoContainer.innerHTML += `
                <div class="total-num">총 ${order.products.length}건</div>
                    <div class="order-date">주문일자 ${order.orderedAt}</div>
                    <div class="product-info">
                        <img class='product-img' src='${productData.products[0].file.path}' >
                        <div class="product-name">${productData.products[0].name}</div>
                        <div class="product-price">${Number(productData.products[0].price).toLocaleString()}</div>
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
            .catch(error=>console.log('상품데이터 반환 불가'));
        //getProductInfo('654a60f195cd6f5052eaad12'); order.products[0]._id
        
    })
    
    
    return productInfoContainer;
}

//6. 탭버튼 구현하기 
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

showUserInfo();
//7. 정보 수정 페이지 -> 유저 정보 불러오기 
const getUserId = document.querySelector('.userID');
const getUserName = document.querySelector('.userName')
const getUserNumber = document.querySelector('.userNumber');
const getUserAddress = document.querySelector('.userAdress');
const getUserPassword = document.querySelector('.userPw');

async function showUserInfo(){

    getUserInfo()
        .then(userData=>{
            console.log('유저 데이터 확인' ,userData);
            getUserId.innerHTML = userData.user.userId;
            getUserName.innerHTML = userData.user.name;
            getUserNumber.innerHTML = userData.user.phone;
            getUserAddress.innerHTML = userData.user.address[0];
        })
        .catch(error=>{
            console.log(error);
            alert('유저 데이터를 들고올 수 없습니다.')
        })
    
    //8. 수정하기 버튼 클릭시 input창 활성화 
}

let BtnClicked = false;

const modifyBtn = document.querySelector('.modify-btn');

modifyBtn.addEventListener('click',()=>{
    if(!BtnClicked){
        const values = {
            id: getUserId.textContent,
            name: getUserName.textContent,
            phone: getUserNumber.textContent,
            password : '새로운 비밀번호를 입력하세요',
            address: getUserAddress.textContent
        };
    
        for (const key in values) {
                //인풋 요소 생성 + 타입 : text, class이름 지정 
            const inputElement = document.createElement('input');
            inputElement.setAttribute('type', 'text');
            inputElement.setAttribute('class', 'modify-input-box modify-'+key);
            inputElement.value = values[key];
            
            //부모요소에 append Child 해주기 
            const parentElement = document.querySelector('.' + key + '-box');
            parentElement.appendChild(inputElement);
            
            //인풋 창 안에 기존 값 넣어주기, 이전 div는 지워주기 
            getUserId.style.display = 'none';
            getUserName.style.display = 'none';
            getUserNumber.style.display = 'none';
            getUserAddress.style.display = 'none';
            getUserPassword.style.display = 'none';
        }
    
        modifyBtn.innerText = '저장하기'
        modifyBtn.style.backgroundColor = '#F9E103'; 
        BtnClicked = true;
    }else{
        console.log('저장되었습니다');
        //input value 가져오기 

        //getUser -- 에 innerHTML 로 바뀐 value 집어넣기 

        // 기존 input 창은 삭제하기 
        // 입력 값 가져오기
        const updatedValues = {
            id: document.querySelector('.modify-id').value,
            name: document.querySelector('.modify-name').value,
            phone: document.querySelector('.modify-phone').value,
            address: document.querySelector('.modify-address').value
            // 비밀번호는 따로 처리 필요
        };

        // 수정된 값을 div에 집어넣기
        for (const key in updatedValues) {
            const divElement = document.querySelector('.' + key + '-box .info-content');
            divElement.textContent = updatedValues[key];
            divElement.style.display='none';
        }

        // 입력 요소 삭제 및 div 요소 화면에 보이도록 설정
        document.querySelectorAll('.modify-input-box').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.info-content').forEach(element => {
            element.style.display = 'block';
        });

        

        modifyBtn.innerText = '수정하기';
        modifyBtn.style.backgroundColor = '#FCEDC4';
        BtnClicked = false;
    }
    
   

    
})

