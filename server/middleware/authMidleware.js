import jwt from 'jsonwebtoken'

export const protectUser = async(req,res,next)=>{
    const token = req.cookies.access_token
    console.log('token :',token)
    if(!token){
        return res.status(401).json("You need to Login")
    }

    try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('user middleware:',user)
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token is not valid' });
  }

    // jwt.verify(token , process.env.JWT_SECRET , (err,user) => {
    //     if(err){
    //         return res.status(403).json('Token is not valid');
    //     }
    //     req.user = user;
    //     next();
    // })
}

export const protectAdmin = (req, res, next) => {
  const token = req.cookies.access_token1;

  if (!token) {
    return res.status(401).json("You need to login");
  }

  try {
    const admin = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token is not valid' });
  }
};

// export const protectAdmin = (req, res, next) => {
//     const token = req.cookies.access_token1;
  
//     if (!token) {
//       return res.status(401).json("You need to login");
//     }
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
//       if (err) {
//         return res.status(403).json('Token is not valid');
//       }
//       req.admin = admin;
//       next();
//     });
//   };