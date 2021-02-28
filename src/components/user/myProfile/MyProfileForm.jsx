import React from "react"
import PropTypes from 'prop-types'
import { shallowEqualObjects as shallowEqual} from "shallow-equal"
import Redirection from "../../utils/Redirection"
import axios from "../../utils/axios"
import OptionDialog from "../../utils/OptionDialog";
const data = require('../../utils/countries.json')
const countries = JSON.parse(JSON.stringify(data))

export default class MyProfileForm extends React.PureComponent {
    //state 설정
    state = {
        dialogOpen: false,
        doWithdraw: false,

        toLogin: false,
        disabled: true,
        redirect: false,
        buttonName1: 'Edit',
        buttonName2: 'Back',

        id: '',
        nm: '',
        country: '',
        ad1: '',
        ad2: '',
        pn1: '',
        pn2: ''
    }

    constructor(props) {
        super(props);

        axios.get('/api/auth/check')
            .then((res) => {
                axios.get('/api/user/getUser', {
                    params: {
                        id: res.data.id
                    }
                })
                    .then((res) => {
                        const ad = res.data.user.address.split('&')
                        const pn = res.data.user.pn.split('&')

                        this.setState({
                            id: res.data.user.id,
                            nm: res.data.user.nm,
                            country: res.data.user.country,
                            ad1: ad[0],
                            ad2: ad[1],
                            pn1: pn[0],
                            pn2: pn[1]
                        })

                        document.getElementById('id').value = this.state.id
                        document.getElementById('nm').value = this.state.nm
                        document.getElementById('ad1').value = this.state.ad1
                        document.getElementById('ad2').value = this.state.ad2
                        document.getElementById('pn1').value = this.state.pn1
                        document.getElementById('pn2').value = this.state.pn2
                    })
            })
    }

    //국가 선택 시 자동으로 지역번호 얻음
    setCountry = () => {
        const s = document.getElementById("countries")
        const country = s.options[s.selectedIndex].value

        if(country === '') {
            this.setState({ pn1: '' })
        } else {
            const val = countries.find((item) => (item.name === country))
            this.setState({ pn1: val.dial_code })
        }
    }

    //버튼 사용시 변화할 것들
    handleButton = (e) => {
        switch(e.target.value) {
            case 'Edit':
                this.setState({ buttonName1: 'Submit', buttonName2: 'Cancel', disabled: false })
                break

            case 'Back':
                this.setState({ redirect: true })
                break

            case 'Submit':
                this.handleSubmit()
                break

            case 'Cancel':
                this.setState({ buttonName1: 'Edit', buttonName2: 'Back', disabled: true })
        }
    }

    //제출
    handleSubmit = async() => {
        const id = document.getElementById("id")
        const pw = document.getElementById("pw")
        const cf = document.getElementById("cf")
        const nm = document.getElementById("nm")
        const c = document.getElementById("countries")
        const country = c.options[c.selectedIndex]
        const ad1 = document.getElementById("ad1")
        const ad2 = document.getElementById("ad2")
        const pn1 = document.getElementById("pn1")
        const pn2 = document.getElementById("pn2")

        if(pw.value.length < 5 || pw.value.length > 20) {
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
                const result = await axios.post('/api/user/update', {
                    id: id.value,
                    pw: pw.value,
                    nm: nm.value,
                    country: country.value,
                    address: `${ad1.value}&${ad2.value}`,
                    pn: `${pn1.value}&${pn2.value}`,
                })

                if(result.data.result === 1) {
                    alert("You've successfully updated your account.")
                    this.setState({ redirect: true })
                } else {
                    console.log("An error occurred while updating your account")
                }
            } catch (e) {
                console.log("An error occurred while updating your account")
            }
        }
    }

    //탈퇴 이용
    handleWithdraw = () => {
        axios.get('/api/user/withdraw', {
            params: {
                id: this.state.id
            }
        }).then(() => {
            axios.get('/api/auth/logout').then((res) => {
                this.setState({ toLogin: true })
            })
        })
    }

    doWithdraw = () => {
        this.setState({ doWithdraw: true })
    }

    handleEnter = async(event) => {
        if(event.key === "Enter") {
            const form = event.target.form
            const index = Array.prototype.indexOf.call(form, event.target)
            if(form.elements[index + 1].disabled === true) {
                form.elements[index + 2].focus()
            } else if(form.elements[index].id === 'countries') {
                if(form.elements[index].value !== '')
                    form.elements[index + 1].focus()
            } else {
                form.elements[index + 1].focus()
            }

            event.preventDefault()
        }
    }

    render() {
        if(this.state.doWithdraw)
            this.handleWithdraw()

        return(
            <>
                <Redirection to={`/user/main`} redirect={this.state.redirect} push />
                <Redirection to={"/login"} redirect={this.state.toLogin} />

                <div className={"container"} style={{marginTop: "80px"}}>
                    <div className={"row justify-content-center"}>
                        <div className={"card signup bg-light"}>
                            <div className={"card-body"}>

                                <legend className={"mt-3"} style={{textAlign: "center"}}>Profile</legend>

                                <div className={"form-group"}>
                                    <label>ID</label>
                                    <div className={"form-inline"}>
                                        <input type="text" id={"id"} className={"form-control field1 mr-sm-2"} value={this.state.id} disabled/>
                                    </div>
                                </div>

                                <form>
                                    {this.state.disabled ? <></> : <div className={"form-group"}>
                                        <label>Password</label>
                                        <input type="password" id={"pw"} className={"form-control field1"}
                                               disabled={this.state.disabled} onKeyDown={this.handleEnter} autoFocus />
                                    </div>}

                                    {this.state.disabled ? <></> : <div className={"form-group"}>
                                        <label>Confirm Password</label>
                                        <input type="password" id={"cf"} className={"form-control field1"}
                                               onKeyDown={this.handleEnter} disabled={this.state.disabled} />
                                    </div>}

                                    <div className={"form-group"}>
                                        <label>Name</label>
                                        <input type="text" id={"nm"} className={"form-control field1"}
                                               onKeyDown={this.handleEnter} disabled={this.state.disabled} />
                                    </div>

                                    <div className={"form-group"}>
                                        <label>Nationality</label>
                                        <select id={"countries"} name={"countries"} className={"form-control field1"}
                                                onChange={this.setCountry} onKeyDown={this.handleEnter}
                                                disabled={this.state.disabled}>
                                            <option value="">Select your country</option>
                                            {countries.map((item, index) => (
                                                item.name === this.state.country ?
                                                    <option value={item.name} key={index} selected>{item.name}</option> :
                                                    <option value={item.name} key={index}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={"form-group"}>
                                        <label>Address</label>
                                        <input type="text" id={"ad1"} className={"form-control field2"} onKeyDown={this.handleEnter}
                                               placeholder={"State/Province, City/County/District"} disabled={this.state.disabled}/>
                                        <input type="text" id={"ad2"} className={"form-control field2"} onKeyDown={this.handleEnter}
                                               placeholder={"Detailed Address"} disabled={this.state.disabled} />
                                    </div>

                                    <div className={"form-group"}>
                                        <label>Phone Number</label>
                                        <div className={"form-inline"}>
                                            <input type="text" id={"pn1"} className={"form-control dial"} style={{width: "100px"}}
                                                   value={this.state.pn1} onKeyDown={this.handleEnter}  disabled/>
                                            <input type="text" id={"pn2"} className={"form-control"} placeholder={"Please enter without '-'"}
                                                   disabled={this.state.disabled} onKeyDown={this.handleEnter} />
                                        </div>
                                    </div>

                                    <div className={"form-inline justify-content-end"}>
                                        <input type={"button"} className={"btn btn-primary submit"} value={this.state.buttonName1} onClick={this.handleButton} />
                                        <input type={"button"} className={"btn btn-primary submit"} value={this.state.buttonName2} onClick={this.handleButton} />
                                        <OptionDialog styles={"btn btn-danger submit"} name={"Withdraw"} title={"Warning"}
                                                      content={"Your account will be withdrawn."}
                                                      btn1={"OK"} btn2={"Close"} onCheck={this.doWithdraw}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

MyProfileForm.propTypes = {
    id: PropTypes.string,
    admin: PropTypes.bool
}
