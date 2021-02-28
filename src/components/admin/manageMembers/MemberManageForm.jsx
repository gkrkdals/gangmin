import 'date-fns'
import React, {forwardRef} from "react"
import { Link } from "react-router-dom"
import MaterialTable from "material-table"
import AddBox from '@material-ui/icons/AddBox'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import Alert from '@material-ui/lab/Alert'
import axios from '../../utils/axios'
import {FormControl, FormControlLabel, Radio, RadioGroup, Button, Input, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography} from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { SystemStarted } from "../../utils/config"
import DateFnsUtils from "@date-io/date-fns"
import reduceDate from "../../utils/reduceDate"

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

export default class MemberManageForm extends React.PureComponent {

    state = {
        originalRows: [],
        rows: [],
        errorMessages: [],
        isError: false,
        type: 'all',
        selectedDate1: new Date(SystemStarted),
        selectedDate2: new Date(Date.now() - (Date.now() % (1000 * 60 * 60 * 24))),
        open: false,
        open2: false,

        id: '',
        pw: '',
        nm: '',
        country: '',
        address: '',
        pn: '',
        joined: '',
        withdrew: '',
        withdrawal: false
    }

    columns = [
        { title: 'ID', field: 'id', editable: 'never' },
        { title: 'Password', field: 'pw' },
        { title: 'Name', field: 'nm' },
        { title: 'Nationality', field: 'country' },
        { title: 'Address', field: 'address', editable: 'never' },
        { title: 'Phone number', field: 'pn' },
        { title: 'Joined', field: 'joined', type: 'date', editable: 'never', filtering: false },
        { title: 'Withdrew', field: 'withdrew', type: 'date', editable: 'never', filtering: false },
        { title: 'Withdrawn', field: 'withdrawn', type: 'boolean',  editable: 'never' }
    ]

    constructor(props) {
        super(props);

        axios.get('/api/admin/getUsers')
            .then(res => {
                let rows = []

                res.data.forEach(item => {
                    if(!item.admin)
                        rows.push(item)
                })

                this.setState({ rows: rows, originalRows: rows })
            })
    }

    handleRowUpdate = () => {
        if(this.state.pw === "" || (this.state.pw.length < 5 || this.state.pw.length > 20)) {
            alert("Please enter a valid password.")
            document.getElementById("pw").focus()
        }
        else if(this.state.nm === "") {
            alert("Please enter the name.")
            document.getElementById("nm").focus()
        }
        else if(this.state.country === "" ) {
            alert("Please enter the nationality.")
            document.getElementById("country").focus()
        }
        else if(this.state.address === "") {
            alert("Please enter an address.")
            document.getElementById("address").focus()
        }
        else if(this.state.pn === "") {
            alert("Please enter a phone number.")
            document.getElementById("pn").focus()
        }
        else {
            axios.post('/api/admin/updateUser', {
                id: this.state.id,
                newData: {
                    pw: this.state.pw,
                    nm: this.state.nm,
                    country: this.state.country,
                    address: this.state.address,
                    pn: this.state.pn,
                }
            })
                .then(res => {
                    this.setState({ open: false })
                    const newData = {
                        id: this.state.id,
                        pw: this.state.pw,
                        nm: this.state.nm,
                        country: this.state.country,
                        address: this.state.address,
                        pn: this.state.pn,
                        joined: this.state.joined,
                        withdrew: this.state.withdrew,
                        withdrawal: this.state.withdrawal
                    }


                    let originalRows = [...this.state.originalRows]
                    let rows = [...this.state.rows]

                    for(let i = 0; i < originalRows.length; i++)
                        if(originalRows[i].id === newData.id)
                            originalRows.splice(i, 1, newData)

                    for(let i = 0; i < rows.length; i++)
                        if(rows[i].id === newData.id)
                            rows.splice(i, 1, newData)

                    this.setState({ originalRows, rows })
                })
        }
    }

    handleRadio = (e) => {
        this.setState({ type: e.target.value })
    }

    handleDateChange1 = (date) => {
        if(date === null)
            alert("Please select a valid date.")
        else if(date <= this.state.selectedDate2 || this.state.selectedDate2 === null)
            this.setState({ selectedDate1: date })
        else
            alert("Please select the day before the second Calendar.")
    }

    handleDateChange2 = (date) => {
        if(date >= this.state.selectedDate1 || date === null)
            this.setState({ selectedDate2: date })
        else
            alert("Please select the day after the first Calendar.")
    }

    handleSearch = () => {
        if(this.state.type === 'all') {
            this.onAll()
        } else if(this.state.type === 'joined') {
            this.onJoined()
        } else {
            this.onWithdrew()
        }
    }

    onAll = () => {
        let result = []

        this.state.originalRows.forEach(item => {
            const date1 = new Date(item.joined)
            const date2 = new Date(item.withdrew)

            if(this.state.selectedDate2 === null) {
                if(date1 >= this.state.selectedDate1 || date2 >= this.state.selectedDate2)
                    result.push(item)
            } else {
                if((date1 >= this.state.selectedDate1 && date1 <= this.state.selectedDate2)
                && (date2 >= this.state.selectedDate1 && date2 <= this.state.selectedDate2))
                    result.push(item)
            }
        })

        this.setState({ rows: result })
    }

    onJoined = () => {
        console.log("asdf")
        let result = []
        console.log(this.state.originalRows)

        this.state.originalRows.forEach(item => {
            const date = new Date(item.joined)

            if(this.state.selectedDate2 === null) {
                if(date >= this.state.selectedDate1)
                    result.push(item)
            } else {
                if(date >= this.state.selectedDate1 && date <= this.state.selectedDate2)
                    result.push(item)
            }
        })
        console.log(result)

        this.setState({ rows: result })
    }

    onWithdrew = () => {
        let result = []

        this.state.originalRows.forEach(item => {
            if(item.withdrawal) {
                const date = new Date(item.withdrew)

                if(this.state.selectedDate2 === null) {
                    if(date >= this.state.selectedDate1)
                        result.push(item)
                } else {
                    if(date >= this.state.selectedDate1 && date <= this.state.selectedDate2)
                        result.push(item)
                }
            }
        })

        this.setState({ rows: result })
    }

    handleEdit = (event, rowData) => {
        setTimeout(() => document.getElementById("pw").focus(), 100)
        this.setState({ open: true })

        this.setState({
            id: rowData.id,
            pw: rowData.pw,
            nm: rowData.nm,
            country: rowData.country,
            address: rowData.address,
            pn: rowData.pn,
            joined: rowData.joined,
            withdrew: rowData.withdrew,
            withdrawal: rowData.withdrawal
        })
    }

    handleSubmit = () => {
        this.setState({ open: false })
    }

    handleDelete = () => {
        const id = this.state.id

        axios.get('/api/admin/deleteUser', { params: { id } })
            .then(res => {
                this.setState({ open: false, open2: false })
                
                let originalRows = [...this.state.originalRows]
                let rows = [...this.state.rows]
                
                for(let i = 0; i < originalRows.length; i++) 
                    if(originalRows[i].id === id)
                        originalRows.splice(i, 1)
                
                for(let i = 0; i < rows.length; i++)
                    if(rows[i].id === id)
                        rows.splice(i, 1)
                
                this.setState({ originalRows, rows })
            })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleEnter = event => {
        if(event.key === "Enter") {
            const form = event.target.form
            const index = Array.prototype.indexOf.call(form, event.target)
            if(form.elements[index + 1].disabled === true) {
                let i = 0
                while (form.elements[index + i].disabled) {
                    i++
                }
                form.elements[index + i].focus()
            } else {
                form.elements[index + 1].focus()
            }
        }
    }

    render() {
        return (
            <div className={"mb-4"} style={{ marginTop: 100 }}>
                <div className={"container-fluid"} style={{ width: "80%" }}>
                    <div>
                        {this.state.isError &&
                        <Alert severity="error">
                            {this.state.errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                        }
                    </div>
                    <MaterialTable
                        title={"Member List"}
                        columns={this.columns}
                        data={this.state.rows}
                        icons={tableIcons}
                        options={{
                            actionsColumnIndex: -1,
                            filtering: true,
                            search: false
                        }}
                        actions={[
                            {
                                icon: () => <Edit/>,
                                tooltip: "Edit User",
                                onClick: this.handleEdit
                            }
                        ]}
                        components={{
                            Toolbar: props => (
                                <>
                                    <div className={"form-inline"} style={{ paddingLeft: 20 }}>
                                        <FormControl component={"fieldset"}>
                                            <RadioGroup row value={this.state.type} onChange={this.handleRadio}>
                                                <FormControlLabel value={"all"} control={<Radio/>} label={"All"}/>
                                                <FormControlLabel value={"joined"} control={<Radio/>} label={"Joined"}/>
                                                <FormControlLabel value={"withdrew"} control={<Radio/>} label={"Withdrew"}/>
                                            </RadioGroup>
                                        </FormControl>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="yyyy/MM/dd"
                                                margin="normal"
                                                label="Start"
                                                value={this.state.selectedDate1}
                                                onChange={this.handleDateChange1}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />

                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="yyyy/MM/dd"
                                                margin="normal"
                                                label="End"
                                                value={this.state.selectedDate2}
                                                onChange={this.handleDateChange2}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        <Button variant={"contained"} color={"primary"} className={"ml-4"} onClick={this.handleSearch}>
                                            Search
                                        </Button>
                                    </div>
                                    <div className={"form-group"}>
                                        <p className={"mt-2"}>
                                            ・ Format of an address: (Primary address)&(Detailed Address)<br/>
                                            ・ Format of a phone number: (Dial code)&(Phone numbers)
                                        </p>
                                    </div>
                                </>
                            )
                        }}
                    />
                    <div className={"form-inline justify-content-end "}>
                        <Link to={"/admin/main"}>
                            <input type={"button"} className={"btn btn-primary mt-3"} value={"Back"} />
                        </Link>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth={"lg"}>
                        <DialogTitle>
                            Edit User
                        </DialogTitle>

                        <form>
                            <DialogContent>
                                <div className={"row justify-content-center"}>
                                    <aside><TextField className={"m-3"} value={this.state.id} onKeyDown={this.handleEnter} label={"ID"} disabled autoFocus/></aside>
                                    <aside><TextField className={"m-3"} value={this.state.pw} onKeyDown={this.handleEnter} id={"pw"}
                                                      label={"Password"} onChange={e => this.setState({ pw: e.target.value })} /></aside>
                                    <aside><TextField className={"m-3"} value={this.state.nm} onKeyDown={this.handleEnter} id={"nm"}
                                                      label={"Name/Company/Group"} onChange={e => this.setState({ nm: e.target.value })}/></aside>
                                    <aside><TextField className={"m-3"} value={this.state.country} onKeyDown={this.handleEnter} id={"country"}
                                                      label={"Nationality"} onChange={e => this.setState({ country: e.target.value })}/></aside>
                                    <aside><TextField className={"m-3"} value={this.state.address} onKeyDown={this.handleEnter} id={"address"}
                                                      label={"Address"} onChange={e => this.setState({ address: e.target.value })}/></aside>
                                </div>
                                <div className={"row justify-content-center"}>
                                    <aside><TextField className={"m-3"} value={this.state.pn} onKeyDown={this.handleEnter} id={"pn"}
                                                      label={"Phone/Dial number"} onChange={e => this.setState({ pn: e.target.value })}/></aside>
                                    <aside><TextField className={"m-3"} value={this.state.joined} onKeyDown={this.handleEnter} label={"Joined"} disabled /></aside>
                                    <aside><TextField className={"m-3"} value={this.state.withdrew} onKeyDown={this.handleEnter} label={"Withdrew"} disabled /></aside>
                                    <aside><TextField className={"m-3"} value={this.state.withdrawal} onKeyDown={this.handleEnter} label={"Withdrawal"} disabled /></aside>
                                </div>
                            </DialogContent>

                            <DialogActions>
                                <Button color={"primary"} onClick={this.handleRowUpdate}>Submit</Button>
                                <Button color={"secondary"} onClick={() => { this.setState({ open2: true }) }}>Delete</Button>
                                <Button color={"primary"} onClick={() => { this.setState({ open: false }) }}>Cancel</Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                    <Dialog open={this.state.open2}>
                        <DialogTitle>
                            Warning
                        </DialogTitle>

                        <DialogContent>
                            <Typography gutterBottom>
                                This account will be deleted.
                            </Typography>
                        </DialogContent>

                        <DialogActions>
                            <Button color={"secondary"} onClick={this.handleDelete}>Yes</Button>
                            <Button color={"primary"} onClick={() => this.setState({ open2: false })}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }

}