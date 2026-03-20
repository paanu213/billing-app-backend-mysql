const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const Company = require('../models/company.model')


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

    const existingUser = await User.findOne({where:{email}})
    if(existingUser) {
        throw new Error ('user already exist');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const createCompany = await Company.create({companyName})

    const registerUser = await User.create({
        companyId: createCompany.id,
        name: name,
        email: email,
        password: hashedPassword,
        role: data.role || 'company_admin'

    })

    return { name, email, companyName, role: registerUser.role}
}

const login = async (data)=>{

    if (!data){
        throw new Error ('Need email and password to login')
    }

    const {email, password} = data;

    const  user = await User.findOne({where:{email}, include: [{model:Company, required: true}]})

    // if (user) {
    //     const companyId = user.companyId;

    //     const isCompanyActive = await Company.findOne({where:{companyId}})

    //     if(!isCompanyActive){
    //     throw new Error ("your company not active. please activate to login")
    // }
    // }
    

    if(!user) { throw new Error('user not found') }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error ('Please enter correct password')
    }

    const token = jwt.sign(
        {
            userId: user.id,
            companyId: user.companyId,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    )

    console.log(token)

    return {token: token, user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }};

}


module.exports = {register, login}