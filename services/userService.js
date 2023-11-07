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
        const user = await User.findOne({ userId })
            .lean()
            .catch((error) => {
                const newError = new Error("유저 정보를 불러오던 중 서버 내에 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });
        return user;
    }

    /**
     * 이메일(email)에 따른 하나의 유저 객체 반환
     *
     * @param email {String} 유저의 이메일(email)
     * @return {User} 유저 객체
     */
    async getUserByEmail(email) {
        const user = await User.findOne({ email })
            .lean()
            .catch((error) => {
                const newError = new Error("유저 정보를 불러오던 중 서버 내에 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });
        return user;
    }

    /**
     * 전화번호(phone)에 따른 하나의 유저 객체 반환
     *
     * @param phone {String} 유저의 전화번호(email)
     * @return {User} 유저 객체
     */
    async getUserByPhone(phone) {
        const user = await User.findOne({ phone })
            .lean()
            .catch((error) => {
                const newError = new Error("유저 정보를 불러오던 중 서버 내에 문제가 발생했습니다.");
                newError.status = 500;
                throw newError;
            });
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
        console.log(newUser);
        await newUser.save().catch((error) => {
            const newError = new Error("회원가입 중 오류가 발생했습니다.");
            newError.status = 500;
            throw newError;
        });
        return newUser;
    }

    /**
     * 기존 아이디를 통해 유저를 찾고, 데이터를 수정 후 수정한 유저 객체 반환
     *
     * @param originalUserId {String} 기존 유저의 아이디(userId)
     * @param data {Object}
     * @return {User} 유저 객체
     *
     */
    async updateUser(originalUserId, data) {
        const updatedUser = await User.findOneAndUpdate({ userId: originalUserId }, data, { new: true }).catch((error) => {
            const newError = new Error("유저 정보를 업데이트 하던 중 서버 내에 문제가 발생했습니다.");
            newError.status = 500;
            throw newError;
        });

        return updatedUser;
    }
}

module.exports = new UserService();
