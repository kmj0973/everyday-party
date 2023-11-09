const { mongoose, Schema } = require("mongoose");

const fileSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

/*파일은 MongoDB에 저장하지 않는 것이 좋습니다. 머신(로컬 또는 VM)의 파일 시스템을 이용하는 것이 좋고 MongoDB에는 파일의 url(FQDN 보다는 path만을 사용해서 파일 저장소의 도메인이 바뀌어도 문제 없도록 해주면 더욱 GOOD)을 담아줍시다.*/

module.exports = fileSchema;
