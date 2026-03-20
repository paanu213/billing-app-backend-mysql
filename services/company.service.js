const {Company} = require('../models')


const companiesList = async ()=>{
        const companies =  await Companies.findAll();
        return companies
}

const deleteCompany = async (id)=>{

    if(!id){
        throw new Error ('Id not correct')
    }

    const company = await Company.findOne({where:{id}})

    if(!company){
        throw new Error ('Company not found')
    }

    const response = await Company.destroy({where: {id},  individualHooks: true })

    return response
}

module.exports = {companiesList, deleteCompany}