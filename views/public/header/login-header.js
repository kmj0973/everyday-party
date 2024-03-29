export const Header = () => {
    const token = localStorage.getItem("access-token");
    const grade = localStorage.getItem("grade");
    const userName = localStorage.getItem("name");

    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                <a href="/main/main.html"><img class="logo" src="../public/image/logo.png" alt="로고"></a>
                <ul class="user_menu">
                ${
                    !token
                        ? `<li><a href="/login/login.html">로그인</a></li>
                <li><a href="/auth/auth.html">회원가입</a></li>`
                        : `<li>${userName} 님</li>`
                }
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
    `;

    document.body.prepend(headerElement);
};
