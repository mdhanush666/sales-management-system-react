import ApiMaster from "@/utils/ApiMaster";

const OrderService = {

    async createOrder(body) {
        try {
            const response = await ApiMaster.post("/order/createOrder", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Order : ${error.message}`);
            return [];
        }
    },

    async fetchOrder({ orderCode, cartID, customerID, salesRepID, statusID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/order/getOrder/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (orderCode) params.append("orderCode", orderCode);
            if (cartID) params.append("cartID", cartID);
            if (customerID) params.append("customerID", customerID);
            if (salesRepID) params.append("salesRepID", salesRepID);
            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/order/getOrder${queryString ? `?${queryString}` : ""}`
            );
            return response;
        } catch (error) {
            console.error("Error fetching order : ", error.message);
            return [];
        }
    },

    async updateOrder({ id, body }) {
        try {
            const response = await ApiMaster.put(`/order/updateOrder/${id}`, body);
            return response;
        } catch (error) {
            console.log(`Error Update Order : ${error.message}`);
            return [];
        }
    }

};

export default OrderService;