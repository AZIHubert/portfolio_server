const DataLoader = require('dataloader');
const Traineeship = require('../../../models/Traineeship');
const { userGetter } = require('./userGetter');

const transformTraineeship = traineeship => ({
    ...traineeship._doc,
    _id: traineeship._id,
    createdBy: () => userGetter(traineeship.createdBy),
    editedBy: () => userGetter(traineeship.editedBy)
});

const traineeshipLoader = new DataLoader(traineeshipId => traineeship(traineeshipId));
const traineeship = async traineeshipId => {
    try {
        const traineeship = await Traineeship.findById(traineeshipId);
        return transformTraineeship(traineeship);
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

const traineeshipsLoader = new DataLoader(traineeshipIds => degrees(traineeshipIds));
const traineeships = async traineeshipIds => {
    try {
        const traineeships = await Promise.all(traineeshipIds.map(traineeshipId => Traineeship.findById(traineeshipId)));
        return traineeships.map(traineeship => transformTraineeship(traineeship));
    } catch(err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports.transformTraineeship = transformTraineeship;
module.exports.traineeshipGetter = async function(traineeshipId){
    let traineeship;
    if(traineeshipId) traineeship = await traineeshipLoader.load(traineeshipId);
    else traineeship = null;
    return traineeship;
};
module.exports.traineeshipsGetter = async function(traineeshipIds){
    let traineeships;
    if(!!traineeshipIds.length) traineeships = await traineeshipsLoader.loadMany(traineeshipIds);
    else traineeships = [];
    return traineeships;
};