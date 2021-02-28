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
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField, Button
} from "@material-ui/core"
import Alert from '@material-ui/lab/Alert'
import axios from '../../utils/axios'
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {SystemStarted} from "../../utils/config";

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

export default class ReceivedOrdersForm extends React.PureComponent {
    state = {
        originalRows: [],
        rows: [],
        errorMessages: [],
        isError: false,
        type: 'od',
        selectedDate1: new Date(SystemStarted),
        selectedDate2: new Date(Date.now() - (Date.now() % (1000 * 60 * 60 * 24))),
        open: false,
        open2: false,

        onum: '',
        id: '',
        pc: '',
        cnt: '',
        tp: '',
        od: '',
        dl: '',

        cur: 0
    }

    columns = [
        { title: 'Order Number', field: 'onum', editable: 'never' },
        { title: 'ID', field: 'id', editable: 'never' },
        { title: 'Product Code', field: 'pc', editable: 'never' },
        { title: 'Count', field: 'cnt', type: 'numeric' },
        { title: 'Total Price', field: 'tp', editable: 'never', type: 'numeric' },
        { title: 'Ordered date', field: 'od', type: 'date', editable: 'never', filtering: false },
        { title: 'Deadline', type: 'date', field: 'dl', filtering: false  }
    ]

    constructor(props) {
        super(props);

        axios.get('/api/admin/getOrders')
            .then(res => {
                this.setState({ rows: res.data, originalRows: res.data })
            })
    }

    handleOpen = (event, rowData) => {
        setTimeout(() => document.getElementById("cnt").focus(), 100)
        axios.get('/api/admin/getOneProduct', { params: { pc: rowData.pc }})
            .then(res => {
                this.setState({
                    onum: rowData.onum,
                    id: rowData.id,
                    pc: rowData.pc,
                    cnt: rowData.cnt,
                    tp: rowData.tp,
                    od: rowData.od,
                    dl: rowData.dl,
                    open: true,
                    cur: res.data.pr
                })
            })
    }

    handleRowUpdate = () => {
        if(this.state.cnt === "" || isNaN(this.state.cnt) || parseInt(this.state.cnt) <= 0)
            alert.push("Please enter the product's count")
        else if(isNaN(new Date(this.state.dl).getTime()))
            alert.push("Please enter a valid date")
        else {
            const newData = {
                onum: this.state.onum,
                id: this.state.id,
                pc: this.state.pc,
                cnt: this.state.cnt,
                tp: this.state.tp,
                od: this.state.od,
                dl: this.state.dl
            }
            axios.post('/api/admin/updateOrder', { onum: newData.onum, pc: newData.pc, newData })
                .then(res => {
                    let index = 0
                    let dataUpdate = [...this.state.rows]
                    for (let i = 0; i < dataUpdate.length; i++) {
                        if (dataUpdate[i].pc === newData.pc) {
                            index = i
                            break
                        }
                    }
                    dataUpdate.splice(index, 1, newData)
                    this.setState({ rows: [...dataUpdate], open: false })
                })
        }
    }

    handleDelete = () => {
        const onum = this.state.onum, pc = this.state.pc

        axios.get('/api/admin/deleteOrder', { params: { onum, pc } })
            .then(res => {
                this.setState({ open: false, open2: false })

                let originalRows = [...this.state.originalRows]
                let rows = [...this.state.rows]

                for(let i = 0; i < originalRows.length; i++)
                    if(originalRows[i].onum === onum)
                        originalRows.splice(i, 1)

                for(let i = 0; i < rows.length; i++)
                    if(rows[i].onum === onum)
                        rows.splice(i, 1)

                this.setState({ originalRows, rows })
            })
    }

    handleRadio = (e) => {
        this.setState({ type: e.target.value })
    }

    handleDeadline = (date) => {
        console.log(date)

        console.log(this.state.od)
        if(date < new Date(this.state.od))
            alert("Please select the day after the order date.")
        else
            this.setState({ dl: date })
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
        if(this.state.type === 'od') {
            this.onOrderedDate()
        } else {
            this.onDeadline()
        }
    }

    onOrderedDate = () => {
        let result = []

        this.state.originalRows.forEach(item => {
            const date = new Date(item.od)

            if(this.state.selectedDate2 === null) {
                if(date >= this.state.selectedDate1)
                    result.push(item)
            } else {
                if(date >= this.state.selectedDate1 && date <= this.state.selectedDate2)
                    result.push(item)
            }
        })

        this.setState({ rows: result })
    }

    onDeadline = () => {
        let result = []

        this.state.originalRows.forEach(item => {
            const date = new Date(item.dl)

            if(this.state.selectedDate2 === null) {
                if(date >= this.state.selectedDate1)
                    result.push(item)
            } else {
                if(date >= this.state.selectedDate1 && date <= this.state.selectedDate2)
                    result.push(item)
            }
        })

        this.setState({ rows: result })
    }

    render() {
        return (
            <div>
                <div className={"container-fluid"} style={{ marginTop: "100px", width:"80%" }}>
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
                        title={"Received Orders"}
                        columns={this.columns}
                        data={this.state.rows}
                        icons={tableIcons}
                        actions={[
                            {
                                icon: () => <Edit/>,
                                tooltip: 'Edit',
                                onClick: this.handleOpen
                            }
                        ]}
                        components={{
                            Toolbar: props => (
                                <div className={"form-inline"} style={{ paddingLeft: 10, paddingTop: 10}}>
                                    <FormControl component={"fieldset"}>
                                        <RadioGroup row value={this.state.type} onChange={this.handleRadio}>
                                            <FormControlLabel value={"od"} control={<Radio/>} label={"Ordered Date"}/>
                                            <FormControlLabel value={"dl"} control={<Radio/>} label={"Deadline"}/>
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
                            )
                        }}
                        options={{
                            filtering: true,
                            actionsColumnIndex: -1
                        }}
                    />
                    <div className={"form-inline justify-content-end "}>
                        <Link to={"/admin/main"}>
                            <input type={"button"} className={"btn btn-primary mt-3"} value={"Back"} />
                        </Link>
                    </div>
                </div>

                <Dialog open={this.state.open} onClose={() => this.setState({ open: false })} fullWidth maxWidth={"md"}>
                    <DialogTitle>
                        Edit Orders
                    </DialogTitle>

                    <form>
                        <DialogContent>
                            <div className={"row justify-content-center"}>
                                <aside><TextField className={"m-3"} value={this.state.cnt} onKeyDown={this.handleEnter} id={"cnt"}
                                                  label={"Count"} onChange={e => this.setState({ cnt: e.target.value, tp: e.target.value * this.state.cur })}/></aside>
                                <aside><TextField className={"m-3"} value={this.state.tp}
                                                  label={"Total Price"} disabled/></aside>
                                <aside>
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
                                </aside>
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
                            This order will be deleted.
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button color={"secondary"} onClick={this.handleDelete}>Yes</Button>
                        <Button color={"primary"} onClick={() => this.setState({ open2: false })}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}