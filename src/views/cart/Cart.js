const cartItems = [
  // { id: 1, name: '풍선', price: 1000, quantity: 1 },
  // { id: 2, name: '의상', price: 2000, quantity: 2 },
];

// id값으로 상품이 담겨오는 함수
function addToCart(id, name, price, quantity) {
  const productInCartIndex = cartItems.findIndex((item) => item.id === id);

  if (productInCartIndex !== -1) {
    cartItems[productInCartIndex].quantity += quantity;
  } else {
    cartItems.push({ id, name, price, quantity }); // 새 상품을 장바구니에 추가
  }

  updateCart();
}

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
// 아이템 생성
function updateCart() {
  const itemsList = document.getElementById('items_list');
  itemsList.innerHTML = ''; // 리스트 비우기

  //   체크박스 생성

  cartItems.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'itemDiv');

    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.setAttribute('class', 'checkboxInput');
    checkboxInput.setAttribute('checked', true);

    itemDiv.textContent = `${item.name}  ${item.price}  ${item.quantity}`;

    // 휴지통 생성
    const removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'removeButton');
    removeButton.textContent = '삭제';
    removeButton.onclick = function () {
      removeFromCart(item.id);
    };

    itemDiv.appendChild(checkboxInput);
    itemsList.appendChild(itemDiv);
    itemDiv.appendChild(removeButton);
  });

  // 총 상품금액
  const totalDiv = document.createElement('div');
  totalDiv.setAttribute('class', 'totalDiv');
  //   totalDiv.textContent = `총 상품금액: ${calculateTotalPrice()} 원`;
  itemsList.appendChild(totalDiv);
}

// 총 상품 가격

function calculateTotalPrice() {
  let totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
}

// const totalPriceNumber = document.querySelector('total_price_number');
// const totalPrice = calculateTotalPrice();
// totalPriceNumber.textContent = totalPrice;

updateCart(); // 상품을 담을 때 외부에 전달해주는 함수. export.

addToCart(4, '파티풍선', 4000, 1); //test
addToCart(2, '코스튬', 3000, 1); //test
addToCart(1, '안경', 1000, 1); //test
addToCart(3, '모자', 5000, 1); //test
