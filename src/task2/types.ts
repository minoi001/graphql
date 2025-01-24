export interface Order {
  id: string;
  name: string;
  lineItems: {
    edges: {
      node: {
        id: string;
        sku: string | null; // Product SKU
        product: {
          id: string | null;
        } | null;
      };
    }[];
  };
}

export interface OrdersResponse {
  data: {
    orders: {
      edges: {
        node: Order;
      }[];
    };
  };
}

export interface ProductResponse {
  data: {
    product: {
      variants: {
        edges: {
          node: {
            sku: string;
          };
        }[];
      };
    };
  };
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}
