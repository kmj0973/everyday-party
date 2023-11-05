//1. 개수선택 카운트 업,다운 구현하기 
//+,- 버튼과 number input을 가져와서 onclick했을때 num value값 바꿔주기
const plusBtn = document.querySelector('#up');
const minusBtn = document.querySelector('#down');
const numInput = document.querySelector('.number-select input');

plusBtn.onclick = function(){
    //console.log('+ clicked');
    numInput.value++; 
}
minusBtn.onclick=function(){
    if(numInput.value<=1){
        numInput.value==0;
    }else{
        numInput.value--;
    }
    
}

//2. 탭버튼 구현하기 
var links = document.querySelectorAll('.tab-list li a');
var items = document.querySelectorAll('.tab-list li');

//a 태그 기능 막기 
for (var i = 0; i < links.length; i++) {
    links[i].onclick = function(e) {
        e.preventDefault();
    }
}
//클릭한 item 은 active 클래스 추가, 아닌것은 active 클래스 제거 
for(var i=0;i<items.length;i++){
    items[i].onclick=function(){
        //items의 a 태그의 href 속성을 불러와서 어떤 탭을 선택했는지 확인
        //tab-content-container 안에 있는 .tab, .tab-list li 을 모두 불러온 후, active class를 제거
        //items에만 active 클래스 추가 
        //console.log(this);
        const tabId = this.querySelector('a').getAttribute('href');
        document.querySelectorAll('.tab-list li, .tab-content-container .tab').forEach(function(item){
            item.classList.remove('active');
        })
        
        document.querySelector(tabId).classList.add('active');
        this.classList.add('active');
    }
}

//3. 데이터 가져오기
//3-1. 쿼리스트링 속의 id값 받아오기 
/**
 * ! 백엔드 API 개발 완료되었을 때 이부분 수정 
 * ! 상품 목록 페이지 개발자 분과 id 전달 방식 논의
 * const nowUrl = location.href;
 * const productId = nowUrl.split('?id=');
 * 키값이 하나가 아닐 수도 있음 => 그럴땐 어떻게 ?? 
 * => URLSearchParams (key,value값으로 뽑아줌, 여기에 location.href를 보내주면 객체 형태로 현재 쿼리 스트링으로 날라온 키,value값을 뽑아줌)
 */


//받아온 아이디를 기준으로 products 배열에서 객체를 찾음, 그리고 name, price 등등 조회하기 

const productName = document.querySelector('.product-name');
const productPrice = document.querySelector('.product-price');
const productDescription = document.querySelector('.product-description');
const productId = "6543563c88123149c933da9e";
//
//api 호출하여 이름, 가격, 상품 설명을 보여준다. 
fetch(`/api/products/?products?id=${productId}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const product = data.products.find(({_id})=>_id===productId);
        //console.log(product.price);
        productName.innerHTML = product.name;
        productPrice.innerHTML = product.price;
        productDescription.innerHTML = product.description;

    })
    .catch((error) => console.error(error));


//4. 장바구니,구매하기 버튼 클릭했을 때 로컬스토리지에 개수,옵션값 저장
//!! 저장방식 수정 -> 동훈님과 논의 : id, name, price, num, option 값을 객체 형식으로 local storage에 저장 (api호출 안하는걸로 결정)
const productQuantity = document.querySelector('#productNumber');
const cartBtn = document.querySelector('.cart');
const option = document.querySelector('.option-select');
const buyBtn = document.querySelector('.buy');
let selectedOption = '';
let selectedQuantity = '';
//로컬스토리지에 빈 cart 배열 하나 만들어놓기 
localStorage.setItem('cart',JSON.stringify([]));

//카트 추가하는 함수
function addCartItem(selectedOption,selectedQuantity){
    //원래방식대로라면 prooductInfo에는 id, option, quantity만 넣는방식 추천 
    const productInfo = {id:productId,name:productName.innerHTML,price:productPrice.innerHTML,quantity:selectedQuantity,option:selectedOption};
    //카트 배열 가져오기 -> string 형태의 prevCart를 배열로 변환 
    const previousCart = JSON.parse(localStorage.getItem('cart'));
    previousCart.push(productInfo);
    localStorage.setItem('cart',JSON.stringify(previousCart));

}

cartBtn.addEventListener('click',()=>{
    
    selectedOption = option.options[option.selectedIndex].value;
    selectedQuantity = productQuantity.value;
    
    console.log(`옵션 : ${selectedOption}, 개수 : ${selectedQuantity}`);
    addCartItem(selectedOption,selectedQuantity);
})

//5. 구매하기 버튼 눌렀을 때 

buyBtn.addEventListener('click',()=>{
    
    selectedOption = option.options[option.selectedIndex].value;
    selectedQuantity = productQuantity.value;
    console.log(`옵션 : ${selectedOption}, 개수 : ${selectedQuantity}`);
    addCartItem(selectedOption,selectedQuantity);
})