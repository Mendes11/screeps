var harvesterRole = require("role.harvester");

const availableContainers = (creep) => {
    return creep.room.find(
        FIND_STRUCTURES,
        {filter: (obj) => (
            obj.structureType == STRUCTURE_CONTAINER &&
            obj.store[RESOURCE_ENERGY] > 0
        )}
    )
}

const doHarvest = (creep, resource) => {
    if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(resource, {visualizePathStyle: {
            stroke: '#fff', lineStyle: 'dashed;'
        }});
    }
}

const doWithdraw = (creep, resource) => {
    if (creep.withdraw(resource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(resource, {visualizePathStyle: {
            stroke: '#fff', lineStyle: 'dashed;'
        }});
    }
}

const collectEnergy = (creep, target) => {
    var containers = availableContainers(creep);
    var resourceId;
    if (containers.length) {
        // Use what's on storage
        doWithdraw(creep, containers[0]);
    } else {
        // // Harvest ourselves
        resourceId = harvesterRole.setResource(creep, target);
        if (!!resourceId){
            doHarvest(creep, Game.getObjectById(resourceId));    
        }
    }
}


module.exports = {
    availableContainers: availableContainers,
    doWithdraw: doWithdraw,
    doHarvest: doHarvest,
    collectEnergy: collectEnergy,
};