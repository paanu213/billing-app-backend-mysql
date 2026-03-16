const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const companyModel = require('../models/company.model')

const register = async (data, user)=>{

    if(user.role !== "super_admin"){
        throw new Error ('You are not a Super Admin, dont have permission to Create')
        return
    }

    const {companyName, name, email, password} = data;

    if(!companyName || !name, !email, !password){
            throw new Error ('all fields are required')
            return
        }

    const existingUser = await userModel.findUserByEmail(data.email)
    if(existingUser) {
        throw new Error ('user already exist');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)


    const companyId = await companyModel.createCompany(data.companyName)

    const userId = await userModel.createUser({
        companyId: companyId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'company_admin'

    })

    return {userId}
}

const login = async (data)=>{

    if (!data){
        throw new Error ('Need email and password to login')
    }

    const {email, password} = data;

    const user = await userModel.findUserByEmail(email)

    if(!user) { throw new Error('user not found') }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error ('Please enter correct password')
    }

    const token = jwt.sign(
        {
            userId: user.id,
            companyId: user.company_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    return {token: token, user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }};

}


module.exports = {register, login}