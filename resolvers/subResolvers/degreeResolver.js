const Degree = require('../../models/Degree');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformDegree } = require('../../util/merge');

module.exports = {
    Query: {
        async getDegrees(_, { sort, filter, skip, limit }) {
            try {
                let degrees = await Degree
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return degrees.map(degree => transformDegree(degree));
            } catch (err) {
                console.log(err);
            }
        },
        async getDegree(_, { degreeId }){
            try {
                let degree = await Degree.findById(degreeId);
                return transformDegree(degree);
            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createDegree: requiresAuth.createResolver(async (_, { ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const newDegree = new Degree({
                    ...params,
                    createdBy: _id
                });
                const savedDegree = await newDegree.save();
                return {
                    OK: true,
                    errors,
                    degree: transformDegree(savedDegree)
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
        updateDegree: requiresAuth.createResolver(async (_, { degreeId, ...params }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    city: oldCity,
                    degree: oldDegree,
                    school: oldSchool,
                    schoolLink: oldSchoolLink,
                    year: oldYear
                } = await Degree.findById(degreeId);
                
                if(params.city === undefined || oldCity === params.city.trim())
                    delete params.city;
                if(params.degree === undefined || oldDegree === params.degree.trim())
                    delete params.degree;
                if(params.school === undefined || oldSchool === params.school.trim())
                    delete params.school;
                if(params.schoolLink === undefined || oldSchoolLink === params.schoolLink.trim())
                    delete params.schoolLink;
                if(params.year === undefined || oldYear === params.year)
                    delete params.year;
                        
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Content has not change.'
                    }]
                };
                const existedDegree = await Degree.findOne({degree: params.degree });
                if(existedDegree) return {
                    OK: false,
                    errors: [{
                        path: 'degree',
                        message: 'Degree already exist.'
                    }]
                };
                const updatedDegree = await Degree.findByIdAndUpdate(degreeId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    degree: transformDegree(updatedDegree)
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
        deleteDegree: requiresAuth.createResolver(async (_, { degreeId }) => {
            try{
                await Degree.remove({ _id: degreeId });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
}