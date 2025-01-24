import axios from "axios";
import { allProductsQuery } from "./queries";
import { ProductsResponse } from "./types";

require("dotenv").config();

const SHOPIFY_API_URL = process.env.DOMAIN_URL as string;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;

export async function getAllProducts(): Promise<any[] | null> {
  try {
    const response = await axios.post<ProductsResponse>(
      SHOPIFY_API_URL,
      {
        query: allProductsQuery,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
      }
    );

    const products =
      response.data.data?.products?.edges.map((edge) => edge.node) || null;

    return products;
  } catch (error) {
    return null;
  }
}
