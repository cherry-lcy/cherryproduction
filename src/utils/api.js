class ApiClient {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const token = sessionStorage.getItem("token");
        if (token) {
            options.headers = {
                ...options.headers,
                "token": token
            };
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.href = "/admin/login";
                throw new Error("Unauthorized");
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Request failed");
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    }

    post(endpoint, body, isFormData = false) {
        const options = {
            method: "POST",
            body: isFormData ? body : JSON.stringify(body)
        };

        if (!isFormData) {
            options.headers = {
                "Content-Type": "application/json"
            };
        }

        return this.request(endpoint, options);
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: "DELETE" });
    }
}

const api = new ApiClient();

export default api;