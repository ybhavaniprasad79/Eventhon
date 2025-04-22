import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const authadmin = (req, res, next) => {
    const token = req.cookies.accesstoken || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json("Token not found");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json("Invalid or expired token");
        }

        if(decoded.role.includes('admin')){
            next()
        }else{
            res.status(404).json({message:"Your not an admin you are just a user getout from this page"})
        }
    }); 
};
const authuser = (req, res, next) => {
    const token = req.cookies.accesstoken || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json("Token not found");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json("Invalid or expired token");
        }

        if(decoded.role.includes('user')){
            next()
        }else{
            res.status(404).json({message:"Your not an user you  getout from this page"})
        }
    }); 
};

const authOrganizer = (req, res, next) => {
    const token = req.cookies.accesstoken || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json("Token not found");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json("Invalid or expired token");
        }

        if(decoded.role.includes('Organizer')){
            next()
        }else{
            res.status(404).json({message:"Your not an Organizer you are just a user getout from this page"})
        }
    }); 
};

export { authadmin, authuser, authOrganizer };