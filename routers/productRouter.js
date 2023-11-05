const { Router } = require("express");
const { Product, Option } = require("../models");
const ProductService = require("../services/productService");

const itemRouter = Router();

itemRouter.get('/', async (req, res, next) => {
    console.log("해당상품을 조회하였습니다.");

    const { products, category } = req.query;
    console.log(`id : ${products}` );

    //const BestPList = products.sort({sales : -1}).limit(10);
    //const NewPList = products.sort({entryDate : -1}).limit(10);
    //const ReviewList = products.sort({entryDate : -1}).limit(10);


    let returnProducts = []; //전체적으로 데이터를 반환 할 배열

    //아무것도 없는 경우 모든 상품 보여주기
    //지금은 아무 객체도 없어서 임시로 만들어 놓은 더미로 확인차 넣어 놓은 것이고, 
    //나중에는 메인 화면을 열면, 베스트 아이템, 신상품, 리뷰, 카테고리별(이벤트 중심)-> 기념일 정보를 전달할 예정
    
    if (!category && !products) {
        returnProducts = await ProductService.getAllProducts();
        return res.json({
            status: 200,
            //Bestproduct,
            //Newproduct,
            products: returnProducts,
        });
    }

    //카테고리가 존재하는 경우 카테고리를 기준으로 물품 데이터를 받아옴
    if (category) {
        try {
            returnProducts = await ProductService.getProductsByCategory(category);
        } catch (error) {
            return res.json({
                status: 404,
                errorMessage: error.message,
            });
        }
    }

    if (products) {
        //concat은 모든 배열 합쳐주는..?
        const arrOfProductId = [].concat(products.split(","));
        const arrOfProductData = []; //Products 컬렉션 내 존재하는 물품 데이터
        const arrOfNotExistProductId = []; //Products 컬렉션 내 존재하지 않는 요청 물품 데이터의 아이디
        let eachProduct = 0;

        for (eachProduct = 0; eachProduct < arrOfProductId.length; eachProduct++) {
            try {
                arrOfProductData.push(await ProductService.getProductById(arrOfProductId.at(eachProduct)));
            } catch (error) {
                arrOfNotExistProductId.push(arrOfProductId.at(eachProduct));
            }
        }

        if (returnProducts.length > 0) {
            //카테고리로 이미 반환받은 데이터가 있다면
            //필터로 카테고리 내에 존재하는 물품을 반환
            returnProducts = arrOfProductData.filter((product) => {
                return product.category === category;
            });
        } else {
            returnProducts = arrOfProductData;
        }

        if (arrOfNotExistProductId.length > 0) {
            //존재하지 않는 물품의 아이디가 하나 이상일 때
            return res.json({
                status: 404,
                products: returnProducts,
                notExistProduct: arrOfNotExistProductId,
            });
        } else {
            return res.json({
                status: 200,
                products: returnProducts,
            });
        }
    } else {
        return res.json({
            status: 200,
            //Bestproduct,
            //Newproduct,
            products: returnProducts,
        });
    }
});


// itemRouter.get('/:id', async (req, res, next) => {
//     console.log("아이템 조회 라우터")
//     const id = req.params.id;
//     try {
//         const newProduct = await Product.find({id});

//         res.json(newProduct);
//     } catch (err) {
//         next(err);
//     }
// })

//상품 생성
itemRouter.post("/", async (req, res, next) => {
    console.log("상품을 post합니다!");
    const { name, price, entryDate, discountRate, category, description, option, file } = req.body;

    const {size, color} = req.body;
    //const data = req.body;
    //console.log(data);
    
    try {
        //이미 존재하는 상품인지 확인하고 겹치면 오류던짐
        const isExist = await Product.findOne({ name });
        if (isExist) {
            throw new Error("이미 존재하는 상품입니다.");
        }

        //해당 카테고리가 없는 경우
        //await ProductService.getProductsByCategory(category);

        //상품을 올릴 때 이름과 가격이 없으면 오류 -> post를 위한 필수 조건임
        if (!name || !price) {
            throw new Error("상품 정보가 부족합니다(상품 이름 또는 가격)!!");
        }

        //const newOption = await ProductService.createOption(size, color);

        //모든 조건을 거치고 상품 만들기
        const newProduct = await Product.create({
            name, 
            price, 
            discountRate, 
            category, 
            entryDate,
            description, 
            option: {
                size : req.body.option.size, 
                color : req.body.option.color
            },
            file
        });

        console.log("상품이 생성되었습니다.");

        //생성된 아이템
        res.json({
            status: 201,
            newProduct,
        });
    } catch (err) {
        next(err);
    }
});

//상품 아이템 삭제   ->질문하기
itemRouter.delete('/:id', async(req, res, next) => {
    console.log("삭제 라우터에 진입하였습니다.")
    const id = req.params.id;

    console.log({id});

    try{//const id = await 

    await Product.deleteOne({_id: id});
    res.json({message : '제품이 성공적으로 삭제되었습니다.'})
    console.log("삭제 완료");}catch(err){
        next(err);
    }
})

module.exports = itemRouter;
