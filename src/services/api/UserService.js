import ApiMaster from "@/utils/ApiMaster";

const UserService = {

    async createUser(body) {
        try {
            const response = await ApiMaster.post("/users/createUser", body);
            return response;
        } catch (error) {
            console.log(`Error Creating User : ${error.message}`);
            return [];
        }
    },

    async fetchUser({ id, userName, statusID } = {}) {
        try {
            if (id) {
                const response = await ApiMaster.get(`/users/getUsers/${id}`);
                return response;
            }
            const params = new URLSearchParams();

            if (userName) params.append("userName", userName);
            if (statusID) params.append("statusID", statusID);

            const queryString = params.toString();
            const response = await ApiMaster.get(`/users/getUsers${queryString ? `?${queryString}` : ""}`);
            return response;

        } catch (error) {
            console.error("Error fetching categories : ", error.message);
            return [];
        }
    },
    async updateUser({ id, body }) {
        try {
            const response = await ApiMaster.put(`/users/updateUser/${id}`, body);
            return response;
        } catch (error) {
            console.log(`Error Update User : ${error.message}`);
            return [];
        }
    }
}

export default UserService