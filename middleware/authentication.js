function checkForAuthenticatioInCookiee(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
            next();

        }
        try{
            const userpayload=validatetoken(tokenCookieValue);

        }
        catch(err){}
        next();

         
    }

}
module.exports={checkForAuthenticatioInCookiee};
