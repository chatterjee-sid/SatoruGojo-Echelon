import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Uvicorn default
    timeout: 5000,
});

export interface HistoricalThreat {
    time: string;
    threats: number;
}

export const fetchHistory = async (): Promise<HistoricalThreat[]> => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error('API Error: fetchHistory failed', error);
        throw error;
    }
};

export default api;
