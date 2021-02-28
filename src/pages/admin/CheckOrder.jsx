import React, {useState, useEffect, useRef} from "react"
import {useHistory} from "react-router"
import axios from "../../components/utils/axios"
import Nav from "../../components/public/Nav"
import ReceivedOrdersForm from "../../components/admin/receivedOrders/ReceivedOrdersForm"

const CheckOrder = () => {
    const [ ID, setID ] = useState('')
    const [ admin, setAdmin ] = useState(false)
    const history = useHistory()
    const _isMounted = useRef(true)

    useEffect(() => {
        axios.get('api/auth/check')
            .then(res => {
                if(_isMounted.current) {
                    if(res.data.result === 0 || !res.data.admin) {
                        history.replace('/login')
                    }
                    else {
                        setID(res.data.id)
                        setAdmin(res.data.admin)
                    }
                }
            })

        return () => {
            _isMounted.current = false
        }
    }, [])

    return (
        <>
            <Nav id={ID} admin={admin}/>
            <ReceivedOrdersForm />
        </>
    )
}

export { CheckOrder }

