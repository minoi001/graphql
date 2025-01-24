"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPriceChange = checkPriceChange;
require("dotenv").config();
const SHOPIFY_API_URL = process.env.DOMAIN_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;
function checkPriceChange(productInformation, allProducts) {
    var _a, _b;
    if (!productInformation || !allProducts) {
        return { priceDecreased: false };
    }
    const newProduct = productInformation;
    const newPrice = Number(newProduct.variants[0].price);
    const oldProduct = allProducts.find((product) => product.id === newProduct.admin_graphql_api_id);
    const oldPrice = Number((_b = (_a = oldProduct === null || oldProduct === void 0 ? void 0 : oldProduct.variants) === null || _a === void 0 ? void 0 : _a.edges[0]) === null || _b === void 0 ? void 0 : _b.node.price);
    const decreasePercentage = ((oldPrice - newPrice) / oldPrice) * 100;
    if (decreasePercentage > 20) {
        console.log("price decreased");
        return {
            priceDecreased: true,
            newPrice: newPrice,
            oldPrice: oldPrice,
            decreasePercentage: decreasePercentage,
            title: newProduct.title,
        };
    }
    return { priceDecreased: false };
}
