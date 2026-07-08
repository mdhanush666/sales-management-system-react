import UserPermissionService from "@/services/api/UserPermissionService";

const CheckPermission = {
  async Check() {
    const loggedUserID = sessionStorage.getItem("loggedUserID");
    const response = await UserPermissionService.fetchUserPermission({ userID: loggedUserID });
    if (response && response.success) {
      return response.data[0].permissions;
    }

  }
}

export default CheckPermission;