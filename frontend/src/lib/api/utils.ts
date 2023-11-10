export const BASE_PATH = "http://api.example.com:4000";

export function get_endpoint(endpoint: string): string {
    return `${BASE_PATH}${endpoint}`;
}