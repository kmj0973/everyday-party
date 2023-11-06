const { User } = require("../models/index");

class UserService {
    /**
     * 아이디(userId)에 따른 하나의 유저 객체 반환
     *
     * @param id {String} 유저의 아이디(userId)
     * @return {User} 유저 객체
     * 
     */
    async getUserById(userId) {
        const user = await User.findOne({ /*userId*/ }).lean(); //findById를 사용하시면 { userId }와 같이 객체를 만들어서 넘겨줄 필요가 없습니다.
        return user;
    }

    /**
     * 이메일(email)에 따른 하나의 유저 객체 반환
     *
     * @param email {String} 유저의 이메일(email)
     * @return {User} 유저 객체
     */
    async getUserByEmail(email) {
        // if (!email) {
        //     return undefined;
        // }
        const user = await User.findOne({ email }).lean();
        if (user === null) {
            const error = new Error("해당 email을 갖고 있는 유저가 존재하지 않습니다");
            error.status = 404;
            throw error;
          }
          
        return user;
    }

    /**
     * 전화번호(phone)에 따른 하나의 유저 객체 반환
     *
     * @param phone {String} 유저의 전화번호(email)
     * @return {User} 유저 객체
     */
    async getUserByPhone(phone) {
        // if (!phone) {
        //     return undefined;
        // }
        const user = await User.findOne({ phone }).lean();
        if (user === null) {
            const error = new Error("해당 email을 갖고 있는 유저가 존재하지 않습니다");
            error.status = 404;
            throw error;
          }
          
        return user;
    }
}

module.exports = new UserService();
