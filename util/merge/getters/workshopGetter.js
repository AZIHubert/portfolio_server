const DataLoader = require('dataloader');
const Workshop = require('../../../models/Workshop');
const { userGetter } = require('./userGetter');

const transformWorkshop = workshop => ({
    ...workshop._doc,
    _id: workshop._id,
    createdBy: () => userGetter(workshop.createdBy),
    editedBy: () => userGetter(workshop.editedBy)
});

const workshopLoader = new DataLoader(workshopId => workshop(workshopId));
const workshop = async workshopId => {
    try {
        const workshop = await Workshop.findById(workshopId);
        return transformWorkshop(workshop);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const workshopsLoader = new DataLoader(workshopIds => degrees(workshopIds));
const workshops = async workshopIds => {
    try {
        const workshops = await Promise.all(workshopIds.map(workshopId => Workshop.findById(workshopId)));
        return workshops.map(workshop => transformWorkshop(workshop));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformWorkshop = transformWorkshop;
module.exports.workshopGetter = async function(workshopId){
    let workshop;
    if(workshopId) workshop = await workshopLoader.load(workshopId);
    else workshop = null;
    return workshop;
};
module.exports.workshopsGetter = async function(workshopIds){
    let workshops;
    if(!!workshopIds.length) workshops = await workshopsLoader.loadMany(workshopIds);
    else workshops = [];
    return workshops;
};