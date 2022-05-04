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
const TaskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        default: "",
        uppercase: true,
    },
    body: {
        type: String,
        default: "",
    },
    lesson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "lesson",
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
    },
    state: {
        type: Boolean,
        default: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    images: {
        type: Array,
        image: {
            url: String,
        },
        default: [],
    },
    dayLimit: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true });
TaskSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, created, state, user } = _a, data = __rest(_a, ["__v", "created", "state", "user"]);
    return data;
};
exports.default = (0, mongoose_1.model)("task", TaskSchema);
