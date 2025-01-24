import express from "express";
import { getOrders } from "./task2/getOrders";
import { sendEmail } from "./task3/sendEmail";
import storage from "node-persist";
import { getAllProducts } from "./task3/getAllProducts";
import { checkPriceChange } from "./task3/checkPriceChange";

const runOnFirstLoad = async () => {
  await storage.init();

  const hasRunBefore = await storage.getItem("hasRunBefore");

  if (!hasRunBefore) {
    await storage.setItem("hasRunBefore", true);
    const allProducts = await getAllProducts();
    await storage.setItem("allProducts", allProducts);
  }
};

runOnFirstLoad();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/orders", async (req, res) => {
  const response = await getOrders();
  res.status(response.status).json({
    message: "Orders",
    data: response.data,
    error: response.error,
  });
});

app.post("/productUpdate", async (req, res) => {
  const productInformation = req.body;
  const allProducts = await storage.getItem("allProducts");
  const updateProducts = await getAllProducts();
  await storage.setItem("allProducts", updateProducts);

  const { priceDecreased, newPrice, oldPrice, decreasePercentage, title } =
    checkPriceChange(productInformation, allProducts);

  if (priceDecreased) {
    const emailSent = await sendEmail({
      to: process.env.SMTP_USER as string,
      // TO-DO: round decreasePercentage to 0 decimal places or nearest 10
      subject: `${title} has decreased in price by ${decreasePercentage}%!`,
      // TO-DO: style email
      text: `The price has decreased from ${oldPrice} to ${newPrice}`,
    });
    if (!emailSent) {
      res.status(400).json({
        message: "Price decreased",
        error: "Email failed to send",
      });
    }
    res.status(200).json({ message: "Price decreased" });
  } else {
    res.status(200).json({ message: "Price did not decrease" });
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
