# api_rest_heroku

### Build your tiny REST API store.
You can choose the target of your business, be creative!.
**Examples:** snack store, pet store, drug store.

## Technical requirements
* POSTGRESQL
* Expressjs
* Typescript
* Jest
* Prettier
* Eslint

## Mandatory features
1. Authentication endpoints (sing up, sing in, sign out)
2. List products with pagination
3. Search products by category
4. Add 2 kind of users (Manager, Client)
5. As a Manager I can:
    * Create products
    * Update products
    * Delete products
    * Disable products
    * Show clients orders
    * Upload images per product.
6. As a Client I can:
    * See products 
    * See the product details
    * Buy products
    * Add products to car
    * Like products
    * Show my order
7. The product information(included the images) should be visible for logged and not logged users
8. swagger/postman documentation
9. Tests, at least a coverage of 80% 

## Extra points
* When the stock of a product reaches 3, notify the last user that liked it and not purchased the product yet with an email. Use a background job and make sure to include the product's image in the email.
* Add forgot password functionality.
* Send an email when the user change the password
* Deploy on Heroku
```