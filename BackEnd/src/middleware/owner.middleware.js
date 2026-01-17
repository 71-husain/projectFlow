const isProjectOwner = async (req,res,next)=>{
    if(req.project.owner.toString() !== req.user.id){
        return res.status(403).json({message : "owner access required"})
    }

    next();
}

module.exports = isProjectOwner;