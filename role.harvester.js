const PARTS = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const ROLE = "harvester";


const spawnNew = (spawn) => {
    spawn.spawnCreep(PARTS, `H${Game.time}`, {memory: {role: ROLE}});
}


const doHarvest = (creep, resource) => {
    if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(resource, {visualizePathStyle: {
            stroke: '#fff', lineStyle: 'dashed;'
        }});
    }
}

// select the best resource based on the destinationObj's position
const selectResource = (creep, destinationObj) => {
    // Select the closest resource
    var resource = destinationObj.pos.findClosestByPath(
        FIND_SOURCES_ACTIVE,
        // {filter: (obj) => obj.store[RESOURCE_ENERGY] > 0}
    );
    // But now we need to make sure that this resource has room to fit this harvester
    return resource
}

const setResource = (creep, target) => {
    var resourceId = creep.memory.targetResourceId;
    if (!resourceId) {
        resource = selectResource(creep, target);
        if (!!resource) {
            creep.memory.targetResourceId = resource.id;
            resourceId = resource.id
        }
    }
    return resourceId;
}




const selectTarget = (creep) => {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (obj) => {
            return (
                obj.structureType == STRUCTURE_SPAWN ||
                obj.structureType == STRUCTURE_EXTENSION ||
                obj.structureType == STRUCTURE_TOWER 
            ) && obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    })
    if (targets.length) {
        return targets[0];
    }
    // If no spawn/extension or towers are found, then we fill the containers
    var containers = creep.room.find(
        FIND_STRUCTURES,
        {filter: (obj) => (
            obj.structureType == STRUCTURE_CONTAINER &&
            obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        )}
    )
    if (containers.length) {
        return containers[0];
    }
    return Game.spawns["HQ"];
}

const deliverEnergy = (creep, target) => {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

module.exports = {
    run: (creep) => {
        var target = selectTarget(creep);
        var targetId = target.id;
        if (creep.store.getFreeCapacity() > 0) {
            // Harvest
            var resourceId = setResource(creep, Game.getObjectById(targetId));
            if (!!resourceId){
                doHarvest(creep, Game.getObjectById(resourceId));    
            }
            
        } else {
            // Deliver to a Target
            if (!!targetId){
                deliverEnergy(creep, Game.getObjectById(targetId));
            }
        }
    },
    doHarvest: doHarvest,
    setResource: setResource,
    PARTS: PARTS,
    ROLE: ROLE,
    spawnNew: spawnNew,
};