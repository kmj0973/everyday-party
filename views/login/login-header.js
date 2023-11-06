export const Header = () => {
    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                <img class="logo" src="../public/image/logo.png" alt="로고">
                <ul class="user_menu">
                    <li><a href="/login/login.html">로그인</a></li>
                    <li><a href="/auth/auth.html">회원가입</a></li>
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
    `;

    document.body.prepend(headerElement);
};
