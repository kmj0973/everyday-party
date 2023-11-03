export const setHeaderElement = () => {
    const headerElement = document.createElement("header");
    headerElement.innerHTML = `
    <div class="header-container">
        <div class="navbar-logo">
            <a href="/"
                ><img class="logo-image" src="./images/logo.png" width="30" height="30" /><span
                    class="logo-name"
                    >EVERYDAY<br />PARTY</span
                >
            </a>
        </div>
        <div class="navbar-end">
            <ul id="navbar">
                <li>로그인</li>
                <li>회원가입</li>
                <li>장바구니</li>
            </ul>
        </div>
    </div>
`;
    document.body.prepend(headerElement);
};
