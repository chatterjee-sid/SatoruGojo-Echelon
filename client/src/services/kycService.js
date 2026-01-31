import api from './api';
import axios from 'axios';
import { ML_SERVICE_URL } from '../utils/constants';

export const kycService = {
    async startApplication() {
        const response = await api.post('/api/kyc/start');
        return response.data;
    },

    async submitPersonalInfo(applicationId, personalData, behaviorData) {
        const response = await api.post(`/api/kyc/${applicationId}/personal-info`, {
            personalInfo: personalData,
            behaviorData: behaviorData,
        });
        return response.data;
    },

    async uploadDocument(applicationId, file) {
        const formData = new FormData();
        formData.append('document', file);

        const response = await api.post(`/api/kyc/${applicationId}/document`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async analyzeDocument(file) {
        const formData = new FormData();
        formData.append('document', file);

        const response = await axios.post(`${ML_SERVICE_URL}/api/analyze/document`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
        });
        return response.data;
    },

    async submitBiometric(applicationId, faceImage, livenessResult) {
        const response = await api.post(`/api/kyc/${applicationId}/biometric`, {
            faceImage: faceImage,
            livenessResult: livenessResult,
        });
        return response.data;
    },

    async getStatus(applicationId) {
        const response = await api.get(`/api/kyc/${applicationId}/status`);
        return response.data;
    },

    async getResult(applicationId) {
        const response = await api.get(`/api/kyc/${applicationId}/result`);
        return response.data;
    },

    async getApplications() {
        const response = await api.get('/api/kyc/applications');
        return response.data;
    },

    async getApplicationById(applicationId) {
        const response = await api.get(`/api/kyc/${applicationId}`);
        return response.data;
    },
};

export default kycService;
