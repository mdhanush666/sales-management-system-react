import ApiMaster from "@/utils/ApiMaster";

const CartService = {
    async createCart(body) {
        try {
            const response = await ApiMaster.post("/cart/createCart", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Cart : ${error.message}`);
            return [];
        }
    },
    async fetchCart({ customerID, salesRepID, statusID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/cart/getCart/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (customerID) params.append("customerID", customerID);
            if (salesRepID) params.append("salesRepID", salesRepID);
            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/cart/getCart${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching cart : ", error.message);
            return [];
        }
    },
};

export default CartService;