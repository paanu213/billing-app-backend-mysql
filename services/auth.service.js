const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const companyModel = require('../models/company.model')

const register = async (data)=>{

    const existingUser = await userModel.findUserByEmail(data.email)
    if(existingUser) {
        throw new Error ('user already exist');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const userId = await userModel.createUser({
        companyId: data.companyId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'company_staff'

    })

    return {userId}
}

const login = async (data)=>{

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

    return token;

}


module.exports = {register, login}