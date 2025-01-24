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
exports.getOrders = getOrders;
const axios_1 = __importDefault(require("axios"));
const queries_1 = require("./queries");
const getProductSKU_1 = require("./getProductSKU");
require("dotenv").config();
const SHOPIFY_API_URL = process.env.DOMAIN_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;
// TO-DO: Improve error handling and status management, create tests
function getOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const createdAtMin = thirtyDaysAgo.toISOString();
        const createdAtMax = today.toISOString();
        const skuResponse = yield (0, getProductSKU_1.getProductSKU)();
        if (!skuResponse) {
            return {
                status: 500,
                error: "SKU not found for the specified product ID.",
            };
        }
        const sku = skuResponse;
        try {
            const response = yield axios_1.default.post(SHOPIFY_API_URL, {
                query: queries_1.ordersQuery,
                variables: {
                    queryString: `sku:${sku} AND created_at:>=${createdAtMin} AND created_at:<=${createdAtMax}`,
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                },
            });
            const orders = response.data.data.orders.edges.map((edge) => edge.node);
            return { status: 200, data: orders };
        }
        catch (error) {
            return {
                status: 500,
                error: "Error fetching orders.",
            };
        }
    });
}
