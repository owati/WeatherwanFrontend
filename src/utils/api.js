import axios from 'axios';

export async function getNode() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/nodes?name=Node1`);
        return response.data.data[0]
    } catch (e) {
        return e.response;
    }
}