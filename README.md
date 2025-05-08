# Jootci Web
A Next-JS ecommerce website for farmers in Senegal

## Setting up your dev environment

### Pre-requesites

Install Postgres
https://www.postgresql.org/download/

Set your credentials

- Set your Auth.js token by running `npx auth secret`
- Create [PayPal](https://developer.paypal.com/) token and set them in .env.local
- Create [uploadthing](https://uploadthing.com/) token and set them in .env.local

## Setup

### Install dependencies
```
npm run install
```

### Init DB
```
npm run db:init-schema
npm run db:seed
```

### Run the app
```
npm run dev
```