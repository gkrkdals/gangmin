import React from "react"
import axios from "../../components/utils/axios"
import Redirection from "../../components/utils/Redirection"
import Nav from "../../components/public/Nav"
import ProductManageForm from "../../components/admin/manageProducts/ProductManageForm"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

export default class ManageProducts extends React.PureComponent {

    state = {
        redirect: false,
        id: '',
        admin: false
    }

    constructor(props) {
        super(props);

        axios.get('api/auth/check')
            .then((res) => {
                if(res.data.result === 0 || !res.data.admin)
                    this.setState({ redirect: true })
                else
                    this.setState({
                        id: res.data.id,
                        admin: res.data.admin
                    })
            })
    }

    render() {
        return (
            <>
                <Redirection to={"/login"} redirect={this.state.redirect} />

                <Nav id={this.state.id} admin={this.state.admin}/>

                <MuiThemeProvider>
                    <ProductManageForm />
                </MuiThemeProvider>
            </>
        )
    }
}