//1. 개수선택 카운트 업,다운 구현하기 

//+,- 버튼과 number input을 가져와서 onclick했을때 num value값 바꿔주기
const plusBtn = document.querySelector('#up');
const minusBtn = document.querySelector('#down');
const numInput = document.querySelector('.number-select input');

console.log(plusBtn,minusBtn,numInput.value);
plusBtn.onclick = function(){
    console.log('+ clicked');
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
        console.log(this);
        const tabId = this.querySelector('a').getAttribute('href');
        document.querySelectorAll('.tab-list li, .tab-content-container .tab').forEach(function(item){
            item.classList.remove('active');
        })
        
        document.querySelector(tabId).classList.add('active');
        this.classList.add('active');
    }
}