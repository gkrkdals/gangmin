import React from 'react'

import RegisterForm from "../components/Register/RegisterForm";
import axios from "../components/utils/axios";

export default class Login extends React.PureComponent {

    state = {
        redirect: false,
        to: ''
    }

    constructor(props) {
        super(props)

        axios.get('/api/auth/check')
            .then((res) => {
                if(res.data.result === 1) {
                    const to = res.data.admin ? '/admin/main' : '/user/main'
                    this.setState({ redirect: true, to })
                }
            })
    }

    render() {
        return (
            <>
                <RegisterForm/>
            </>
        )
    }
}