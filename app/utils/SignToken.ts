import jwt from 'jsonwebtoken';

const SignToken = async (id:string)=> {
const token = await jwt.sign({_id:id}, process.env.TOKEN_SECRET || "", {expiresIn: '1d'});
    return token
}

export default SignToken;