export const Header = () => {
    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                <img class="logo" src="../public/image/logo.png" alt="로고">
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
                <ul class="category">
                    <li><a href="new" id="new">신상품</a></li>
                    <li><a href="best" id="best">베스트</a></li>
                    <li><a href="clothes" id="clothes">의류</a></li>
                    <li><a href="props" id="props">소품</a></li>
                    <li><a href="balloons" id="balloons">풍선</a></li>
                    <li><a href="decorations" id="decorations">장식</a></li>
                </ul>
            </div>
        </nav>
    `;

    document.body.prepend(headerElement);
}

