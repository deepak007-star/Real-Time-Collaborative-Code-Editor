const asyncWrapper = (fn)=>(req, res,next)=>{
    Promise.resolve(fn(req, res)).catch(next);
}

module.exports = asyncWrapper;