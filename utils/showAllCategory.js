const allCategoryBtn = document.querySelector("#all-category-btn");
const allCategoryContainer = document.querySelector(".semi-container");

const onClickAllCategory = (e) => {
    // 모든 카테고리 드롭다운 이벤트
    if (allCategoryContainer.classList.contains("show")) {
        // show 클래스가 포함된 태그 확인
        allCategoryContainer.style.height = "0px";
        allCategoryContainer.classList.remove("show");
    } else {
        allCategoryContainer.style.height = "250px";
        allCategoryContainer.classList.add("show");
    }
};

allCategoryBtn.addEventListener("click", onClickAllCategory);

export default showAllCategory;
