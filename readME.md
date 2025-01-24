# Interview Task Project

This project contains three Shopify-based tasks to demonstrate a liquid snippet, order retrieval and webhook handling. Below are step-by-step instructions to set up and test each task.

## Contents

- [Prerequisites](#prerequisites)
- [View Live Theme](#task-1-live-theme)
- [Setting Up the Project (Tasks 2 and 3)](#setting-up-the-project-tasks-2-and-3)
- [Running the Project](#running-the-project-tasks-2-and-3)
- [Tunnel Setup for Webhook Testing](#task-3-tunnel-setup-for-webhook-testing)
- [Testing Instructions](#testing-instructions)

## Prerequisites

- Node.js installed
- Access to a Shopify store with admin privileges
- Gmail account for SMTP setup
- Pinggy or an alternative tunneling tool installed

## Task 1: Live Theme

This task is showcased on a live theme. Use the following credentials and link to access it:

- **Password to enter the store**: Imogen
- **Live link**: [Apollo Wearable Rose Product](https://imogensdev.myshopify.com/products/apollo-wearable-rose)

### Testing

- Switch between variant options to show or hide the sale badge, depending on whether the variant is on sale.

## Setting Up the Project (Tasks 2 and 3)

### 1. Clone the Repository

### 2. Install Dependencies

Navigate to the root directory of the project and install the necessary dependencies by running:

```sh
npm install
```

### 3. Create a .env File

In the root folder of the project, create a `.env` file with the following variables:

```env
# Shopify Credentials
DOMAIN_URL=https://<yourstore>.myshopify.com/admin/api/2025-01/graphql.json
ADMIN_TOKEN=shpat_<yourtoken>

# Product Information
PRODUCT_ID=<yourlegacyproductID>

# Email Credentials
SMTP_USER=<yourgmail>@gmail.com
SMTP_PASS=<yourgmailapppassword>
SMTP_HOST=smtp.gmail.com
```

Replace `<yourstore>`, `<yourtoken>`, `<yourlegacyproductID>`, `<yourgmail>`, and `<yourgmailapppassword>` with your actual credentials and information.

### 4. Shopify Credentials

To obtain `DOMAIN_URL` and `ADMIN_TOKEN`:

1. Log in to your Shopify Admin.
2. Navigate to **Apps > Develop apps > Create an app**.
3. Configure API scopes `read_orders` and `read_products` and copy the **Admin API token**.
4. Replace `DOMAIN_URL` and `ADMIN_TOKEN` in your `.env` file.

### 5. Additional Configuration

- **Task 2 Only:**

  - Select a product from your Shopify store, get its legacy ID, and update the `PRODUCT_ID` in the `.env` file.

- **Task 3 Only:**
  - Generate a Gmail App Password for `SMTP_USER`. Follow these steps: [How to Get a Gmail App Password](https://support.google.com/accounts/answer/185833?hl=en).

## Running the Project (Tasks 2 and 3)

Choose from the following scripts to run the project:

- `npm run compile`: Watches and compiles TypeScript files into JavaScript.
- `npm run launch`: Executes the compiled app.
- `npm start`: Runs both compilation and execution concurrently.

```json
{
  "scripts": {
    "compile": "npx tsc --watch",
    "launch": "node dist/app.js",
    "start": "concurrently \"npx tsc\" \"node dist/app.js\""
  }
}
```

Note, you will need to restart the app if you make changes.

## Task 3: Tunnel Setup for Webhook Testing

### 1. Start a Tunnel

Use Pinggy to create a tunnel for webhook testing. Follow the instructions in the [Pinggy Quickstart for Shopify](https://pinggy.io/quickstart/shopify/#:~:text=With%20pinggy.io%20you%20can,localhost%3A3000%2Fwebhooks).

Run the following command in your terminal (or the command provided by Pinggy):

```sh
ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:3000 a.pinggy.io
```

Copy the `https` URL returned by Pinggy.

### 2. Create a Product Update Webhook

1. Go to **Shopify Admin > Settings > Notifications**.
2. Create a webhook for `product/update` events using version `2025-01 (Latest)`.
3. Use the `https` URL from Pinggy as the webhook destination, appending `/productUpdate` to the end of the URL.

**Note:** The Pinggy URL is valid for only 1 hour. You will need to repeat the tunnel setup steps and update the webhook URL accordingly.

## Testing Instructions

### Task 2

1. Open <http://localhost:3000/orders> in your browser.
2. View the JSON output of orders from the last 30 days that include the product specified in your `.env`.

### Task 3

1. Decrease the price of a product in your connected Shopify store by at least 20%.
2. Check your email (that you specified in the .env). You should receive a notification about the price update.
3. Verify a `200 OK` request appears in your Pinggy terminal when the product is updated.
