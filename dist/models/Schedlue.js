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
const validate_1 = require("../middlewares/validate");
const SchedlueSchema = new mongoose_1.Schema({
    day: {
        type: String,
        required: [true, "El dia es requerido"],
        uppercase: true,
        enum: validate_1.days,
        default: "LUNES",
    },
    schedlue: {
        type: [String],
        required: [true, "El horario es requerido"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "El usuario es requerido"],
    },
}, {
    timestamps: true,
});
SchedlueSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, user, createdAt, updatedAt } = _a, data = __rest(_a, ["__v", "user", "createdAt", "updatedAt"]);
    return data;
};
exports.default = (0, mongoose_1.model)("schedlue", SchedlueSchema);
