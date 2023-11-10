export const Header = () => {
    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                <a href=${`/main/main.html#`}>
                    <img class="logo" src="../public/image/logo.png" alt="로고">
                </a>
                <ul class="user_menu">
                    <li><a href="/login/login.html">로그인</a></li>
                    <li><a href="/auth/auth.html">회원가입</a></li>
                    <li style="padding-top:4px">
                        <a href="#">
                        <iconify-icon icon="ph:user-fill" style="color: #181619;" width="22"></iconify-icon>
                        </a>
                    </li>
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
                    <li><a class="category_link" href=${`/category/category.html#category=${"new"}`}>신상품</a></li>
                    <li><a class="category_link" href=${`/category/category.html#category=${"best"}`}>베스트</a></li>
                    <li><a class="category_link" href=${`/category/category.html#category=${"clothes"}`}>의류</a></li>
                    <li><a class="category_link" href=${`/category/category.html#category=${"props"}`}>소품</a></li>
                    <li><a class="category_link" href=${`/category/category.html#category=${"balloons"}`}>풍선</a></li>
                    <li><a class="category_link" href=${`/category/category.html#category=${"decorations"}`}>장식</a></li>
                </ul>
            </div>
        </nav>
    `;

    document.body.prepend(headerElement);
};
