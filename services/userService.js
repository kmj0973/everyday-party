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
        const user = await User.findOne({ userId }).lean();
        return user;
    }

    /**
     * 이메일(email)에 따른 하나의 유저 객체 반환
     *
     * @param email {String} 유저의 이메일(email)
     * @return {User} 유저 객체
     */
    async getUserByEmail(email) {
        const user = await User.findOne({ email }).lean();
        return user;
    }

    /**
     * 전화번호(phone)에 따른 하나의 유저 객체 반환
     *
     * @param phone {String} 유저의 전화번호(email)
     * @return {User} 유저 객체
     */
    async getUserByPhone(phone) {
        const user = await User.findOne({ phone }).lean();
        return user;
    }

    /**
     * 아이디(userId)에 따른 하나의 유저 객체 반환
     *
     * @param id {String} 유저의 아이디(userId)
     * @return {User} 유저 객체
     *
     */
    async createUser(data) {
        const newUser = new User(data);
        await newUser.save().catch((error) => {
            const newError = new Error("회원가입 중 오류가 발생했습니다.");
            newError.status = 500;
            throw newError;
        });
        return user;
    }
}

module.exports = new UserService();
