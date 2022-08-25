"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyC_QGHYp5-glWRiKhB28xYb0Uz454A0j98",
    authDomain: "task-university.firebaseapp.com",
    projectId: "task-university",
    storageBucket: "task-university.appspot.com",
    messagingSenderId: "225995344554",
    appId: "1:225995344554:web:3f9881a38da0bb0e7d1ed3",
    measurementId: "G-99KYWGPRW5",
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.storage = (0, storage_1.getStorage)(app);
