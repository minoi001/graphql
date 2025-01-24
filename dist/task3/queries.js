"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allProductsQuery = void 0;
// TO-DO: Paginate to collect more than 100 products
exports.allProductsQuery = `
   query {
  products(first: 250) {
    edges {
      node {
        id
        title
        handle
        description
        createdAt
        updatedAt
        vendor
        productType
        tags
        variants(first: 250) {
          edges {
            node {
              id
              title
              sku
              price
              inventoryQuantity
            }
          }
        }
      }
    }
  }
}
  `;
