import ApiMaster from "@/utils/ApiMaster";

const CartItemService = {
    async fetchCartItem({ cartID, productID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/cartItem/getCartItem/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (cartID) params.append("cartID", cartID);
            if (productID) params.append("productID", productID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/cartItem/getCartItem${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching cart item : ", error.message);
            return [];
        }
    },
};

export default CartItemService;