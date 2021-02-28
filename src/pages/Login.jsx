import React from 'react'
import axios from '../components/utils/axios'
import Redirection from "../components/utils/Redirection";
import LoginForm from "../components/login/LoginForm"

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
                <Redirection to={this.state.to} redirect={this.state.redirect} />
                <LoginForm/>
            </>
        )
    }
}