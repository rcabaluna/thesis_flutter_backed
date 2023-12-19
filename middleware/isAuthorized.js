const jwToken = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
   let token;

   if (req.headers && req.headers.authorization) {
      let parts = req.headers.authorization.split(" ");

      if (parts.length === 2) {
         let scheme = parts[0],
            credentials = parts[1];

         if (/^Bearer$/i.test(scheme)) {
            token = credentials;
         }
      } else {
         return res
            .status(401)
            .json({
               error: "Format is Authorization: Bearer [token]"
            });
      }
   } else if (req.params.token) {
      token = req.params.token;

      delete req.query.token;
   } else {
      return res.status(401).json({
         error: "No Authorization header was found"
      });
   }

   jwToken.verify(token, secretkey, async (err, data) => {
      if (err) {
         return res.status(401).json({
            error: "Invalid token"
         });
      }

      req.token = data;
      req.originalToken = token;

      next();
   });
};