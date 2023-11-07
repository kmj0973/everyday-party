// import로 헤더 렌더링
import { Header } from '../public/header/header.js';

const headerRender = () => {
  return Header();
};

headerRender();

// 로컬스토리지
/**
 로컬스토리지에 빈 cartItems 배열 만들어놓기. 혜원님key값:cart와 동일해야 하는지?-> 동일해야함.
 추후 merge 하고 난 뒤 localStorage.setItem은 필요 없으므로 삭제.
 * 
 */
// 로컬스토리지에 실제 잘 저장 되는지 test.
localStorage.setItem(
  'cart',
  JSON.stringify([
    // { _id: '6543563c88123149c933da9e', quantity: 1 },
    { id: '65491fef6b0762c9aa44acfa', quantity: 1 },
    // { _id: 2, quantity: 1 },
    { id: 1, name: '풍선', price: 1000, quantity: 1 },
  ])
);

const cartData = localStorage.getItem('cart');
// const cartItems = [
//   // { id: 1, name: '풍선', price: 1000, quantity: 1 },
//   // { id: 2, name: '의상', price: 2000, quantity: 2 },
// ];

// JSON 문자열을 객체, 배열로 변환 (로컬스토리지)
const cartItems = JSON.parse(cartData);

//---------------api test----------------------------------------
// fetch는 for문 안에서 해야함 그런데 느리니까 (3data x n개) -> 병렬로 나열 할 수 있는 Promise.all 사용해서 장바구니 상품에 표현될 데이터 콜 요청.

fetch('/api/products') // api에서 products데이터(id,상품명, 수량, 옵션) 가져오기< 백단에서 아직 개별id가 작성이 안 됨. /api/products/?products=${productId} 변경예정.
  .then((response) => response.json())
  .then((data) => {
    console.log(data); //데이터 불러온 것 확인완료
    const product = data.products.find(
      ({ _id }) => _id === '654a60f195cd6f5052eaad13'
    );
    console.log(product);
  });

// promise.all 사용 test
// 상품id 가져오기.
const promiseId = fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productId = data.products[0]._id;
    console.log(productId); // [0]의 _id
  });
// 상품명 가져오기
const promiseName = fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productName = data.products[0].name;
    console.log(productName); // [0]의 name
  });
// 상품단가 가져오기
const promisePrice = fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productPrice = data.products[0].price;
    console.log(productPrice); // [0]의 price
  });
//상품옵션 가져오기 < 컬러 사이즈 둘다..?
const promiseOption = fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productOption = data.products[0].option;
    console.log(productOption); // [0]의 option
  });
//상품수량 가져오기
const promiseQuantity = fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    const productQuantity = data.products[0].quantity;
    console.log(productQuantity); // [0]의 quantity
  });

Promise.all([promiseId, promiseName, promisePrice, promiseQuantity]).then(
  console.log
);

//----------------api test----------------------------------------

// 1. 장바구니에 담겨온 상품이 표현되는 부분
// id값을 기준으로 상품이 담겨오는 함수
function addToCart(id, name, price, quantity) {
  const productInCartIndex = cartItems.findIndex((item) => item.id === id);

  if (productInCartIndex !== -1) {
    // 담아온 상품이 장바구니에 이미 존재한다면,
    cartItems[productInCartIndex].quantity += quantity; // 해당제품 수량만 증가
  } else {
    cartItems.push({ id, name, price, quantity }); // 장바구니에 없는 상품이면 상품을 장바구니에 추가
  }

  updateCart();
}

// id값을 기준으로 상품을 제거하는 함수
function removeFromCart(id) {
  const productInCartIndex = cartItems.findIndex((item) => item.id === id);

  if (productInCartIndex !== -1) {
    if (cartItems[productInCartIndex].quantity > 1) {
      cartItems[productInCartIndex].quantity -= 1;
    } else {
    }
  }

  cartItems.splice(productInCartIndex, 1); // 추가된 상품 삭제
  updateCart();
}

function updateCart() {
  const itemsList = document.getElementById('items_list');
  itemsList.innerHTML = ''; // 리스트 비우기

  // 담아온 상품정보 생성 함수
  cartItems.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'itemDiv');
    itemsList.appendChild(itemDiv);

    // 체크박스 생성
    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('class', 'checkboxInput');
    checkboxInput.setAttribute('checked', true);
    itemDiv.appendChild(checkboxInput);

    // 상품명
    const itemName = document.createElement('p');
    itemName.setAttribute('class', 'itemName');
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    // 상품가격
    const itemPrice = document.createElement('p');
    itemPrice.setAttribute('class', 'itemPrice');
    itemPrice.textContent = item.price + '원';
    itemDiv.appendChild(itemPrice);

    //상품명+상품가격
    const itemNamePrice = document.createElement('div');
    itemNamePrice.setAttribute('id', 'itemNamePrice');
    itemNamePrice.append(itemName, itemPrice);
    itemDiv.appendChild(itemNamePrice);

    // 수량 감소 버튼
    const minusButton = document.createElement('button');
    minusButton.setAttribute('class', 'minusButton');
    minusButton.textContent = '-';
    minusButton.onclick = function () {
      if (item.quantity > 1) {
        item.quantity--;
        itemQuantity.textContent = item.quantity;
        //총 상품금액을 뿌려주는 함수 호출
        calculateTotalPrice();
        renderTotal();
        console.log(cartItems);
      }
    };
    itemDiv.appendChild(minusButton);

    //상품수량
    const itemQuantity = document.createElement('p');
    itemQuantity.setAttribute('class', 'itemQuantity');
    itemQuantity.textContent = item.quantity;
    itemDiv.appendChild(itemQuantity);

    // 수량 증가 버튼
    const plusButton = document.createElement('button');
    plusButton.setAttribute('class', 'plusButton');
    plusButton.textContent = '+';
    plusButton.onclick = function () {
      item.quantity++;
      itemQuantity.textContent = item.quantity;
      calculateTotalPrice();
      renderTotal();
    };
    itemDiv.appendChild(plusButton);

    //수량조절버튼
    const quantityButtons = document.createElement('div');
    quantityButtons.setAttribute('class', 'quantityButtons');
    quantityButtons.append(minusButton, itemQuantity, plusButton);
    itemDiv.appendChild(quantityButtons);

    // 휴지통 생성
    const removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'removeButton');
    removeButton.textContent = '';
    removeButton.onclick = function () {
      removeFromCart(item.id);
      itemDiv.remove();
    };
    itemDiv.appendChild(removeButton);
  });

  // 2. 결제 정보를 나타내는 부분

  // renderTotal();

  function renderTotal() {
    const totalPrice = document.querySelector('.total_price');
    totalPrice.textContent = `총 상품금액: ${calculateTotalPrice().toLocaleString()} 원`;
    // 총 상품금액
    const totalDiv = document.createElement('div');
    totalDiv.setAttribute('class', 'totalDiv');
    itemsList.appendChild(totalDiv);

    // // 배송비 FIXME: 상품금액이 0원이어도 3000으로 표기됨

    // const shippingFee = totalPrice === 0 ? 0 : 3000;
    // const shippingFeeNumber = document.querySelector('.shipping_fee_number');
    // shippingFeeNumber.textContent = `: ${shippingFee} 원`;

    // 총 결제금액
    const sumPriceHelper = document.querySelector('.sum_price_helper');
    sumPriceHelper.textContent = `${sumPrice().toLocaleString()} 원`;
  }
  renderTotal();
}
// 총 상품금액 계산 함수
function calculateTotalPrice() {
  console.log('총 상품금액 확인:', cartItems);
  let price = 0;
  cartItems.forEach((item) => {
    price += item.price * item.quantity;
  });
  console.log('총 상품금액 계산이후:', cartItems);
  return price.toLocaleString(); // 3자리 마다 , 삽입
}

//  총상품가격
const total = calculateTotalPrice();

//총 결제금액 계산 함수
function sumPrice() {
  return calculateTotalPrice();
}

//3. 상품 구매를 나타내는 부분
//전체상품 구매 함수

function allOrder() {
  if (cartItems.length >= 1) {
    alert('주문완료!');
  } else if (cartItems.length < 1) {
    alert('상품을 담아주세요!');
  }
}

// 전체상품 구매 이벤트리스너
const allOrderButton = document.querySelector('.all_order_button');
allOrderButton.addEventListener('click', allOrder);

//전체상품 삭제 함수
function removeAllItems() {
  cartItems.length = 0; //장바구니비우기
  updateCart();
}

//전체상품 삭제 이벤트리스너
const deleteAllButton = document.querySelector('.delete_all_button');
deleteAllButton.addEventListener('click', removeAllItems);

//선택상품 삭제 함수
function removeCheckedItems() {
  const checkboxes = document.querySelectorAll('.checkboxInput');
  const itemsToRemove = [];

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      itemsToRemove.push(cartItems[index].id);
    }
  });

  itemsToRemove.forEach((id) => {
    removeFromCart(id);
  });
}

// 선택상품 삭제 이벤트리스너
const deleteCheckedButton = document.querySelector('.delete_checked_button');
deleteCheckedButton.addEventListener('click', removeCheckedItems);

//선택상품 구매 함수
function selectedOrder() {
  const checkboxes = document.querySelectorAll('.checkboxInput');
  const selectedItems = [];

  let isChecked = false; //플래그 변수
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      isChecked = true;
    }
  });

  if (isChecked) {
    alert('주문 완료!');
  } else {
    alert('선택된 상품이 없습니다!');
  }
}

// 선택상품 구매 이벤트리스너
const selectedOrderButton = document.querySelector('.selected_order_button');
selectedOrderButton.addEventListener('click', selectedOrder);

updateCart(); // 상품을 담을 때 외부에 전달해주는 함수. export.

// addToCart(1, '파티풍선', 5000, 2); //test
// addToCart(2, '코스튬', 7000, 1); //test
