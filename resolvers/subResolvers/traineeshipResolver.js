const Traineeship = require('../../models/Traineeship');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformTraineeship } = require('../../util/merge');

module.exports = {
    Query: {
        async getTraineeships(_, { sort, filter, skip, limit }) {
            try {
                let traineeships = await Traineeship
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return traineeships.map(traineeship => transformTraineeship(traineeship));
            } catch (err) {
                console.log(err);
            }
        },
        async getTraineeship(_, { traineeshipId }){
            try {
                let traineeship = await Traineeship.findById(traineeshipId);
                return transformTraineeship(traineeship);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createTraineeship: requiresAuth.createResolver(async (_, { ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const newTraineeship = new Traineeship({
                    ...params,
                    createdBy: _id
                });
                const savedTraineeship = await newTraineeship.save();
                return {
                    OK: true,
                    errors,
                    traineeship: transformTraineeship(savedTraineeship)
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
        updateTraineeship: requiresAuth.createResolver(async (_, { traineeshipId, ...params }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    city: oldCity,
                    company: oldCompany,
                    companyLink: oldCompanyLink,
                    year: oldYear
                } = await Degree.findById(degreeId);
                
                if(params.city === undefined || oldCity === params.city.trim())
                    delete params.city;
                if(params.company === undefined || oldCompany === params.company.trim())
                    delete params.company;
                if(params.companyLink === undefined || oldCompanyLink === params.companyLink.trim())
                    delete params.companyLink;
                if(params.year === undefined || oldYear === params.year)
                    delete params.year;
                        
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Content has not change.'
                    }]
                };
                const updatedTraineeship = await Traineeship.findByIdAndUpdate(traineeshipId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    traineeship: transformTraineeship(updatedTraineeship)
                };
            } catch(e) {
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
        deleteTraineeship: requiresAuth.createResolver(async (_, { traineeshipId }) => {
            try{
                await Traineeship.remove({ _id: traineeshipId });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}