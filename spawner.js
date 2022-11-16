var upgraderRole = require("role.upgrader");
var harvesterRole = require("role.harvester");
var builderRole = require("role.builder");

var MAX_UPGRADERS = 9;
var MAX_HARVESTERS = 12;
var MAX_BUILDERS = 5;

module.exports = {
    run: (spawn) => {
        const upgradersCount = _.filter(Game.creeps, c => c.memory.role == upgraderRole.ROLE).length
        const harvestersCount = _.filter(Game.creeps, c => c.memory.role == harvesterRole.ROLE).length
        const builderCount = _.filter(Game.creeps, c => c.memory.role == builderRole.ROLE).length
        if (harvestersCount < MAX_HARVESTERS) {
            harvesterRole.spawnNew(spawn);
        } else if (upgradersCount < MAX_UPGRADERS) {
            upgraderRole.spawnNew(spawn);
        } else if (builderCount < MAX_BUILDERS) {
            // TODO: Add logic to only spawn if we have pending constructions/repairs
           builderRole.spawnNew(spawn);
        }
    }
};