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
    { id: 1, name: '풍선', price: 2000, quantity: 1 },
    { id: 2, name: '의상1', price: 2000, quantity: 1 },
    { id: 3, name: '의상2', price: 2000, quantity: 1 },
    { id: 4, name: '의상3', price: 1000, quantity: 1 },
  ])
);

const cartData = localStorage.getItem('cart');
// const cartItems = [
//   // { id: 1, name: '풍선', price: 1000, quantity: 1 },
//   // { id: 2, name: '의상', price: 2000, quantity: 2 },
// ];

// JSON 문자열을 객체, 배열로 변환
const cartItems = JSON.parse(cartData);

//-----------------------------------------------------------------------

// 1. 장바구니에 담겨온 상품이 표현되는 부분
// id값을 기준으로 상품이 담겨오는 함수
function addToCart(id, name, price, quantity) {
  const productInCartIndex = cartItems.findIndex((item) => item.id === id);

  if (productInCartIndex !== -1) {
    // 담아온 상품이 장바구니에 이미 존재한다면,
    cartItems[productInCartIndex].quantity += quantity; // 해당제품 수량만 증가
  } else {
    cartItems.push({ id, name, price, quantity }); // 새 상품을 장바구니에 추가
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
    itemName.textContent = item.name;
    itemDiv.appendChild(itemName);

    // 상품가격
    const itemPrice = document.createElement('p');
    itemPrice.textContent = item.price + '원';
    itemDiv.appendChild(itemPrice);

    // 수량 감소 버튼
    const minusButton = document.createElement('button');
    minusButton.setAttribute('class', 'minusButton');
    minusButton.textContent = '-';
    minusButton.onclick = function () {
      if (item.quantity > 1) {
        item.quantity--;
        itemQuantity.textContent = item.quantity + '개';
        //총 상품금액을 뿌려주는 함수 호출
        calculateTotalPrice();
        renderTotal();
        console.log(cartItems);
      }
    };
    itemDiv.appendChild(minusButton);

    //상품수량
    const itemQuantity = document.createElement('p');
    itemQuantity.textContent = item.quantity + '개';
    itemDiv.appendChild(itemQuantity);

    // 수량 증가 버튼
    const plusButton = document.createElement('button');
    plusButton.setAttribute('class', 'plusButton');
    plusButton.textContent = '+';
    plusButton.onclick = function () {
      item.quantity++;
      itemQuantity.textContent = item.quantity + '개';
      calculateTotalPrice();
      renderTotal();
    };
    itemDiv.appendChild(plusButton);

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
    totalPrice.textContent = `총 상품금액: ${calculateTotalPrice()} 원`;
    // 총 상품금액
    const totalDiv = document.createElement('div');
    totalDiv.setAttribute('class', 'totalDiv');
    itemsList.appendChild(totalDiv);

    // //총 상품금액
    // const totalPrice = document.querySelector('.total_price');
    // totalPrice.textContent = `총 상품금액: ${calculateTotalPrice()} 원`;

    // // 배송비 FIXME: 상품금액이 0원이어도 3000으로 표기됨
    // const shippingFee = totalPrice === 0 ? 0 : 3000;
    // const shippingFeeNumber = document.querySelector('.shipping_fee_number');
    // shippingFeeNumber.textContent = `: ${shippingFee} 원`;

    // 총 결제금액
    const sumPriceHelper = document.querySelector('.sum_price_helper');
    sumPriceHelper.textContent = `${sumPrice()} 원`;
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
  return price;
}

//  총상품가격
const total = calculateTotalPrice();

//총 결제금액 계산 함수
function sumPrice() {
  return calculateTotalPrice() + 3000;
}

//3. 상품 구매를 나타내는 부분
//전체상품 구매 함수

function allOrder() {
  if (cartItems.length >= 1);
  {
    alert('주문완료!');
  }
}

// 전체상품 구매 이벤트리스너
const allOrderButton = document.querySelector('.all_order_button');
allOrderButton.addEventListener('click', allOrder);

//전체상품 삭제 함수
function removeAllItems() {
  cartItems.length = 0; // 장바구니비우기
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
  }
}

// 선택상품 구매 이벤트리스너
const selectedOrderButton = document.querySelector('.selected_order_button');
selectedOrderButton.addEventListener('click', selectedOrder);

updateCart(); // 상품을 담을 때 외부에 전달해주는 함수. export.

// addToCart(1, '파티풍선', 5000, 2); //test
// addToCart(2, '코스튬', 7000, 1); //test
