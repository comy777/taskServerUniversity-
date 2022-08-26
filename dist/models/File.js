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
const FileSchema = new mongoose_1.Schema({
    filename: {
        type: String,
        required: [true, "El nombre del archivo es requerido"],
    },
    file: {
        type: String,
        required: [true, "La url del archivo es requerida"],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "El usuario es requerido"],
    },
    lesson: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "lesson",
        required: [true, "La clase es requerida"],
    },
    state: {
        type: Boolean,
        default: true,
    },
    refFile: {
        type: String,
        required: [true, "La referencia es requerida"],
    },
    type: {
        type: String,
    },
    image: {
        type: String,
        default: "",
    },
}, { timestamps: true });
FileSchema.index({ filename: "text", file: "text" });
FileSchema.methods.toJSON = function () {
    const _a = this.toObject(), { __v, state, user } = _a, data = __rest(_a, ["__v", "state", "user"]);
    return data;
};
exports.default = (0, mongoose_1.model)("file", FileSchema);
