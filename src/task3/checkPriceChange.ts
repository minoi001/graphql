import { NewProduct, OldProduct } from "./types";

require("dotenv").config();

const SHOPIFY_API_URL = process.env.DOMAIN_URL as string;
const SHOPIFY_ACCESS_TOKEN = process.env.ADMIN_TOKEN;

export function checkPriceChange(
  productInformation: NewProduct,
  allProducts: Array<OldProduct>
): {
  priceDecreased: boolean;
  newPrice?: number;
  oldPrice?: number;
  decreasePercentage?: number;
  title?: string;
} {
  if (!productInformation || !allProducts) {
    return { priceDecreased: false };
  }
  const newProduct = productInformation;
  const newPrice = Number(newProduct.variants[0].price);

  const oldProduct = allProducts.find(
    (product) => product.id === newProduct.admin_graphql_api_id
  );
  const oldPrice = Number(oldProduct?.variants?.edges[0]?.node.price);

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
