const { Router } = require('express');
const { Product, Option } = require('../models');

const itemRouter = Router();


itemRouter.get('/', async (req, res, next) => {
    console.log("아이템 조회 라우터")
    try {
        const newProduct = await Product.find({});

        res.json(newProduct);
   
    } catch (err) {
        next(err);
    }
})


itemRouter.get('/:id', async (req, res, next) => {
    console.log("아이템 조회 라우터")
    const id = req.params.id;
    try {
        const newProduct = await Product.find({id});

        res.json(newProduct);
    } catch (err) {
        next(err);
    }
})

//상품 생성
itemRouter.post('/', async (req, res, next) => {
    console.log("상품을 post합니다!");
    const { name, price, discountRate, category, description, option, file } = req.body;
    //const data = req.body;
    //console.log(data);
    try {
        //이미 존재하는 상품인지 확인하고 겹치면 오류던짐
        const isExist = await Product.findOne({name});
        if (isExist) {
            throw new error("이미 존재하는 상품입니다.");
        }

        //해당 카테고리가 없는 경우
        // const isCategory = await category.findOne({category});
        // if (!isCategory) {
        //     throw new error("해당 카테고리는 존재하지 않습니다.");
        // }

        //상품을 올릴 때 이름과 가격이 없으면 오류 -> post를 위한 필수 조건임
        if (!name || !price) {
            throw new Error('상품 정보가 부족합니다(상품 이름 또는 가격)!!');

        }

        //모든 조건을 거치고 상품 만들기
        const newProduct = await Product.create({
            name,
            price

        });
        console.log("상품이 생성되었습니다.");


        //생성된 아이템 
         res.json( {
            status: 201,
            data: newProduct 
        });

    } catch (err) {
        next(err);
    }

}
)

//상품 아이템 삭제
itemRouter.delete('/:id', async(req, res) => {
    console.log("삭제 라우터에 진입하였습니다.")
    const {id} = req.params;

    await Product.deleteOne({id});
    res.json({message : '제품이 성공적으로 삭제되었습니다.'})
    console.log("삭제 완료");
})


module.exports = itemRouter;