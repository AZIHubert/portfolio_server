const Employment = require('../../models/Employment');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformEmployment } = require('../../util/merge');

module.exports = {
    Query: {
        async getEmployments(_, { sort, filter, skip, limit }) {
            try {
                let employments = await Employment
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return employments.map(employment => transformEmployment(employment));
            } catch (err) {
                console.log(err);
            }
        },
        async getEmployment(_, { employmentId }){
            try {
                let employment = await Employment.findById(employmentId);
                return transformEmployment(employment);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createEmployment: requiresAuth.createResolver(async (_, { ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const newEmployment = new Employment({
                    ...params,
                    createdBy: _id
                });
                const savedEmployment = await newEmployment.save();
                return {
                    OK: true,
                    errors,
                    employment: transformEmployment(savedEmployment)
                };
            } catch(err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        updateEmployment: requiresAuth.createResolver(async (_, { employmentId, ...params }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    body: oldBody,
                    city: oldCiity,
                    company: oldCompany,
                    companyLink: oldCompanyLink,
                    yearFrom: oldYearFrom,
                    yearTo: oldYearTo,
                    currentWork: oldCurrentWork
                } = await Employment.findById(employmentId);
                
                if(params.body === undefined || oldBody === params.body)
                    delete params.body;
                if(params.city === undefined || oldCiity === params.city.trim())
                    delete params.city;
                if(params.company === undefined || oldCompany === params.company.trim())
                    delete params.company;
                if(params.companyLink === undefined || oldCompanyLink === params.companyLink.trim())
                    delete params.companyLink;
                if(params.yearFrom === undefined || oldYearFrom === params.yearFrom)
                    delete params.yearFrom;
                if(params.yearTo === undefined || oldYearTo === params.yearTo)
                    delete params.yearTo;
                if(params.currentWork === undefined || oldCurrentWork === params.currentWork)
                    delete params.currentWork;
                        
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Content has not change.'
                    }]
                };
                const updatedEmployment = await Employment.findByIdAndUpdate(employmentId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    employment: transformEmployment(updatedEmployment)
                };
            } catch(err) {
                console.log(err);
                if (err.name == 'ValidationError') {
                    for (const [key, value] of Object.entries(err.errors)) {
                        errors.push({
                            path: key,
                            message: value.properties.message
                        });
                    }
                    return {
                        OK: false,
                        errors: errors
                    }
                } else {
                    throw new Error(err);
                }
            }
        }),
        deleteEmployment: requiresAuth.createResolver(async (_, { employmentId }) => {
            try{
                await Employment.remove({ _id: employmentId });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}