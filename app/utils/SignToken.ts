import jwt from 'jsonwebtoken';

export const signToken = async (id:string)=> {
const token = await jwt.sign({_id:id}, process.env.TOKEN_SECRET || "", {expiresIn: '1d'});
    return token
}
