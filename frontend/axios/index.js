import axios from "axios";

// ✨ implement axiosWithAuth

export const axiosWithAuth = () => {
    const token = localStorage.getItem('token');
    return (
        axios.create({ headers: {authorization: token} })
    )
}
