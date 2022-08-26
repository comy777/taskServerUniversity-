"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: [true, "Token requerido"],
    },
    expires: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        required: [true, "Fecha de creacion requerida"],
    },
});
exports.default = (0, mongoose_1.model)("token", TokenSchema);
