import axios from "axios";

import { ProductResponse } from "./types";
import { productQuery } from "./queries";

require("dotenv").config();

const SHOPIFY_API_URL = process.env.DOMAIN_URL as string;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;
const productId = process.env.PRODUCT_ID;

// TO-DO: Open this up as it's own endpoint, improve error handling and status management, create tests
export async function getProductSKU(): Promise<string | null> {
  try {
    const response = await axios.post<ProductResponse>(
      SHOPIFY_API_URL,
      {
        query: productQuery,
        variables: {
          productId: `gid://shopify/Product/${productId}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      }
    );

    const sku = response.data.data.product.variants.edges[0]?.node.sku || null;
    return sku;
  } catch (error) {
    return null;
  }
}
