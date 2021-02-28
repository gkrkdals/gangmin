import React, { useState } from "react"
import { useHistory } from "react-router"
import reduceDate from "../utils/reduceDate"
import axios from "../utils/axios"

const data = require('../utils/countries.json')
const countries = JSON.parse(JSON.stringify(data))

const RegisterForm = () => {
    //state 설정
    const [ confirmed, setConfirmed ] = useState(false)
    const [ dialCode, setDialCode ] = useState('')
    //history 설정
    const history = useHistory()

    //국가 선택 시 자동으로 지역번호 얻음
    const setCountry = () => {
        const s = document.getElementById("countries")
        const country = s.options[s.selectedIndex].value

        if(country === '') {
            setDialCode('')
        } else {
            const val = countries.find((item) => (item.name === country))
            setDialCode(val.dial_code)
        }
    }

    //아이디 중복확인
    const checkDuplicates = async() => {
        const id = document.getElementById("inputID")
        const matchID = /^[A-Za-z0-9_]{5,20}$/g

        const response = await axios.get('/api/auth/checkID', { params: {id: id.value}})

        try {
            if(response.data.result === 1) {
                if(matchID.test(id.value)) {
                    alert("ID duplicate check has been completed.")
                    setConfirmed(true)
                } else {
                    alert("ID must be 5 to 12 character string consisting of '_', numbers, and English letters.")
                    id.focus()
                }
            } else if (response.data.result === 0) {
                alert("ID is already occupied by someone else, please choose another.")
                id.focus()
            } else {
                alert("There's an error for checking ID.")
                id.focus()
            }
        } catch (e) {
            alert("There's an error for checking ID.")
            id.focus()
        }
    }

    //양식 제출(post)
    const handleSubmit = async() => {
        const id = document.getElementById("inputID")
        const pw = document.getElementById("inputPW")
        const cf = document.getElementById("inputCF")
        const nm = document.getElementById("inputNM")
        const c = document.getElementById("countries")
        const country = c.options[c.selectedIndex]
        const ad1 = document.getElementById("inputAD1")
        const ad2 = document.getElementById("inputAD2")
        const pn1 = document.getElementById("inputPN1")
        const pn2 = document.getElementById("inputPN2")

        if(id.disabled === false) {
            alert("Please verify your ID duplicate check.")
            id.focus()
        } else if(pw.value.length < 5 || pw.value.length > 20) {
            alert("Password must be a string of 5 to 20 characters.")
            pw.focus()
        } else if(pw.value !== cf.value) {
            alert("Password and Confirm Field does not match.");
            cf.focus()
        } else if(nm.value === "") {
            alert("Please fill in the name field.")
            nm.focus()
        } else if(country.value === "") {
            alert("Please select your nationality.")
            country.focus()
        } else if(ad1.value === '' || ad2.value === '') {
            alert("Please fill in the address fields.")
            ad1.focus()
        } else if(pn2.value === '') {
            alert("Please enter your phone/dial number.")
            pn2.focus()
        } else {
            try {
                const response = await axios.post('/api/auth/register', {
                    id: id.value,
                    pw: pw.value,
                    nm: nm.value,
                    country: country.value,
                    address: `${ad1.value}&${ad2.value}`,
                    pn: `${pn1.value}&${pn2.value}`,
                    joined: reduceDate(Date.now()),
                    withdrew: '',
                    withdrawal: false
                })

                if(response.data.result === 1) {
                    alert("You've successfully created a new account.")
                    history.push('/login')
                } else {
                    alert("An error occurred while creating a new account.")
                }
            } catch (e) {
                alert("An error occurred while creating a new account.")
            }
        }
    }

    //취소버튼
    const handleCancel = () => {
        history.push('/login')
    }

    //모두 채워졌는지 확인
    const isEverythingFilled = () => {
        const id = document.getElementById("inputID").value
        const pw = document.getElementById("inputPW").value
        const cf = document.getElementById("inputCF").value
        const nm = document.getElementById("inputNM").value
        const c = document.getElementById("countries")
        const country = c.options[c.selectedIndex].value
        const ad1 = document.getElementById("inputAD1").value
        const ad2 = document.getElementById("inputAD2").value
        const pn1 = document.getElementById("inputPN1").value
        const pn2 = document.getElementById("inputPN2").value

        return !(id === '' || pw === '' || cf === '' || nm === '' || country === ''
            || ad1 === '' || ad2 === '' || pn1 === '' || pn2 === '')
    }

    //전부 지지않으면 다음필드로 전부 채워지면 회원가입요청 보냄
    const handleEnter = async(event) => {
        if(event.key === "Enter") {
            if(!isEverythingFilled()) {
                const form = event.target.form
                const index = Array.prototype.indexOf.call(form, event.target)
                if(form.elements[index + 1].disabled === true) {
                    form.elements[index + 2].focus()
                } else if(form.elements[index].id === 'confirmBtn') {
                    checkDuplicates()
                        .then(() => {
                            if(!form.elements[0].disabled)
                                form.elements[0].focus()
                            else
                                form.elements[index + 1].focus()
                        })
                } else if(form.elements[index].id === 'countries') {
                    if(form.elements[index].value !== '')
                        form.elements[index + 1].focus()
                } else {
                    form.elements[index + 1].focus()
                }

                event.preventDefault()
            } else {
                await handleSubmit()
            }
        }
    }

    return(
        <div className={"container my-4 fadeInDown"}>
            <div className={"row justify-content-center"}>
                <div className={"card signup bg-light"}>
                    <div className={"card-body"}>
                        <legend className={"mt-3"} style={{textAlign: "center"}}>Sign Up</legend>
                        <form>
                            <div className={"form-group"}>
                                <label>ID</label>
                                <div className={"form-inline"}>
                                    <input type="text" className={"form-control field1 mr-sm-2"} id={"inputID"}
                                           disabled={confirmed} onKeyDown={handleEnter} autoFocus/>
                                    <input type="button" className={"btn btn-outline-primary confirm"} value={"Confirm ID"}
                                           id={"confirmBtn"} onClick={checkDuplicates} onKeyDown={handleEnter}/>
                                </div>
                            </div>

                            <div className={"form-group"}>
                                <label>Password</label>
                                <input type="password" className={"form-control field1"} id={"inputPW"} onKeyDown={handleEnter}/>
                            </div>

                            <div className={"form-group"}>
                                <label>Confirm Password</label>
                                <input type="password" className={"form-control field1"} id={"inputCF"} onKeyDown={handleEnter}/>
                            </div>

                            <div className={"form-group"}>
                                <label>Name/Company/Group</label>
                                <input type="text" className={"form-control field1"} id={"inputNM"} onKeyDown={handleEnter}/>
                            </div>

                            <div className={"form-group"}>
                                <label>Nationality</label>
                                <select  name={"countries"} id={"countries"} className={"form-control field1"} onChange={setCountry} onKeyDown={handleEnter}>
                                    <option value="">Select your country</option>
                                    {countries.map((item, index) => (<option value={item.name} key={index}>{item.name}</option>))}
                                </select>
                            </div>

                            <div className={"form-group"}>
                                <label>Address</label>
                                <input type="text" className={"form-control field2"} id={"inputAD1"}
                                       placeholder={"State/Province, City/County/District"} onKeyDown={handleEnter}/>
                                <input type="text" className={"form-control field2"} id={"inputAD2"} placeholder={"Detailed Address"} onKeyDown={handleEnter} />
                            </div>

                            <div className={"form-group"}>
                                <label>Phone/Dial Number</label>
                                <div className={"form-inline"}>
                                    <input type="text" className={"form-control dial"} style={{width: "100px"}}
                                           id={"inputPN1"} value={dialCode} disabled onKeyDown={handleEnter}/>
                                    <input type="text" className={"form-control"} id={"inputPN2"}
                                           placeholder={"Please enter without '-'"} onKeyDown={handleEnter}/>
                                </div>
                            </div>

                            <div className={"form-group justify-content-end"}>
                                <input type={"button"} className={"btn btn-primary submit"} value={"Submit"} onClick={handleSubmit} />
                                <input type={"button"} className={"btn btn-primary submit"} value={"Cancel"} onClick={handleCancel} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm