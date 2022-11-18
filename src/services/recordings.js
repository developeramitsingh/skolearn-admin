import {  BACKEND_URL } from '../constant/constant';
import axios from '../helpers/axios';

class RecordingsService {
    static instance;

     static getInstance() {
        if (!RecordingsService.instance) {
            RecordingsService.instance = new RecordingsService();
        }

        return RecordingsService.instance;
    }

     createUserRecording(data) {
        const option = {
            url: `${BACKEND_URL}/user-recordings`,
            data,
        };

        return axios.upload(option);
    }

    updateUserRecording(data) {
        const option = {
            url: `${BACKEND_URL}/user-recordings`,
            data,
        };

        return axios.put(option);
    }

    getAllUserRecordings(query) {
        const option = {
            url: `${BACKEND_URL}/user-recordings?query=${query}`,
        };

        return axios.get(option);
    }

    getRecordingById(id) {
        const option = {
            url: `${BACKEND_URL}/user-recordings/${id}`,
        };

        return axios.get(option);
    }
}

export default RecordingsService.getInstance();

