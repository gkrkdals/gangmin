import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"

import axios from "../utils/axios"

const LoginForm = () => {

    //history 사용
    const history = useHistory()

    //필드 초기화
    const restore = () => {
        document.getElementById('ID').value = ''
        document.getElementById('ID').focus()
        document.getElementById('PW').value = ''
    }

    //모든것이 채워졌는지 확인
    const checkEverythingIsFilled = () => {
        const id = document.getElementById("ID").value
        const pw = document.getElementById("PW").value

        return !(id === "" || pw === "")
    }

    //엔터시 모두 채워졌다? 로그인 아니다? 다음 필드로
    const handleEnter = (event) => {
        if(event.key === "Enter") {
            if(!checkEverythingIsFilled()) {
                const form = event.target.form
                const index = Array.prototype.indexOf.call(form, event.target)
                form.elements[index + 1].focus()
                event.preventDefault()
            } else {
                sendLoginRequest()
            }
        }
    }

    //로그인 요청 보내기
    const sendLoginRequest = () => {
        const id = document.getElementById('ID').value
        const pw = document.getElementById('PW').value

        axios.post('/api/auth/login', { id, pw })
            .then((res) => {
                switch (res.data.result) {
                    case -1:
                        alert("There are some errors for logging in")
                        restore()
                        break

                    case 0:
                        alert("Incorrect ID or password.")
                        restore()
                        break

                    case 1:
                        if(res.data.admin) {
                            alert("You logged in as Admin.")
                            history.replace('/admin/main')
                        } else {
                            history.replace('/user/main')
                        }
                        break

                    default:
                        alert("There are some errors for logging in")
                        restore()
                }
            }).catch((err) => {
            alert("There are some errors for logging in")
            console.error(err)
        })
    }

    return (
        <div className={"container fadeInDown"}>
            <br/>
            <p className={"text-center"}>Please log in to use multiple functions.</p>
            <hr/>

            <div className={"row justify-content-center"}>
                <div className={"card loginForm bg-light"}>
                    <article className={"card-body"}>

                        <div className={"fadeIn first"}>
                            <Link to={"/register"}>
                                <input type="submit" className={"float-right btn btn-outline-primary"}
                                       value="Sign up"/>
                            </Link>
                            <h4 className={"card-title mb-4 mt-1"}>Sign in</h4>
                        </div>

                        <form>
                            <div className={"form-group fadeIn second"}>
                                <label>Your ID</label>
                                <input type="text" className={"form-control"} id="ID"
                                       placeholder="ID" onKeyDown={handleEnter} autoFocus/>
                            </div>
                            <div className={"form-group fadeIn third"}>
                                <label>Your password</label>
                                <input type="password" className={"form-control"} id="PW"
                                       placeholder="Password" onKeyDown={handleEnter}/>
                            </div>
                            <div className={"fadeIn fourth"}>
                                <hr/>
                                <div className={"form-group"}>
                                    <input type={"button"} className={"btn btn-success btn-block"}
                                           value={"Login"} onClick={sendLoginRequest} />
                                </div>
                            </div>
                        </form>

                    </article>
                </div>
            </div>
        </div>
    )
}

export default LoginForm