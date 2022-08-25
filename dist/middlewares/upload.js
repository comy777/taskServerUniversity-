"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadValidate = void 0;
const uploadValidate = (req, res, next) => {
    console.log(req);
    if (req.file) {
        console.log(req.file);
        return;
    }
    next();
};
exports.uploadValidate = uploadValidate;
