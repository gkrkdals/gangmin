import React, { useState, useEffect } from "react"
import { useHistory } from "react-router"
import axios from "../../utils/axios"
import OptionDialog from "../../utils/OptionDialog"

const MyProfileForm = () => {
    const [ ID, setID ] = useState('')
    const [ disabled, setDisabled ] = useState(true)
    const [ buttonName1, setButtonName1 ] = useState('Edit')
    const [ buttonName2, setButtonName2 ] = useState('Back')
    const history = useHistory()

    useEffect(() => {
        axios.get('/api/auth/check')
            .then(res => {
                setID(res.data.id)
            })
    }, [])

    //버튼 조작
    const handleButton = (e) => {
        switch(e.target.value) {
            case 'Edit':
                setButtonName1('Submit')
                setButtonName2('Cancel')
                setDisabled(false)
                break

            case 'Back':
                history.push('/admin/main')
                break

            case 'Submit':
                handleSubmit()
                break

            case 'Cancel':
                setButtonName1('Edit')
                setButtonName2('Back')
                setDisabled(true)
        }
    }

    const handleSubmit = async() => {
        const id = document.getElementById('id')
        const pw = document.getElementById('pw')
        const cf = document.getElementById('cf')

        if(pw.value.length < 5 || pw.value.length > 20) {
            alert("Password must be a string of 5 to 20 characters.")
            pw.focus()
        } else if(pw.value !== cf.value) {
            alert("Password and Confirm Field does not match.");
            cf.focus()
        } else {
            try {
                const response = await axios.post('/api/admin/updateMyData', { id: id.value, pw: pw.value })

                if(response.data.result === 1) {
                    alert("You've successfully updated your account.")
                    history.replace('/admin/main')
                } else {
                    alert("An error occurred while updating your account")
                }
            } catch (e) {
                alert("An error occurred while updating your account")
            }
        }
    }

    //탈퇴하기
    const handleWithdraw = () => {
        axios.get('/api/admin/withdraw', { params: { id: ID }})
            .then(() => {
                axios.get('/api/auth/logout').then((res) => {
                    history.replace('/login')
                })
                .catch(e => {
                    alert("An error occurred while deleting your account")
                })
            })
            .catch(e => {
                alert("An error occurred while deleting your account")
            })
    }

    //탈퇴 실행
    const doWithdraw = () => {
        handleWithdraw()
    }

    //Enter 키 핸들링
    const handleEnter = (event) => {
        if(event.key === "Enter") {
            const form = event.target.form
            const index = Array.prototype.indexOf.call(form, event.target)
            form.elements[index + 1].focus()
            event.preventDefault()
        }
    }

    return(
        <div className={"container"} style={{marginTop: "80px"}}>
            <div className={"row justify-content-center"}>
                <div className={"card signup bg-light"}>
                    <div className={"card-body"}>
                        <legend className={"mt-3"} style={{textAlign: "center"}}>Profile</legend>

                        <div className={"form-group"}>
                            <label>ID</label>
                            <div className={"form-inline"}>
                                <input type="text" id={"id"} className={"form-control field1 mr-sm-2"} value={ID} disabled/>
                            </div>
                        </div>

                        <form>
                            {disabled ? <></> : <div className={"form-group"}>
                                <label>Password</label>
                                <input type="password" id={"pw"} className={"form-control field1"}
                                       disabled={disabled} onKeyDown={handleEnter} autoFocus />
                            </div>}

                            {disabled ? <></> : <div className={"form-group"}>
                                <label>Confirm Password</label>
                                <input type="password" id={"cf"} className={"form-control field1"}
                                       onKeyDown={handleEnter} disabled={disabled} />
                            </div>}

                            <div className={"form-inline justify-content-end"}>
                                <input type={"button"} className={"btn btn-primary submit"} value={buttonName1} onClick={handleButton} />
                                <input type={"button"} className={"btn btn-primary submit"} value={buttonName2} onClick={handleButton} />
                                <OptionDialog styles={"btn btn-danger submit"} name={"Withdraw"} title={"Warning"}
                                              content={"Your account will be withdrawn."}
                                              btn1={"OK"} btn2={"Close"} onCheck={doWithdraw}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfileForm