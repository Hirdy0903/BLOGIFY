const { validatetoken } = require("../services/authentication");

function checkForAuthenticatioInCookiee(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userpayload = validatetoken(tokenCookieValue);
            req.user = userpayload;
        } catch (err) {
            return next();
        }

        return next();
    };
}

module.exports = { checkForAuthenticatioInCookiee };