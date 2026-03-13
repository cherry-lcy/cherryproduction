class ApiClient {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const token = sessionStorage.getItem("token");
        
        const headers = {};
        
        if (token) {
            headers["token"] = token;
        }
        
        if (!options.isFormData && !options.headers?.['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        
        options.headers = {
            ...headers,
            ...options.headers
        };

        if (options.isFormData) {
            delete options.headers['Content-Type'];
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                sessionStorage.removeItem("token");
                window.location.href = "/admin/login";
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return data;
            } else {
                return response;
            }
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    }

    post(endpoint, body, options = {}) {
        const { isFormData = false, ...restOptions } = options;
        
        const fetchOptions = {
            method: "POST",
            ...restOptions
        };

        if (isFormData) {
            fetchOptions.body = body;
            fetchOptions.isFormData = true;
        } else {
            fetchOptions.body = JSON.stringify(body);
        }

        return this.request(endpoint, fetchOptions);
    }

    put(endpoint, body, options = {}) {
        const { isFormData = false, ...restOptions } = options;
        
        const fetchOptions = {
            method: "PUT",
            ...restOptions
        };

        if (isFormData) {
            fetchOptions.body = body;
            fetchOptions.isFormData = true;
        } else {
            fetchOptions.headers = {
                "Content-Type": "application/json",
                ...restOptions.headers
            };
            fetchOptions.body = JSON.stringify(body);
        }

        return this.request(endpoint, fetchOptions);
    }

    delete(endpoint, body = null) {
        const options = {
            method: "DELETE"
        };

        if (body) {
            options.headers = {
                "Content-Type": "application/json"
            };
            options.body = JSON.stringify(body);
        }

        return this.request(endpoint, options);
    }
    
    upload(endpoint, formData, options = {}) {
        return this.post(endpoint, formData, {
            ...options,
            isFormData: true
        });
    }
}

const api = new ApiClient();
export default api;