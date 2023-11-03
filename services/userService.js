const { User } = require("../models/index");

class UserService {
    /**
     * 아이디(userId)에 따른 하나의 유저 객체 반환
     *
     * @param id {String} 유저의 아이디(userId)
     * @return {User} 유저 객체
     */
    async getUserById(userId) {
        const user = await User.findOne({ userId });
        return user;
    }

    /**
     * 이메일(email)에 따른 하나의 유저 객체 반환
     *
     * @param email {String} 유저의 이메일(email)
     * @return {User} 유저 객체
     */
    async getUserByEmail(email) {
        if (!email) {
            return undefined;
        }
        const user = await User.findOne({ email });
        return user;
    }

    /**
     * 전화번호(phone)에 따른 하나의 유저 객체 반환
     *
     * @param phone {String} 유저의 전화번호(email)
     * @return {User} 유저 객체
     */
    async getUserByPhone(phone) {
        if (!phone) {
            return undefined;
        }
        const user = await User.findOne({ phone });
        return user;
    }
}

module.exports = new UserService();
