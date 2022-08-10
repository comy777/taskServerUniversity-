"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchedule = exports.deleteSchedlueLesson = exports.saveSchedlueLesson = exports.deleteImage = exports.uploadImageCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const Schedlue_1 = __importDefault(require("../models/Schedlue"));
const Schedlue_2 = __importDefault(require("../models/Schedlue"));
cloudinary_1.default.v2.config(process.env.CLOUDINARY_URL);
const uploadImageCloudinary = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const extensionsValid = ["png", "jpg", "jpeg"];
    const { name, tempFilePath } = image;
    const nameExtension = name.split(".");
    const extension = nameExtension[nameExtension.length - 1];
    if (!extensionsValid.includes(extension))
        return;
    return yield cloudinary_1.default.v2.uploader.upload(tempFilePath, {
        upload_preset: process.env.UPLOAD_PRESET,
    });
});
exports.uploadImageCloudinary = uploadImageCloudinary;
const deleteImage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const public_id = id.trim();
    try {
        yield cloudinary_1.default.v2.uploader.destroy(`Notes/${public_id}`);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.deleteImage = deleteImage;
const saveSchedlueLesson = (schedlue, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (schedlue.length === 0)
        return;
    schedlue.forEach((item, i) => __awaiter(void 0, void 0, void 0, function* () {
        const { day, hours } = item;
        const query = { user, day };
        const dataSchedule = yield Schedlue_2.default.find(query);
        if (dataSchedule.length > 0) {
            const { _id, schedlue } = dataSchedule[0];
            if (schedlue.includes(hours))
                return;
            yield Schedlue_2.default.findByIdAndUpdate(_id, {
                day,
                schedlue: [...schedlue, hours],
            });
        }
        else {
            const saveSchedlue = new Schedlue_2.default({ day, schedlue: hours, user });
            yield saveSchedlue.save();
        }
    }));
});
exports.saveSchedlueLesson = saveSchedlueLesson;
const deleteSchedlueLesson = (schedlue, user) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { user };
    const data = yield Schedlue_2.default.find(query);
    data.forEach((item) => {
        schedlue.forEach((j) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.day === j.day.toUpperCase()) {
                const { hours } = j;
                const { schedlue, _id } = item;
                if (schedlue.includes(hours)) {
                    const resp = schedlue.filter((i) => i !== hours);
                    yield Schedlue_2.default.findByIdAndUpdate(_id, { schedlue: resp });
                }
            }
        }));
    });
});
exports.deleteSchedlueLesson = deleteSchedlueLesson;
const orderSchedule = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    let bandera = false;
    data.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id, schedlue } = item;
        if (schedlue) {
            if (schedlue.length === 0) {
                yield Schedlue_1.default.findByIdAndDelete(_id);
                bandera = true;
            }
        }
    }));
    let arr = [];
    if (bandera) {
        const dataApi = yield Schedlue_1.default.find({ user });
        const dataNew = dataSchedule(dataApi);
        arr = dataNew;
    }
    else {
        const dataNew = dataSchedule(data);
        arr = dataNew;
    }
    const orden = arr.sort((a, b) => {
        if (a.index < b.index)
            return -1;
        return 1;
    });
    const schedlue = orden.map((data) => {
        const { item } = data;
        const { _id, day, schedlue } = item;
        return { _id, day, schedlue };
    });
    return schedlue;
});
exports.orderSchedule = orderSchedule;
const dataSchedule = (data) => {
    const arr = [];
    data.forEach((item, i) => {
        if (item.day === "LUNES") {
            arr[i] = { item, index: 0 };
            return;
        }
        if (item.day === "MARTES") {
            arr[i] = { item, index: 1 };
            return;
        }
        if (item.day === "MIERCOLES") {
            arr[i] = { item, index: 2 };
            return;
        }
        if (item.day === "JUEVES") {
            arr[i] = { item, index: 3 };
            return;
        }
        if (item.day === "VIERNES") {
            arr[i] = { item, index: 4 };
            return;
        }
        if (item.day === "SABADO") {
            arr[i] = { item, index: 5 };
            return;
        }
    });
    return arr;
};
