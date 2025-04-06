const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next)=>{
    console.log("error handle middleware");
    const errStatus= err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    const errMsg = err.message || "something went wrong"
    res.status(errStatus).json({
        success:false,
        message:errMsg
    })
}
module.exports = errorHandler