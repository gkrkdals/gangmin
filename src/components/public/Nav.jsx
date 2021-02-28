import React from 'react'
import { Link } from 'react-router-dom'
import axios from "../utils/axios"
import Redirection from "../utils/Redirection"

class Nav extends React.PureComponent {
    state = {
        AC: '',
        redirect: false
    }

    constructor(props) {
        super(props)

        axios.get('/api/auth/check')
            .then(res => {
                if(res.data.admin)
                    this.setState({ AC: 'admin' })
                else
                    this.setState({ AC: 'user' })
            })
    }

    handleLogout = () => {
        axios.get('/api/auth/logout')
            .then(res => {
                this.setState({ redirect: true })
            })
            .catch(err => {
                console.error(err)
            })
    }

    render() {
        return (
            <>
                <Redirection to={"/login"} redirect={this.state.redirect}/>

                <nav className={"nav fixed-top navbar-light bg-light"}>
                    <Link className={"navbar-brand m-2 ml-4"} to={`/${this.state.AC}/main`}>Home</Link>

                    <div className={"form-inline my-2 my-lg-0 justify-content-end"}>
                        <Link className={"mx-2"} to={`/${this.state.AC}/myProfile`} style={{ textDecoration: 'none' }}>My Profile</Link>
                        <input type={"button"} className={"btn btn-outline-danger mx-2"} value={"Logout"} onClick={this.handleLogout} />
                    </div>
                </nav>
            </>
        )
    }
}

export default Nav