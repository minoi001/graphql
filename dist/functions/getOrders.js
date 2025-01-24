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
exports.getOrdersWithProduct = getOrdersWithProduct;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const SHOPIFY_API_URL = process.env.DOMAIN_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;
function getProductSKU(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const query = `
    query GetProduct($productId: ID!) {
      product(id: $productId) {
        variants(first: 1) {
          edges {
            node {
              sku
            }
          }
        }
      }
    }
  `;
        try {
            const response = yield axios_1.default.post(SHOPIFY_API_URL, {
                query,
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
function getOrdersWithProduct() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const createdAtMin = thirtyDaysAgo.toISOString();
        const createdAtMax = today.toISOString();
        const productId = process.env.PRODUCT_ID;
        const skuResponse = yield getProductSKU(productId);
        if (!skuResponse) {
            return {
                status: 500,
                error: "SKU not found for the specified product ID.",
            };
        }
        const sku = skuResponse;
        const query = `
  query {
    orders(first: 50, query: "sku:${sku} AND created_at:>=${createdAtMin} AND created_at:<=${createdAtMax}") {
      edges {
        node {
          id
          name
          lineItems(first: 50) {
            edges {
              node {
                id
                sku
                title
                quantity
                product {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
        try {
            const response = yield axios_1.default.post(SHOPIFY_API_URL, {
                query,
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
