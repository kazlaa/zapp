# Zapp Coding Test

## Tools

 - Express
 - React
 - Mongo
 - Docker
 - (Node v18)

## How to run

The 3 main element to run the application are in 3 folders at the root of the repository:
 - client
 - server
 - datastore

### Database
I used Mongo DB for this test which run in a docker container. To run the container :
 ```
 // from the root directory
 cd datastore
 docker-compose up
 ```

 ### Server
  ```
 // from the root directory
 cd server
 npm i
 npm run start
 ```

 ### Client
  ```
 // from the root directory
 cd client
 npm i
 npm run start
 ```

### Open the APP

http://localhost:3000

It has a navigation bar where you navigate between the upload form and the Product list

## Approach

I used Client - Server approach where I created a Rest API. The rest API handle the following request

 - POST upload : handle the csv file
 - POST product: add a new product
 - GET products : list the products (Note: the endpoint requires and offset and a limit and will return an error one is not valid)
 - GET product : get a product by sku (e.g: http://localhost:3001/product/UK-1011)
 - PUT product : update a product
 - DEL product : delete a product

 The UI can requests to these endpoint so that the user can add/edit/delete any product added.

 The API appropriate http status and with error message, when applicable, so that the UI can display

## Assumption

 - Sku are unique and products unique identifier
 - All fields are mandatory (I didn't validate on max length though)
 - Not design for mobile
