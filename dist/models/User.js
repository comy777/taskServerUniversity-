"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        default: "",
        uppercase: true,
    },
    email: {
        type: String,
        required: [true, "Correo electronico requerido"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Contraseña requerida"],
        trim: true,
    },
    state: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        default: "",
    },
}, { timestamps: true });
UserSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, createdAt, updatedAt, password, state } = _a, data = __rest(_a, ["__v", "createdAt", "updatedAt", "password", "state"]);
    return data;
};
exports.default = (0, mongoose_1.model)("user", UserSchema);
