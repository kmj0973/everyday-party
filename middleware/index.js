const isAdmin = require("./isAdmin.js");
const authenticateUserToken = require("./authenticateUserToken.js");
const authenticateUserData = require("./authenticateUserData.js");
const authenticatePageData = require("./authenticatePageData.js");
const authenticateProductData = require("./authenticateProductData.js");

module.exports = {
    isAdmin,
    authenticateUserToken,
    authenticateUserData,
    authenticatePageData,
    authenticateProductData,
};
