export const Header = () => {
    const token = localStorage.getItem("access-token");
    const grade = localStorage.getItem("grade");
    const userName = localStorage.getItem("name");

    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
        <div class="top_menu_wrap">
            <div class="top_menu">
                <a href=${`/main/main.html#`}>
                    <img class="logo" src="../public/image/logo.png" alt="로고">
                </a>
                <ul class="user_menu">
                    
                ${
                    !token
                        ? `<li><a href="/login/login.html">로그인</a></li>
                <li><a href="/auth/auth.html">회원가입</a></li>`
                        : `<li class="logout-btn" style="margin-top:5px"><iconify-icon icon="ic:baseline-logout" width="22" height="22"></iconify-icon></li><li>${
                              userName ? userName : "사용자"
                          } 님</li>`
                }
                    <li style="padding-top:4px">
                        ${token ? `<a href="${grade != `admin` ? `/myPage` : `/admin/admin.html`}">` : `<a href="#">`}
                        <iconify-icon icon="ph:user-fill" style="color: #181619;" width="22"></iconify-icon>
                        </a>
                    </li>
                    <li>
                        <a href="/cart">
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

    if (token) {
        const logoutBtn = document.querySelector(".logout-btn");

        logoutBtn.addEventListener("click", logout);
    }
    async function logout(e) {
        try {
            if (!confirm("로그아웃 하시겠습니까?")) {
                return;
            }
            const response = await fetch("/api/auth/logout", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("access-token");
            window.location.href = "/main/main.html";
        } catch (err) {
            console.log(err);
        }
    }
};
