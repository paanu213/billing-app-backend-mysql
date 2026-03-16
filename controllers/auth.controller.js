const authService = require('../services/auth.service')

const register = async (req, res)=>{

    try{

        const response = await authService.register(req.body)
        res.status(201).json(response)

    }
    catch(error){
        console.error(`error: ${error}`)
        res.status(500).json({message: error.message})
    }

}

const login = async (req, res)=>{
    try{

        const response = await authService.login(req.body)
        res.status(200).json(response)

    }
    catch(error){
        console.log(`error: ${error}`)
        res.status(500).json({message: 'server error'})
    }
}


module.exports = {register, login}