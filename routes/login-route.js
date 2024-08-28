const fastify = require("../app");
const { verifyToken } = require("../middleware/auth");


function getEmployee(req, res){
    console.log("login---<>"+req)
    const email = "vensrini0414@gmail.com"
    const token = fastify.jwt.sign({email : email})
    res.send({ hello: 'world',token : token })
}

function createEmployee(req, res){
  res.send({ hello: 'world'})
}


module.exports = async function (fastify) {
    fastify.route({
      method: 'GET',
      url: '/login',
      handler: getEmployee
    });
  
    fastify.route({
      method: 'POST',
      url: '/login',
      preHandler: verifyToken,
      handler: createEmployee
    });
  };