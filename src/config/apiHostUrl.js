const API_HOST_URL = {
    local: "http://localhost:5500/api/v1",
    development: "https://sales-management-system-backend-one.vercel.app/api/v1",
    production: ""
}

const currentEnv = "development";

export default API_HOST_URL[currentEnv];