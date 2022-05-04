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
const LessonSchema = new mongoose_1.Schema({
    lesson: {
        type: String,
        uppercase: true,
        required: [true, "Nombre requerido"],
    },
    state: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    nrc: {
        type: Number,
        required: [true, "NRC requerido"],
    },
    teacher: {
        type: String,
        default: "",
        uppercase: true,
    },
    schedlue: {
        type: Array,
        default: [{ day: String, hours: String }],
    },
}, {
    timestamps: true,
});
LessonSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, created, state, user } = _a, data = __rest(_a, ["__v", "created", "state", "user"]);
    return data;
};
exports.default = (0, mongoose_1.model)("lesson", LessonSchema);
