import React, { useState } from "react"
import { useHistory } from "react-router"
import axios from "../../components/utils/axios"
import Nav from "../../components/public/Nav"
import MyProfileForm from "../../components/admin/myProfile/MyProfileForm"

const MyProfile = () => {
    const [ ID, setID ] = useState('')
    const [ admin, setAdmin ] = useState(false)
    const history = useHistory()

    axios.get('/api/auth/check')
        .then(res => {
            if(res.data.result === 0 || !res.data.admin) {
                history.replace('/login')
            } else {
                setID(res.data.id)
                setAdmin(res.data.admin)
            }
        })

    return (
        <>
            <Nav id={ID} admin={admin}/>
            <MyProfileForm/>
        </>
    )
}

export { MyProfile }