import React, {forwardRef, useEffect, useState} from "react"
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
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import TextField from "@material-ui/core/TextField"
import {Add, Save} from "@material-ui/icons"
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import reduceDate from "../../utils/reduceDate"
import DateFnsUtils from "@date-io/date-fns"
import zeroPad from "../../utils/zeroPad"
import Redirection from "../../utils/Redirection";

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

export default class MakeOrderForm extends React.PureComponent {
    state = {
        highestOrderNum: 0,
        rows1: [],
        rows2: [],

        pc: '',
        pn: '',
        cnt: '',
        pr: 0,
        tp: 0,
        dl: reduceDate(Date.now()),

        open: false,
        open2: false,
        redirection: false
    }

    handleOpen = (event, rowData) => {
        this.setState({ cnt: '', tp: 0, open: true, pc: rowData.pc, pn: rowData.pn, pr: rowData.pr })
        setTimeout(() => document.getElementById("cnt").focus(), 100)
    }

    handleSubmit = () => {
        if(isNaN(this.state.cnt) || this.state.cnt === 0 || this.state.cnt === "" || this.state.cnt === null) {
            alert("Please enter a number.")
        } else if(isNaN(new Date(this.state.dl).getTime()) && !(this.state.dl === null) ) {
            alert("Please enter a valid date.")
        } else {
            const newRow = [...this.state.rows2, {
                pc: this.state.pc,
                pn: this.state.pn,
                cnt: this.state.cnt,
                tp: this.state.tp,
                dl: this.state.dl
            }]
            this.setState({ rows2: newRow, open: false })
        }
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleChange = (e) => {
        this.setState({ cnt: e.target.value, tp: e.target.value * this.state.pr })
    }

    columns1 = [
        {title: 'Product Code', field: 'pc'},
        {title: 'Product Name', field: 'pn'},
        {title: 'Standard', field: 'st'},
        {title: 'Unit', field: 'un'},
        {title: 'Price', field: 'pr', type: 'numeric' },
        {title: 'Brand', field: 'br'},
        {title: 'Account Classification', field: 'ac', lookup: {1: 'Products', 2: 'Materials', 3: 'Goods'}},
        {title: 'Remark', field: 'rm'}
    ]

    columns2 = [
        {title: 'Product Code', field: 'pc'},
        {title: 'Product Name', field: 'pn'},
        {title: 'Count', field: 'cnt'},
        {title: 'Total Price', field: 'tp'},
        {title: 'Deadline', field: 'dl', type: 'date'},
    ]

    constructor(props) {
        super(props);

        axios.get('/api/auth/check')
            .then(res => {this.userID = res.data.id})

        axios.get('/api/user/getHighestOrderNum')
            .then(res => { this.setState({ highestOrderNum: res.data.num }) })

        axios.get('/api/admin/getProducts')
            .then(res => {
                this.setState({ rows1: res.data.map(item => {
                        return {
                            pc: item.pc,
                            pn: item.pn,
                            st: item.st,
                            un: item.un,
                            pr: item.pr,
                            br: item.br,
                            ac: item.ac,
                            rm: item.rm
                        }
                    })
                })
            })
    }

    handleDeadline = (date) => {
        if(reduceDate(Date.now()) > date && !(date === null)) {
            alert("Please choose the day after or same to today.")
        }
        else
            this.setState({ dl: date })
    }

    handleDelete = (event, rowData) => {
        let index = 0, newData = [...this.state.rows2]
        for(let i = 0; i < newData.length; i++)
            if(this.state.rows2[i].pc === rowData.pc) {
                index = i
                break
            }
        newData.splice(index, 1)
        this.setState({ rows2: newData })
    }

    handleMakeOrder = () => {
        if(this.state.rows2.length === 0) {
            alert("There's no order.")
        } else {
            axios.get('/api/user/getHighestOrderNum')
                .then(res => {
                    const send = []
                    this.state.rows2.forEach(item => {
                        send.push({
                            onum: zeroPad(res.data.result + 1, 8),
                            id: this.userID,
                            pc: item.pc,
                            cnt: item.cnt,
                            tp: item.tp,
                            od: reduceDate(Date.now()),
                            dl: item.dl
                        })
                    })

                    axios.post('/api/user/addOrder', { send })
                        .then(res => {
                            alert("You've successfully made a new order.")
                            this.setState({ open: false, open2: false, redirection: true })
                        })
                })
        }
    }

    render() {
        return (
            <>
                <Redirection to={'/user/main'} redirect={this.state.redirection} push/>

                <div className={"mb-4"}>
                    <div className={"container"} style={{ marginTop: "100px" }}>
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
                            title={"Product List"}
                            columns={this.columns1}
                            data={this.state.rows1}
                            icons={tableIcons}
                            actions={[
                                {
                                    icon: () => <Add/>,
                                    tooltip: 'Add',
                                    onClick: this.handleOpen
                                }
                            ]}
                            options={{
                                actionsColumnIndex: -1
                            }}
                        />

                        <div style={{marginTop: "100px"}}/>
                        <MaterialTable
                            title={"Your Orders"}
                            columns={this.columns2}
                            data={this.state.rows2}
                            icons={tableIcons}
                            actions={[
                                {
                                    icon: () => <Save />,
                                    tooltip: 'Save',
                                    isFreeAction: true,
                                    onClick: () => this.setState({ open2: true })
                                },
                                {
                                    icon: () => <DeleteOutline/>,
                                    tooltip: 'Delete',
                                    onClick: this.handleDelete
                                }
                            ]}
                            options={{
                                actionsColumnIndex: -1
                            }}
                        />

                        <div className={"form-inline justify-content-end "}>
                            <Link to={"/admin/main"}>
                                <input type={"button"} className={"btn btn-primary mt-3"} value={"Back"}/>
                            </Link>
                        </div>

                        <Dialog onClose={this.handleClose} open={this.state.open}>
                            <DialogTitle onClose={this.handleClose}>
                                Please enter the product's count and a deadline.
                            </DialogTitle>

                            <DialogContent>
                                <div className={"row justify-content-center mb-2"}>
                                    <TextField onChange={this.handleChange} id={"cnt"} label="Count" value={this.state.cnt}/>
                                </div>
                                <div className={"row justify-content-center mb-2"}>
                                    <TextField label={"Total Price"} value={this.state.tp} disabled/>
                                </div>
                                <div className={"row justify-content-center mb-2"}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy/MM/dd"
                                            margin="normal"
                                            label="Deadline"
                                            value={this.state.dl}
                                            onChange={this.handleDeadline}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </DialogContent>

                            <DialogActions>
                                <Button id="inputCnt" variant="contained" color="primary" onClick={this.handleSubmit}>Add</Button>
                                <Button variant="outlined" color="primary" onClick={this.handleClose}>Close</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={this.state.open2} onClose={() => this.setState({ open2: false })}>
                            <DialogTitle>
                                Confirm
                            </DialogTitle>
                            <DialogContent>
                                <Typography gutterBottom>
                                    Are you sure you want to make an order?
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button color={"primary"} onClick={this.handleMakeOrder}>Yes</Button>
                                <Button color={"primary"} onClick={() => this.setState({ open2: false })}>Cancel</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </>
        )
    }
}