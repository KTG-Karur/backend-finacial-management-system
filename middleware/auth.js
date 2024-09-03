const { UNAUTHORIZED } = require("../helpers/status-code");

async function verifyToken(req, reply) {
    try {
        await req.jwtVerify()
        return { success : true}
    } catch (error) {
        reply.code(401).send({ 
            code : UNAUTHORIZED,
            Message : "Access Denied...!"}) 
    }
}

module.exports = {
    verifyToken,
  };