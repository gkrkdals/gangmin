import axios from "axios"

axios.defaults.baseURL = 'https://hagangmin.herokuapp.com'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

export default axios
