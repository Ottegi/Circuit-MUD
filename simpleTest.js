import { Engine } from "./circuit-string";
import telnet from "telnet";
import { admins } from "./admins.json";
import database from "./database.json";
import worlds from "./worlds.json";
import fs from "fs";
import CryptoJS from "crypto-js";
import {key as cryptokey} from "./cryptokey.json";

let Circuit = new Engine();

let main = Circuit.Story("Circuit MUD");
main.editBody(["Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", "Type \"help\" for commands"])

let help = Circuit.Story("Help Menu");
help.editBody(["Command Categories are as follows: ", "Pathways", "Communication", "Hobbies"]);

let Pathways = Circuit.Category("Pathways");
let Communication = Circuit.Category("Communication");
let Hobbies = Circuit.Category("Hobbies");

/* Hobbies */
// Mining
let Mining = Circuit.Hobby("Mining");
let mine = Circuit.Action("mine", "mines things around you");
mine.addLife((...args) => {
    let usere = database.users.find(user => user.username == args[0][0]);
    let picLevel = usere.tools.pickaxe.level;
    let str = `Gained the following ore: `;
    let secto = findSector(usere.username);
    let keys = [];
    Object.keys(secto.resources).forEach(key => {
        keys.push(key);
    });

    let oresInWorld = [];
    keys.forEach(key => {
        if ((usere.ores.find(ore => ore.name == key).hardness <= usere.tools.pickaxe.level) && (secto.resources.hasOwnProperty(key))) {
            if (secto.resources[key].count > 0) {
                let countingBlocks = Math.floor(Math.random() * 2);
                if (secto.resources[key].count - countingBlocks > 0) {
                    usere.ores.find(ore => ore.name == key).count += countingBlocks;
                    secto.resources[key].count -= countingBlocks;

                    if (countingBlocks > 0) {
                        send(args[0][1], `You have obtained ${key}`);
                    }
                }
            }
        }
    });
});

Mining.addAction(mine);

// Crafting
let Crafting = Circuit.Hobby("Crafting");

// Fighting
let Fighting = Circuit.Hobby("Fighting");


Pathways.addParts(["exit - Exit's the connection", "logout - Logs out of the server"]);
Communication.addParts(["say - speaks to other players", "whisper - whispers to another player privately"]);
Hobbies.addParts(["Type help <hobby> for commands on hobby"]);
Hobbies.addHobbies([Mining, Crafting, Fighting]);


let clients = [];

telnet.createServer((client) => {
    let message = "";
    let loggedIn = false;
    let username;
    let currentWorld = "main";

    send(client, main.create());

    client.on("end", () => {
        if (username) {
            for (let i = 0; i < clients.length; i++) {
                let cl = clients[i];

                if (cl.username == username) {
                    clients.splice(i, 1);
                }
            }

            sendAll(`[${username}] has left the server. ${clients.length} users remaining`);
        }
    })

    client.on("error", (err) => {
        console.log(err);
    });

    client.on("data", (data) => {
        if (/[\n\r]$/.test(data)) {
            let command;
            let args = [];
            message.split(" ").forEach((part, index) => {
                if (index == 0) {
                    command = part;
                } else {
                    args.push(part.split(/[\n\r\b]$/).join(""));
                };
            });

            if (loggedIn == true && isAdmin(username)) {
                switch (command) {
                    case "save":
                        saveGame();
                        sendAll("Game has been saved. ");
                        break;
                }
            };

            if (loggedIn == false) {
                switch (command) {
                    case "login":
                        if (database.users.find(user => user.username == args[0])) {
                            for (let i = 0; i < database.users.length; i++) {
                                if (args[1] == CryptoJS.AES.decrypt(database.users[i].password, cryptokey).toString(CryptoJS.enc.Utf8)) {
                                    loggedIn = true;
                                    username = args[0];
                                    let loggedInStory = Circuit.Story("Logged in");
                                    loggedInStory.editBody(["Username: " + args[0]]);
                                    send(client, loggedInStory.create());
                                    clients.push({ "username": args[0], "client": client, "world": getUser(args[0]).currentWorld });
                                    sendAll(`User [${username}] has connected to the server! \n${clients.length} users are online | ${getDate()}`);
                                    getUser(username).ores.sort((a, b) => (a.hardness > b.hardness) ? 1 : -1).forEach(ore => {
                                        console.log(ore.name + "|" + ore.hardness);
                                    })
                                }
                            }
                        }
                        break;

                    case "create":
                        if (database.users.find((user) => user.username == args[0])) {
                            send(client, "That user exists");
                        } else {
                            let user = {
                                "username": args[0],
                                "password": CryptoJS.AES.encrypt(args[1], cryptokey).toString(),
                                "ores": [{
                                    "name": "coal",
                                    "count": 0,
                                    "rarity": 1 / 34,
                                    "hardness": 1
                                },
                                {
                                    "name": "iron",
                                    "count": 0,
                                    "rarity": 1 / 72,
                                    "hardness": 3
                                }, {
                                    "name": "gold",
                                    "count": 0,
                                    "rarity": 1 / 5465,
                                    "hardness": 2
                                }, {
                                    "name": "titanium",
                                    "count": 0,
                                    "rarity": 1 / 347,
                                    "hardness": 4
                                }, {
                                    "name": "uranium",
                                    "count": 0,
                                    "rarity": 1 / 529,
                                    "hardness": 4
                                }, {
                                    "name": "copper",
                                    "count": 0,
                                    "rarity": 1 / 259,
                                    "hardness": 1
                                }, {
                                    "name": "aluminium",
                                    "count": 0,
                                    "rarity": 1 / 77,
                                    "hardness": 3
                                }, {
                                    "name": "tin",
                                    "count": 0,
                                    "rarity": 1 / 741,
                                    "hardness": 1
                                }, {
                                    "name": "silver",
                                    "count": 0,
                                    "rarity": 1 / 17,
                                    "hardness": 2
                                }, {
                                    "name": "lead",
                                    "count": 0,
                                    "rarity": 1 / 84,
                                    "hardness": 2
                                }, {
                                    "name": "zinc",
                                    "count": 0,
                                    "rarity": 1 / 101,
                                    "hardness": 2
                                }, {
                                    "name": "platinum",
                                    "count": 0,
                                    "rarity": 1 / 962,
                                    "hardness": 4
                                }, {
                                    "name": "palladium",
                                    "count": 0,
                                    "rarity": 1 / 2329,
                                    "hardness": 5
                                }, {
                                    "name": "nickel",
                                    "count": 0,
                                    "rarity": 1 / 590,
                                    "hardness": 2
                                }
                                ],
                                "lastMined": Date.now(),
                                "tools": {
                                    "pickaxe": {
                                        "level": 1,
                                    },
                                    "axe": {
                                        "level": 1
                                    },
                                    "hoe": {
                                        "level": 1
                                    },
                                    "spade": {
                                        "level": 1
                                    }
                                },
                                "weapons": {
                                    "shotgun": 0,
                                    "sniper": 0,
                                    "dagger": 0,
                                    "rifle": 0,
                                    "spear": 0,
                                    "bow": 0,
                                    "pistol": 0,
                                    "grenadeLauncher": 0,
                                    "grenade": 0,
                                    "crossbow": 0,
                                    "knife": 0,
                                    "handGun": 0,
                                    "assaultRifle": 0,
                                    "boomerang": 0,
                                    "uzi": 0,
                                    "javelin": 0,
                                    "flameThrower": 0,
                                    "long Bow": 0,
                                    "dart": 0,
                                    "throwingKnife": 0
                                },
                                "liquids": {
                                    "magma": 0,
                                    "plasma": 0,
                                    "water": 0,
                                    "acid": 0,
                                    "gas": 0,
                                    "oil": 0,
                                    "blood": 0,
                                    "bromine": 0
                                },
                                "currentWorld": "Cyber City",
                                "pos": {
                                    "x": 5,
                                    "y": 0
                                }
                            };

                            database.users.push(user);
                            fs.writeFile("./database.json", JSON.stringify(database), () => {

                            });
                            let createdUser = Circuit.Story("Created User");
                            createdUser.editBody(["Username: " + user.username, "Password: " + user.password]);

                            send(client, createdUser.create());
                            loggedIn = true;
                            username = args[0];
                            clients.push({ "username": args[0], "client": client, "world": "main" });
                            sendAll(`[${username}] has connected to the server for the first time! Please welcome them! \n${clients.length} users are online | ${getDate()}`);
                        }

                    case "exit":
                        client.end();
                        break;
                };
            } else {

                logNetwork(`${username} executed: ${command}:${args.join(" ")}`);

                switch (command) {
                    case "exit":
                        client.end();
                        break;

                    case "help":
                        if (args) send(client, help.create(Circuit, args));
                        else send(client, help.create());
                        break;

                    case "joinWorld":
                        for (let key of Object.keys(worlds)) {
                            if (key == args.join(" ")) {
                                let world = worlds[key];
                                world.map.forEach(part => {
                                    part.forEach(sector => {
                                        if ((sector.pos.x == getUser(username).pos.x) && (sector.pos.y == getUser(username).pos.y)) {
                                            sendAll(`${getUser(username).username} has left ${getUser(username).currentWorld}`, { "option": "world", "world": getUser(username).currentWorld });
                                            getUser(username).currentWorld = args.join(" ");
                                            clients.find(client => client.username == username).world = args.join(" ");
                                            sendAll(`${getUser(username).username} has joined ${getUser(username).currentWorld}`, { "option": "world", "world": getUser(username).currentWorld });
                                        }
                                    });
                                });
                            }
                        }
                        break;

                    case "logout":
                        loggedIn = false;
                        username = null;
                        send(client, "Logged out successfully!");
                        break;

                    case "say":
                        sendAll(`{${getUser(username).currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`, { "option": "world", "world": getUser(username).currentWorld });
                        logNetwork(`Message Sent: {${getUser(username).currentWorld}} [${username}]: ${args.join(" ")} | ${getDate()}`);
                        break;

                    case "announce":
                        sendAll(`Announcement > [${username}]: ${args.join(" ")} | ${getDate()}`);
                        logNetwork(`Message Announced: [${username}]: ${args.join(" ")} | ${getDate()}`);
                        break;

                    case "mine":
                        if (Date.now() - getUser(username).lastMined >= 5000) {
                            mine.execute(username, client);
                            getUser(username).lastMined = Date.now();
                        } else {
                            send(client, "You can't mine right now, please wait " + Math.floor((5000 - (Date.now() - getUser(username).lastMined)) / 1000) + " seconds");
                        }
                        break;

                    case "stats":
                        let stats = Circuit.Story("Stats");
                        stats.editBody(getKeyValuePair(getUser(username).ores, "count", "name"));
                        send(client, stats.create());
                        break;

                    case "go":
                        let direction = args[0];
                        let velX;
                        let velY;
                        switch (direction) {
                            case "north":
                                velY = -1;
                                break;

                            case "east":
                                velX = 1;
                                break;

                            case "south":
                                velY = 1;
                                break;

                            case "west":
                                velX = -1;
                                break;
                        }
                        let pos = getUser(username).pos;

                        if ((pos.x + velX >= 0) && (pos.x + velX < 10)) {
                            pos.y += velX;
                        }

                        if ((pos.y + velY >= 0) && (pos.y + velY < 10)) {
                            pos.y += velY;
                        }

                        saveGame();

                        break;
                }
            }

            message = "";
        } else {
            if (data == "\b") {
                message = message.substr(0, message.length - 1);
            } else {
                message += data;
            }
        }
    });

}).listen(4922)

function send(client, data) {
    try {
        client.write(data + "\n");
    } catch (err) {

    }
}

function sendAll(data, options) {
    if (!options) {
        clients.forEach((client) => {
            client = client.client;
            try {
                client.write(data + "\n");
            } catch (err) {

            }
        })

        logNetwork(data + "\n");
    } else {
        switch (options.option) {
            case "world":
                clients.forEach(client => {
                    if (client.world == options.world) {
                        try {
                            client.client.write(data + "\n");
                        } catch (err) {

                        }
                    }

                    logNetwork(data + "\n");
                });
        }
    }
}

function logNetwork(data) {
    fs.appendFile("./logs.txt", data + "\n", () => {
        console.log(`Logged data => ${data}`);
    });
}

function getDate() {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(now_utc).toISOString();
}

function saveGame() {
    fs.writeFile("./database.json", JSON.stringify(database, null, 4), () => {

    });

    fs.writeFile("./worlds.json", JSON.stringify(worlds, null, 4), () => {

    });
}

// Autosave
setInterval(() => {
    fs.writeFile("./database.json", JSON.stringify(database, null, 4), () => {

    });

    fs.writeFile("./worlds.json", JSON.stringify(worlds, null, 4), () => {

    });

    sendAll("Game has been saved!");
}, 1000 * 60 * 5);

function getUser(username) {
    return database.users.find(user => user.username == username);
}

function isAdmin(username) {
    if (admins.find(admin => admin == username)) return true;

    return false;
}

function probability(n) {
    return Math.random() <= n;
}

setInterval(() => {
    for (let key of Object.keys(worlds)) {
        let world = worlds[key];
        world.map.forEach(part => {
            part.forEach(sector => {
                Object.values(sector.resources).forEach(ore => {
                    ore.count += Math.floor(Math.random() * 10);
                })
            });
        })

        sendAll(`${key} has been regenerated! Start finding ore!`, { "option": "world", "world": world });
    }

    saveGame();

}, 1000 * 60 * 2.49);

function findSector(username) {
    let currentWorld = worlds[getUser(username).currentWorld];

    let sect;

    currentWorld.map.forEach(part => {
        part.forEach(sector => {
            if ((sector.pos.x == getUser(username).pos.x) && (sector.pos.y == getUser(username).pos.y)) {
                sect = sector;
            }
        });
    });

    return sect;
}

function getKeyValuePair(obje, val, keyVal) {
    let keys = [];
    let arr = [];

    Object.keys(obje).forEach(key => {
        keys.push(key);
    });

    keys.forEach(key => {
        if (keyVal) {
            arr.push(`${obje[key][keyVal]} | ${val}: ${obje[key][val]}`)
        } else {
            arr.push(`${key} | ${val}: ${obje[key][val]}`)
        }
    })

    return arr;
}