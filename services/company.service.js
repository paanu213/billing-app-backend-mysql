const companyModel = require('../models/company.model')


const companiesList = async ()=>{
        const companies =  await companyModel.companiesList();
        return companies
}

const deleteCompany = async (id)=>{
    const companyDelete = await companyModel.companyDeletebyid(id)
    return companyDelete
}

module.exports = {companiesList, deleteCompany}