import ApiMaster from "@/utils/ApiMaster";

const UserPermissionService = {

    async fetchUserPermission({ userID, assignedBy } = {}) {
        try {
            const params = new URLSearchParams();

            if (userID) params.append("userID", userID);
            if (assignedBy) params.append("assignedBy", assignedBy);

            const queryString = params.toString();
            const response = await ApiMaster.get(`/user-permission/getUserPermission${queryString ? `?${queryString}` : ""}`);
            return response;

        } catch (error) {
            console.error("Error fetching user permission : ", error.message);
            return [];
        }
    },

    async updateUserPermission(body) {
        try {
            const response = await ApiMaster.put(`/user-permission/updateUserPermission`, body);
            return response;
        } catch (error) {
            console.log(`Error Update User Permission: ${error.message}`);
            return [];
        }
    }
}

export default UserPermissionService