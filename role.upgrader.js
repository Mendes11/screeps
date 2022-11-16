var harvesterRole = require("role.harvester");
var helpers = require("helpers");

const PARTS = [WORK, WORK, WORK, CARRY, MOVE];
const ROLE = "upgrader";

const spawnNew = (spawn) => {
    var ret = spawn.spawnCreep(PARTS, `U${Game.time}`, {memory: {role: ROLE}});
    console.log(ret);
}

const doUpgrade = (creep, controller) => {
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {
            stroke: '#fff', lineStyle: 'dashed;'
        }});
    }
}

const selectController = (creep) => {
    return creep.room.controller;
}

const setTargetController = (creep) => {
    var controllerId = creep.memory.controllerId;
    if (!controllerId) {
        var controllerObj = selectController(creep);
        controllerId = controllerObj.id;
        creep.memory.controllerId = controllerId;
    }
    return controllerId;
}

const deliverEnergy = (creep, target) => {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

module.exports = {
    run: (creep) => {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say("🔄 harvest");
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say("⚡ upgrade");
        }
        // Upgrade the controller
        var controllerId = setTargetController(creep);
        if (!creep.memory.upgrading) {
            helpers.collectEnergy(creep, Game.getObjectById(controllerId));
        } else {
            
            if (!!controllerId) {
                doUpgrade(creep, Game.getObjectById(controllerId));
            }
        }
    },
    spawnNew: spawnNew,
    ROLE: ROLE,
    PARTS, PARTS,
};