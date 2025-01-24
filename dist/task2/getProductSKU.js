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
exports.getProductSKU = getProductSKU;
const axios_1 = __importDefault(require("axios"));
const queries_1 = require("./queries");
require("dotenv").config();
const SHOPIFY_API_URL = process.env.DOMAIN_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;
const productId = process.env.PRODUCT_ID;
// TO-DO: Open this up as it's own endpoint, improve error handling and status management, create tests
function getProductSKU() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.post(SHOPIFY_API_URL, {
                query: queries_1.productQuery,
                variables: {
                    productId: `gid://shopify/Product/${productId}`,
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                },
            });
            const sku = ((_a = response.data.data.product.variants.edges[0]) === null || _a === void 0 ? void 0 : _a.node.sku) || null;
            return sku;
        }
        catch (error) {
            return null;
        }
    });
}
