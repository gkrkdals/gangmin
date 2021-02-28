import React from "react"
import axios from "../../components/utils/axios"
import Redirection from "../../components/utils/Redirection"
import Nav from "../../components/public/Nav"
import CheckOrderForm from "../../components/user/checkOrder/CheckOrderForm";

export class CheckOrder extends React.PureComponent {
    state = {
        redirect: false,
        id: ''
    }

    constructor(props) {
        super(props)

        axios.get('api/auth/check')
            .then((res) => {
                if(res.data.result === 0 || res.data.admin)
                    this.state["redirect"] = true
                else
                    this.state["id"] = res.data.id
            })
    }

    render() {
        return (
            <>
                <Redirection to={"/login"} redirect={this.state.redirect} />
                <Nav id={this.state.id} admin={this.state.admin} />
                <CheckOrderForm />
            </>
        )
    }
}