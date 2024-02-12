export const Constant = {
    API_END_POINT:'http://localhost:8080/',
    METHODS: {
        GET_ALL_PRODUCT: 'GetAllProducts',
        GET_ALL_CATEGORY: 'GetAllCategory',
        GET_ALL_PRODUCT_BY_CATEGORY: 'GetAllProductsByCategoryId/',

        CREATE_PRODUCT: 'CreateProduct',
        UPDATE_PRODUCT: 'UpdateProduct',
        DELETE_PRODUCT: 'DeleteProductById/',
        UPDATE_CATEGORY: 'UpdateCategory/',
        DELETE_CATEGORY: 'DeleteCategoryById/',
        ADD_TO_CART: "AddToCart",
        GET_CART_BY_CUST:  "GetCartByCustomerId/" ,
        REMOVE_CART:  "RemoveFromCart/",
        LOGIN:  "Login",
        REGISTER: "Register",
        PLACE_ORDER: 'PlaceOrder',
        GET_ALL_OFFERS: 'GetAllOffers',
        CREATE_NEW_OFFER: 'CreateNewOffer',
        GET_CUSTOMER_BY_ID: 'GetCustomerById?id=',
        UPDATE_PROFILE: 'UpdateProfile',
        GET_ALL_SALE_BY_CUSTOMER_ID: 'GetAllSaleByCustomerId/',
        CANCEL_ORDER_BY_SALE_ID: 'cancelOrder?saleId='

    }
}