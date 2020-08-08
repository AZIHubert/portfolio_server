const Workshop = require('../../models/Workshop');
const { requiresAuth } = require('../../util/permissions');
const { normalizeSorting, normalizeFilter } = require('../../util/normalizers');
const { transformWorkshop } = require('../../util/merge');

module.exports = {
    Query: {
        async getWorkshops(_, { sort, filter, skip, limit }) {
            try {
                let workshops = await Workshop
                    .find(normalizeFilter(filter))
                    .sort(normalizeSorting(sort))
                    .skip(skip).limit(limit);
                return workshops.map(workshop => transformWorkshop(workshop));
            } catch (err) {
                throw new Error(err);
            }
        },
        async getWorkshop(_, { workshopId }){
            try {
                let workshop = await Workshop.findById(workshopId);
                return transformWorkshop(workshop);
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        createWorkshop: requiresAuth.createResolver(async (_, { ...params }, { user: { _id } }) => {
            const errors = [];
            try {
                const newWorkshop = new Workshop({
                    ...params,
                    createdBy: _id
                });
                const savedWorkshop = await newWorkshop.save();
                return {
                    OK: true,
                    errors,
                    workshop: transformWorkshop(savedWorkshop)
                };
            } catch (err) {
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
        updateWorkshop: requiresAuth.createResolver(async (_, { workshopId, ...params }, { user: { _id } }) => {
            const errors = [];
            try{
                let {
                    artist: oldArtist,
                    artistLink: oldArtistLink,
                    body: oldBody,
                    year: oldYear
                } = await Workshop.findById(workshopId);
                
                if(params.artist === undefined || oldArtist === params.artist.trim())
                    delete params.artist;
                if(params.artistLink === undefined || oldArtistLink === params.artistLink.trim())
                    delete params.artistLink;
                if(params.body === undefined || oldBody === params.body.trim())
                    delete params.body;
                if(params.year === undefined || oldYear === params.year)
                    delete params.year;
                        
                if(!Object.keys(params).length) return {
                    OK: false,
                    errors: [{
                        path: 'general',
                        message: 'Content has not change.'
                    }]
                };
                const updatedWorkshop = await Workshop.findByIdAndUpdate(workshopId,
                    { ...params, updatedBy: _id },
                    { new: true }
                );
                return {
                    OK: true,
                    errors,
                    workshop: transformWorkshop(updatedWorkshop)
                };
            } catch (err) {
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
                    throw new Error(e);
                }
            }
        }),
        deleteWorkshop: requiresAuth.createResolver(async (_, { workShopId }) => {
            try{
                await Workshop.remove({ _id: workShopId });
                return true;
            } catch (err) {
                throw new Error(err);
            }
        })
    }
}