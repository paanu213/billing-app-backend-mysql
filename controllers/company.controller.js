const companyService = require('../services/company.service')

const createCompanyWithAdmin = async (req, res)=>{

    try{
        const response = await companyService.createCompanyWithAdmin(req.body)
        res.status(201).json(response)
        console.log(req.body);
    }
    catch (error){
        console.error(`error: ${error}`)
        res.status(500).json({message: error.message})
    }

}


module.exports = {createCompanyWithAdmin}