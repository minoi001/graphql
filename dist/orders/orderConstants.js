"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersQuery = exports.productQuery = void 0;
exports.productQuery = `
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
exports.ordersQuery = `query getOrders($queryString: String) {
  orders(first: 30, query: $queryString) {
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
}`;
