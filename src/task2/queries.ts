export const productQuery = `
    query getProduct($productId: ID!) {
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

// TO-DO: Paginate to collect more than 100 orders
export const ordersQuery = `query getOrders($queryString: String) {
  orders(first: 100, query: $queryString) {
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
