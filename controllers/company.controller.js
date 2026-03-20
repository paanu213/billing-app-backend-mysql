const companyService = require('../services/company.service')

const companiesList = async (req, res)=>{
    try{
        const response = await companyService.companiesList()
        res.status(500).json(response)
        
    }
    catch (error){
        res.status(500).json({message: error.message})
        
    }
}

const deleteCompanyById = async (req,res)=>{
    try{
        const response = await companyService.deleteCompany(req.params.id)
        res.status(200).json({
            response: response,
            message: 'Company deleted successfully'
        })
    }
catch (error){
    res.status(500).json({
        error: error,
        message: error.message
    })
}
}


module.exports = { companiesList, deleteCompanyById }