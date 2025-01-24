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
const express_1 = __importDefault(require("express"));
const getOrders_1 = require("./task2/getOrders");
const sendEmail_1 = require("./task3/sendEmail");
const node_persist_1 = __importDefault(require("node-persist"));
const getAllProducts_1 = require("./task3/getAllProducts");
const checkPriceChange_1 = require("./task3/checkPriceChange");
const runOnFirstLoad = () => __awaiter(void 0, void 0, void 0, function* () {
    yield node_persist_1.default.init();
    const hasRunBefore = yield node_persist_1.default.getItem("hasRunBefore");
    if (!hasRunBefore) {
        yield node_persist_1.default.setItem("hasRunBefore", true);
        const allProducts = yield (0, getAllProducts_1.getAllProducts)();
        yield node_persist_1.default.setItem("allProducts", allProducts);
    }
});
runOnFirstLoad();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, getOrders_1.getOrders)();
    res.status(response.status).json({
        message: "Orders",
        data: response.data,
        error: response.error,
    });
}));
app.post("/productUpdate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productInformation = req.body;
    const allProducts = yield node_persist_1.default.getItem("allProducts");
    const updateProducts = yield (0, getAllProducts_1.getAllProducts)();
    yield node_persist_1.default.setItem("allProducts", updateProducts);
    const { priceDecreased, newPrice, oldPrice, decreasePercentage, title } = (0, checkPriceChange_1.checkPriceChange)(productInformation, allProducts);
    if (priceDecreased) {
        const emailSent = yield (0, sendEmail_1.sendEmail)({
            to: "imogen.minoli@gmail.com",
            // TO-DO: round decreasePercentage to 0 decimal places or nearest 10
            subject: `${title} has decreased in price by ${decreasePercentage}%!`,
            // TO-DO: style email
            text: `The price has decreased from ${oldPrice} to ${newPrice}`,
        });
        if (!emailSent) {
            res.status(400).json({
                message: "Price decreased",
                error: "Email failed to send",
            });
        }
        res.status(200).json({ message: "Price decreased" });
    }
    else {
        res.status(200).json({ message: "Price did not decrease" });
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
