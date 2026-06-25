const JWT=require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function createToken(user){
    const payload={
        id:user._id,
        email:user.email,
        profilePic:user.profilePic,
        role:user.role,
    }
    const token=JWT.sign(payload,secret);
    return token;
}
function validatetoken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}
module.exports={createToken,validatetoken};
