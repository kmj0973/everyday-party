export const Header = () => {
    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                // 로고
                <img class="logo" src="../public/image/logo.png" alt="로고">
                // 유저 메뉴
                <ul class="user_menu">
                    <li><a href="#">로그인</a></li>
                    <li><a href="#">회원가입</a></li>
                    <li>
                        <a href="#">
                            <iconify-icon 
                                icon="ion:bag" 
                                style="color: #181619;"
                                width="22" 
                                height="22">
                            </iconify-icon>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <nav>
            <div class="category_wrap">
                <a class="all_category_icon" href="#">
                    <iconify-icon 
                        icon="iconoir:menu" 
                        style="color: #181619;" 
                        width="24" 
                        height="24">
                    </iconify-icon>
                </a>
                // 카테고리
                <ul class="category">
                    <li id="new">신상품</li>
                    <li id="best">베스트</li>
                    <li id="clothes"><a href="#">의상</a></li>
                    <li id="props"><a href="#">소품</a></li>
                    <li id="balloons"><a href="#">풍선</a></li>
                    <li id="decorations"><a href="#">장식</a></li>
                </ul>
            </div>
        </nav>
    `;

    document.body.prepend(headerElement);
}