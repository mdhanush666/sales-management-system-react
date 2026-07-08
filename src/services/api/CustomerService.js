import ApiMaster from "@/utils/ApiMaster";

const CustomerService = {
    async fetchCustomers({ customerCode, salesRepID, statusID, id } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/customer/getCustomer/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (customerCode) params.append("customerCode", customerCode);
            if (salesRepID) params.append("salesRepID", salesRepID);
            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(
                `/customer/getCustomer${queryString ? `?${queryString}` : ""}`
            );

            return response;

        } catch (error) {
            console.error("Error fetching customers : ", error.message);
            return [];
        }
    },
    async createCustomer(body) {
        try {
            const response = await ApiMaster.post("/customer/createCustomer", body);
            return response;
        } catch (error) {
            console.log(`Error Creating Customer : ${error.message}`);
            return [];
        }
    },
    async updateCustomer({ id, body }) {
        try {
            const response = await ApiMaster.put(`/customer/updateCustomer/${id}`, body);
            return response;
        } catch (error) {
            console.log(`Error Update Customer : ${error.message}`);
            return [];
        }
    }
};

export default CustomerService;