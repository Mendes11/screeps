var helpers = require("helpers");

const ROLE = "builder";
const PARTS = [CARRY, WORK, MOVE];

const spawnNew = (spawn) => {
    spawn.spawnCreep(PARTS, `B${Game.time}`, {memory: {role: ROLE}});
}

const selectBuildTarget = (creep) => {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    var target = undefined;
    if (targets.length) {
        target = targets[0];    
    }
    return target;
}

const repairTargets = (creep) => {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });
    targets.sort((a,b) => a.hits - b.hits);
    return targets;
}

const selectRepairTarget = (creep) => {
    const targets = repairTargets(creep);
    if (targets.length > 0) {
        return targets[0];
    }
    return undefined;
}

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        const buildTarget = selectBuildTarget(creep);
        const repairTarget = selectRepairTarget(creep);
        
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        
        
        if(creep.memory.building && buildTarget) {
            if(creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (creep.memory.building && repairTarget) {
            if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }else if (buildTarget){
            helpers.collectEnergy(creep, buildTarget);
        } else if (repairTarget) {
            helpers.collectEnergy(creep, repairTarget);
        }
    },
    ROLE: ROLE,
    PARTS: PARTS,
    spawnNew: spawnNew,
};

module.exports = roleBuilder;