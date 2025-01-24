import axios from "axios";

import { ApiResponse, Order, OrdersResponse } from "./types";
import { ordersQuery } from "./queries";
import { getProductSKU } from "./getProductSKU";

require("dotenv").config();

const SHOPIFY_API_URL = process.env.DOMAIN_URL as string;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;

// TO-DO: Improve error handling and status management, create tests
export async function getOrders(): Promise<ApiResponse<Order[]>> {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const createdAtMin = thirtyDaysAgo.toISOString();
  const createdAtMax = today.toISOString();

  const skuResponse = await getProductSKU();
  if (!skuResponse) {
    return {
      status: 500,
      error: "SKU not found for the specified product ID.",
    };
  }

  const sku = skuResponse;

  try {
    const response = await axios.post<OrdersResponse>(
      SHOPIFY_API_URL,
      {
        query: ordersQuery,
        variables: {
          queryString: `sku:${sku} AND created_at:>=${createdAtMin} AND created_at:<=${createdAtMax}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      }
    );

    const orders = response.data.data.orders.edges.map((edge) => edge.node);
    return { status: 200, data: orders };
  } catch (error) {
    return {
      status: 500,
      error: "Error fetching orders.",
    };
  }
}
