import axios from "axios"

axios.defaults.baseURL = 'https://gangmin.herokuapp.com'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'https://kind-mirzakhani-4b38a2.netlify.app'
axios.defaults.headers.post['Access-Control-Allow-Credentials'] = 'true'
axios.defaults.withCredentials = true

export default axios
