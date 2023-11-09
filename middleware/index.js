const isAdmin = require("./isAdmin");
const authenticateUserToken = require("./authenticateUserToken");
const authenticateUserData = require("./authenticateUserData");
const authenticatePageData = require("./authenticatePageData");
const authenticateProductData = require("./authenticateProductData");

module.exports = {
    isAdmin,
    authenticateUserToken,
    authenticateUserData,
    authenticatePageData,
    authenticateProductData,
};
