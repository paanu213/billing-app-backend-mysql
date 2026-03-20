const Companies = require('../models/company.model')


const companiesList = async ()=>{
        const companies =  await Companies.findAll();
        return companies
}

const deleteCompany = async (id)=>{

    if(!id){
        throw new Error ('Id not correct')
    }
    const company = await Companies.findOne({where:{id}})

    if(!company){
        throw new Error ('Company not found')
    }

    const response = await Companies.destroy({where: {id}})

    return response
}

module.exports = {companiesList, deleteCompany}