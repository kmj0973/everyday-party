const cartItems = [
  // { id: 1, name: '풍선', price: 1000, quantity: 1 },
  // { id: 2, name: '의상', price: 2000, quantity: 2 },
];

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

  cartItems.splice(productInCartIndex, 1);
  updateCart();
}

function updateCart() {
  const itemsList = document.getElementById('items_list');
  itemsList.innerHTML = ''; // 리스트 비우기

  // 담아온 상품정보 생성 함수
  cartItems.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'itemDiv');
    itemDiv.textContent = `${item.name}  ${item.price}원  ${item.quantity}개`;

    // 체크박스 생성
    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('class', 'checkboxInput');
    checkboxInput.setAttribute('checked', true);
    itemDiv.appendChild(checkboxInput);

    // 휴지통 생성
    const removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'removeButton');
    removeButton.textContent = '삭제';
    removeButton.onclick = function () {
      removeFromCart(item.id);
    };

    itemsList.appendChild(itemDiv);
    itemDiv.appendChild(removeButton);
  });

  // 2. 결제 정보를 나타내는 부분
  // 총 상품금액
  const totalDiv = document.createElement('div');
  totalDiv.setAttribute('class', 'totalDiv');
  itemsList.appendChild(totalDiv);

  //총 상품금액
  const totalPrice = document.querySelector('.total_price');
  totalPrice.textContent = `총 상품금액: ${calculateTotalPrice()} 원`;

  // // 배송비 FIXME: 상품금액이 0원이어도 3000으로 표기됨
  // const shippingFee = totalPrice === 0 ? 0 : 3000;
  // const shippingFeeNumber = document.querySelector('.shipping_fee_number');
  // shippingFeeNumber.textContent = `: ${shippingFee} 원`;

  // 총 결제금액
  const sumPriceHelper = document.querySelector('.sum_price_helper');
  sumPriceHelper.textContent = `${sumPrice()} 원`;
}

// 총 상품금액 계산 함수
function calculateTotalPrice() {
  let price = 0;
  cartItems.forEach((item) => {
    price += item.price * item.quantity;
  });
  return price;
}

//  총상품가격
const total = calculateTotalPrice();

//총 결제금액 계산 함수
function sumPrice() {
  return calculateTotalPrice() + 3000;
}

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

updateCart(); // 상품을 담을 때 외부에 전달해주는 함수. export.

addToCart(4, '파티풍선', 4000, 1); //test
addToCart(2, '코스튬', 3000, 1); //test
addToCart(1, '안경', 1000, 1); //test
addToCart(3, '모자', 2000, 1); //test
addToCart(5, '가발', 10000, 1); //test
