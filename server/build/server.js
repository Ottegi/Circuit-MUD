"use strict";

function e(e) {
    return e && "object" == typeof e && "default" in e ? e.default : e;
}

var t = e(require("fs")), r = require("net"), s = e(require("bcrypt"));

function n(e, t) {
    let r = e;
    if (t.includes("\n")) t.split("\n").forEach(e => {
        let s = 0;
        for (let t = 0; t < Math.ceil(e.length / 60); t++) s++;
        for (let n = 0; n < Math.ceil(e.length / 60) + s; n++) {
            let s = 0;
            Math.floor((60 - t.substr(0, 60).length) % 2 == 0) || (s = 1), r += "|" + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - s)) + e.substr(0, 60) + " ".repeat(Math.floor((60 - e.substr(0, 60).length) / 2 - s)) + "|\n", 
            e = e.substr(60, e.length);
        }
    }); else {
        console.log(t);
        let e = 0;
        for (let r = 0; r < Math.ceil(t.length / 60); r++) e++;
        for (let s = 0; s < Math.ceil(t.length / 60) + e; s++) {
            let e = 0;
            Math.floor((60 - t.substr(0, 60).length) / 2) % 2 != 0 && (e = 1), r += "|" + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2)) + t.substr(0, 60) + " ".repeat(Math.floor((60 - t.substr(0, 60).length) / 2 - e)) + "|\n", 
            t = t.substr(60, t.length);
        }
    }
    return r;
}

class o {
    constructor() {
        this.stories = [], this.categories = [], this.hobbies = [], this.entities = [];
    }
    Story(e) {
        let t = new a(e);
        return this.stories.push(t), t;
    }
    Category(e) {
        let t = new l(e);
        return this.categories.push(t), t;
    }
    Hobby(e) {
        let t = new c(e);
        return this.categories.push(t), t;
    }
    Action(e, t) {
        return new h(e, t);
    }
    Item(e) {
        return new u(e);
    }
}

class i {
    constructor(e) {
        this.title = e, this.body = "", this.author = "", this.footer = "";
    }
}

class a extends i {
    constructor(e) {
        super(e);
    }
    editBody(e) {
        this.body = "", Array.isArray(e) && (this.body = e.join("\n"));
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let r = e.categories.find(e => e.title == t);
            try {
                for (let e of r.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of r.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let r = "";
        return r += "-".repeat(61) + "\n", r += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        r += "-".repeat(61) + "\n", r = n(r, this.body), r += "-".repeat(61) + "\n", r;
    }
}

class l extends i {
    constructor(e) {
        super(e), this.parts = [];
    }
    addParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) {
            let r = {
                text: e[t]
            };
            this.parts.push(r);
        } else {
            let t = {
                text: e
            };
            this.parts.push(t);
        }
    }
    removeParts(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) for (let r = 0; r < this.parts.length; r++) this.parts[r].id == e[t] && this.parts.splice(r, 1); else for (let t = 0; t < this.parts.length; t++) this.parts[t].id == e && this.parts.splice(t, 1);
    }
    addHobbies(e) {
        if (Array.isArray(e)) for (let t = 0; t < e.length; t++) this.parts.push(e.title); else this.parts.push(e.title);
    }
    create(e, t) {
        if (t && null != e.categories.find(e => e.title == t)) {
            this.body = "";
            let r = e.categories.find(e => e.title == t);
            try {
                for (let e of r.parts) null != e && (this.body += e.text + "\n");
            } catch (e) {
                for (let e of r.actions) null != e && (this.body += e.name + "-" + e.description + "\n");
            }
        }
        let r = "";
        return r += "-".repeat(61) + "\n", r += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n", 
        r += "-".repeat(61) + "\n", r = n(r, this.body), r += "-".repeat(61) + "\n", r;
    }
}

class c extends i {
    constructor(e) {
        super(e), this.actions = [];
    }
    addAction(e) {
        this.actions.push(e);
    }
    executeAction(e) {
        this.actions.find(t => t.name == e).execute();
    }
}

class h {
    constructor(e, t) {
        this.name = e, this.description = t;
    }
    addLife(e) {
        this.code = e;
    }
    execute(...e) {
        e ? this.code(e) : this.code;
    }
}

class u {
    constructor(e) {
        this.name = e;
    }
}

// Modules
let d = new class {
    constructor() {
        this.events = {};
    }
    on(e, t) {
        this.events[e] = t;
    }
    listen(e, t) {
        if (!this.events.connect) throw new Error("Missing connect event binding!");
        if (!this.events.data) throw new Error("Missing data event binding!");
        if (!this.events.error) throw new Error("Missing error event binding!");
        this.server = new r.Server(e => {
            e.on("connect", () => {
                this.events.connect(e);
            }), e.on("data", t => {
                this.events.data(e, t);
            }), e.on("error", t => {
                this.events.error(e, t);
            });
        }), t ? this.server.listen(e, t) : this.server.listen(e);
    }
}, f = new class {
    file(e) {
        return t.readFileSync(e);
    }
    json(e) {
        return JSON.parse(t.readFileSync(e));
    }
}, p = new class {
    encrypt(e) {
        return s.hashSync(e, 7);
    }
    compare(e, t) {
        return s.compareSync(e, t);
    }
}, g = f.json("./config/admins.json").admins, y = f.json("./config/database.json"), b = f.json("./config/worlds.json"), m = f.json("./config/config.json").ores, w = new o, $ = w.Story("Circuit MUD");

$.editBody([ "Welcome to Circuit MUD", "Please login with command: login <username> <password> | or create using: create <username> <password>", 'Type "help" for commands' ]);

let v = w.Story("Help Menu");

v.editBody([ "Command Categories are as follows: ", "Pathways", "Communication", "Hobbies" ]);

let j = w.Category("Pathways"), M = w.Category("Communication"), x = w.Category("Hobbies"), S = w.Hobby("Mining"), k = w.Action("mine", "mines things around you");

k.addLife((...e) => {
    console.log(e);
    let t = y.users.find(t => t.username == e[0][0]), r = function(e) {
        let t;
        return b[D(e).currentWorld].map.forEach(r => {
            r.forEach(r => {
                r.pos.x == D(e).pos.x && r.pos.y == D(e).pos.y && (t = r);
            });
        }), t;
    }(t.username), s = [];
    Object.keys(r.resources).forEach(e => {
        s.push(e);
    }), s.forEach(s => {
        if (m[s].hardness <= t.tools.pickaxe && r.resources.hasOwnProperty(s) && r.resources[s].count > 0) {
            let n = Math.floor(2 * Math.random());
            r.resources[s].count - n > 0 && (t.ores[s] += n, r.resources[s].count -= n, n > 0 && A(e[0][1], `You have obtained ${s}`));
        }
    });
}), S.addAction(k);

// Crafting
let C = w.Hobby("Crafting"), E = w.Hobby("Fighting");

// Fighting
j.addParts([ "exit - Exit's the connection", "logout - Logs out of the server" ]), 
M.addParts([ "say - speaks to other players", "whisper - whispers to another player privately", "announce - speak to the whole server" ]), 
x.addParts([ "Type help <hobby> for commands on hobby" ]), x.addHobbies([ S, C, E ]);

let O = [];

function U(e) {
    for (let t of O) if (t.client == e) return t.username;
}

function A(e, t) {
    try {
        e.write(t + "\r\n");
    } catch (e) {}
}

function W(e, t) {
    if (t) switch (t.option) {
      case "world":
        O.forEach(r => {
            if (r.world == t.world) try {
                r.client.write(e + "\n");
            } catch (e) {}
            T(e + "\n");
        });
    } else O.forEach(t => {
        t = t.client;
        try {
            t.write(e + "\r\n");
        } catch (e) {}
    }), T(e + "\n");
}

function T(e) {
    t.appendFile("./config/logs.txt", e + "\n", () => {
        console.log(`Logged data => ${e}`);
    });
}

function P() {
    var e = new Date, t = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds());
    return new Date(t).toISOString();
}

function B() {
    t.writeFile("./config/database.json", JSON.stringify(y, null, 4), () => {}), t.writeFile("./config/worlds.json", JSON.stringify(b, null, 4), () => {});
}

// Autosave
function D(e) {
    return null != y.users.find(t => t.username == e) ? y.users.find(t => t.username == e) : {
        online: !1
    };
}

d.on("connect", e => {}), d.on("data", (e, r) => {
    let s, n = (r = Buffer.from(r, "utf-8").toString()).trim().split(" "), i = n[0], a = n.splice(1, n.length);
    // Login & Create System
    if ("joinGame" == i && e.write($.create() + "\r\n"), 1 == D(U(e)).online && function(e) {
        return !!g.find(t => t == e);
    }(U(e))) switch (i) {
      case "save":
        B(), W("Game has been saved. ");
    }
    if (0 == D(U(e)).online) switch (i) {
      case "login":
        if (y.users.find(e => e.username == a[0])) {
            for (let t = 0; t < y.users.length; t++) if (p.compare(a[1], y.users[t].password)) {
                D(U(e)).online = !0;
                let t = w.Story("Logged in");
                t.editBody([ "Username: " + a[0] ]), A(e, t.create()), O.find(t => t.username == U(e)) || O.push({
                    username: a[0],
                    client: e,
                    world: D(a[0]).currentWorld
                }), W(`User [${U(e)}] has connected to the server! \n${O.length} users are online | ${P()}`);
            }
            0 == D(U(e)).online && A(e, "You have used the wrong credentials. Please try again. ");
        } else A(e, "That user does not exist. Please create an account. ");
        break;

      case "create":
        if (y.users.find(e => e.username == a[0])) A(e, "That user exists"); else {
            let r = {
                username: a[0],
                password: p.encrypt(a[1]),
                ores: {
                    coal: 0,
                    iron: 0,
                    gold: 0,
                    titanium: 0,
                    uranium: 0,
                    copper: 0,
                    aluminum: 0,
                    tin: 0,
                    silver: 0,
                    lead: 0,
                    zinc: 0,
                    platinum: 0,
                    palladium: 0,
                    nickel: 0
                },
                lastMined: Date.now(),
                tools: {
                    pickaxe: 1,
                    axe: 1,
                    hoe: 1,
                    spade: 1
                },
                currentWorld: "Cyber City",
                pos: {
                    x: 5,
                    y: 0
                },
                online: !0
            };
            y.users.push(r), t.writeFile("./config/database.json", JSON.stringify(y, 4, null), () => {});
            let n = w.Story("Created User");
            n.editBody([ "Username: " + r.username, "Password: " + r.password ]), A(e, n.create()), 
            loggedIn = !0, O.find(e => e.username == s) || O.push({
                username: a[0],
                client: e,
                world: "main"
            }), W(`[${U(e)}] has connected to the server for the first time! Please welcome them! \n${O.length} users are online | ${P()}`);
        }

      case "exit":
        e.end();
    }
    if (1 == D(U(e)).online) switch (T(`${U(e)} executed: ${i}:${a.join(" ")}`), console.log(`"${i}"`), 
    i) {
      case "exit":
        e.end();
        break;

      case "help":
        A(e, a ? v.create(w, a) : v.create());
        break;

      case "joinWorld":
        for (let t of Object.keys(b)) if (t == a.join(" ")) {
            b[t].map.forEach(t => {
                t.forEach(t => {
                    t.pos.x == D(U(e)).pos.x && t.pos.y == D(U(e)).pos.y && (W(`${D(U(e)).username} has left ${D(U(e)).currentWorld}`, {
                        option: "world",
                        world: D(U(e)).currentWorld
                    }), D(U(e)).currentWorld = a.join(" "), O.find(e => e.username == s).world = a.join(" "), 
                    W(`${D(U(e)).username} has joined ${D(U(e)).currentWorld}`, {
                        option: "world",
                        world: D(U(e)).currentWorld
                    }));
                });
            });
        }
        break;

      case "logout":
        loggedIn = !1, s = null, A(e, "Logged out successfully!");
        break;

      case "say":
        W(`{${D(U(e)).currentWorld}} [${U(e)}]: ${a.join(" ")} ${P()}`, {
            option: "world",
            world: D(U(e)).currentWorld
        }), T(`Message Sent: {${D(U(e)).currentWorld}} [${U(e)}]: ${a.join(" ")} ${P()}`);
        break;

      case "announce":
        W(`Announcement > [${U(e)}]: ${a.join(" ")} ${P()}`), T(`Message Announced: [${U(e)}]: ${a.join(" ")} ${P()}`);
        break;

      case "mine":
        Date.now() - D(U(e)).lastMined >= 5e3 ? (k.execute(U(e), e), D(U(e)).lastMined = Date.now()) : A(e, "You can't mine right now, please wait " + Math.floor((5e3 - (Date.now() - D(U(e)).lastMined)) / 1e3) + " seconds");
        break;

      case "stats":
        let t = w.Story("Stats");
        t.editBody(function(e, t, r) {
            let s = [], n = [];
            return Object.keys(e).forEach(e => {
                s.push(e);
            }), s.forEach(s => {
                t ? r ? n.push(`${e[s][r]} | ${t}: ${e[s][t]}`) : n.push(`${s} | ${t}: ${e[s][t]}`) : r ? n.push(`${e[s][r]}: ${e[s]}`) : n.push(`${s}: ${e[s]}`);
            }), n;
        }(D(U(e)).ores)), A(e, t.create());
        break;

      case "go":
        let r, n;
        switch (a[0]) {
          case "north":
            n = -1;
            break;

          case "east":
            r = 1;
            break;

          case "south":
            n = 1;
            break;

          case "west":
            r = -1;
        }
        let i = D(U(e)).pos;
        i.x + r >= 0 && i.x + r < 10 && (i.y += r), i.y + n >= 0 && i.y + n < 10 && (i.y += n), 
        B();
        break;

      case "online":
        if (a) {
            let t;
            switch (a[0]) {
              case "server":
                t = w.Story("Online users in Server"), t.editBody([ `Total Users: ${O.length}` ].concat(O.map(e => e.username))), 
                A(e, t.create());
                break;

              case "world":
                t = w.Story("Online users in World");
                let r = [];
                O.forEach(t => {
                    t.world == D(U(e)).currentWorld && r.push(t.username);
                }), t.editBody([ `Total Users: ${r.length}` ].concat(r)), A(e, t.create());
            }
        } else {
            let t = o.Story("Online users in Server");
            t.editBody([ `Total Users: ${O.length}` ].concat(O)), A(e, t.create());
        }
    }
}), d.on("error", (e, t) => {
    t && console.log(t);
}), d.on("end", e => {
    let t = U(e);
    if (t) {
        for (let e = 0; e < O.length; e++) {
            O[e].username == t && O.splice(e, 1);
        }
        D(U(e)).online = !1, W(`[${U(e)}] has left the server. ${O.length} users remaining`);
    }
}), setInterval(() => {
    t.writeFile("./config/database.json", JSON.stringify(y, null, 4), () => {}), t.writeFile("./config/worlds.json", JSON.stringify(b, null, 4), () => {}), 
    W("Game has been saved!");
}, 3e5), setInterval(() => {
    for (let e of Object.keys(b)) {
        let t = b[e];
        t.map.forEach(e => {
            e.forEach(e => {
                Object.values(e.resources).forEach(e => {
                    e.count += Math.floor(10 * Math.random());
                });
            });
        }), W(`${e} has been regenerated! Start finding ore!`, {
            option: "world",
            world: t
        });
    }
    B();
}, 149400), d.listen(process.argv[2], () => {
    console.log(`listening on port ${process.argv[2]}`);
});
