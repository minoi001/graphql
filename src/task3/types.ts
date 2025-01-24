export interface ProductsResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          createdAt: string;
          updatedAt: string;
          vendor: string;
          productType: string;
          tags: string[];
          variants: {
            edges: {
              node: {
                id: string;
                title: string;
                sku: string;
                price: string;
                inventoryQuantity: number;
              };
            }[];
          };
        };
      }[];
    };
  };
}

export interface OldProduct {
  id: string;
  title: string;
  handle: string;
  variants: { edges: { node: { id: string; price: number } }[] };
}

export interface NewProduct {
  admin_graphql_api_id: string;
  title: string;
  handle: string;
  variants: { id: string; price: number }[];
}
