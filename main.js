var harvesterRole = require("role.harvester");
var upgraderRole = require("role.upgrader");
var builderRole = require("role.builder");
var spawner = require("spawner");

const HARVESTER_ROLE = "harvester";
const BUILDER_ROLE = "builder";
const UPGRADER_ROLE = "upgrader";

roles = {
    "harvester": harvesterRole,
    "upgrader": upgraderRole,
    "builder": builderRole,
}

const creepsController = (creeps) => {
    for (name in creeps) {
        var creep = Game.creeps[name]
        if (!!roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        }
    }
}

const spawnController = (spawns) => {
    for (name in spawns) {
        spawner.run(Game.spawns[name]);
    }
}

creepsController(Game.creeps);
spawnController(Game.spawns);