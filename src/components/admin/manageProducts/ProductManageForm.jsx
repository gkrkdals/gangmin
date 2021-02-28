import React, {forwardRef} from "react"
import 'date-fns'
import {Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button, Select} from "@material-ui/core"
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
import {Add} from "@material-ui/icons";

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

const acc = { 1: "Products", 2: "Materials", 3: "Goods" }

const zeroPad = (base, num) => {
    let zeros = ""
    const numOfZeros = num - base.toString().length
    for(let i = 0; i < numOfZeros; i++)
        zeros = zeros.concat('0')

    return numOfZeros > 0 ? zeros + base.toString() : base.toString()
}

class ProductManageForm extends React.PureComponent {
    state = {
        rows: [],
        highestNums: {},
        errorMessages: [],
        isError: false,

        pc: '',
        pn: '',
        st: '',
        un: '',
        pr: 0,
        br: '',
        ac: '1',
        rm: '',

        open: false,
        open2: false,
        open3: false,
        open4: false
    }

    columns = [
        { title: 'Product Code', field: 'pc', editable: 'never' },
        { title: 'Product Name', field: 'pn' },
        { title: 'Standard', field: 'st' },
        { title: 'Unit', field: 'un' },
        { title: 'Price', field: 'pr', type: 'numeric' },
        { title: 'Brand', field: 'br' },
        { title: 'Account Classification', field: 'ac',  lookup: { 1: 'Products', 2: 'Materials', 3: 'Goods' }, editable: 'onAdd' },
        { title: 'Remark', field: 'rm'}
    ]

    constructor(props) {
        super(props);
        axios.get('/api/admin/getProducts')
            .then(res => {
                this.setState({ rows: res.data })
            })

        axios.get("/api/admin/getHighestNums")
            .then(res => {
                this.setState({ highestNums: res.data })
                this.setState({ pc: "PD" + zeroPad(res.data.pd + 1, 6)})
            })
    }

    handleRowAdd = () => {
        if(this.state.pn === '') {
            document.getElementById("pn2").focus()
            alert("Please enter a product name")
        }
        else if(this.state.st === '') {
            document.getElementById("st2").focus()
            alert("Please enter a standard")
        }
        else if(this.state.pr === '' || isNaN(this.state.pr)) {
            document.getElementById("pr2").focus()
            alert("Please enter a valid price")
        }
        else if(this.state.br === '') {
            document.getElementById("br2").focus()
            alert("Please enter a brand")
        }
        else if(this.state.ac === '') {
            document.getElementById("ac2").focus()
            alert("Please enter an account classification")
        } else {

            const newData = {
                pc: this.state.pc,
                pn: this.state.pn,
                st: this.state.st,
                un: this.state.un,
                pr: this.state.pr,
                br: this.state.br,
                ac: this.state.ac,
                rm: this.state.rm
            }

            axios.post("/api/admin/addProduct", newData)
                .then(res => {
                    let rowsToAdd = [...this.state.rows]
                    rowsToAdd.push(newData)
                    this.setState({ rows: rowsToAdd, open3: false })
                })
                .catch(err => {
                })
        }
    }

    handleRowUpdate = () => {
        let errorList = []

        if(this.state.pn === "") {
            document.getElementById("pn").focus()
            alert("Please enter a product name")
        }else if(this.state.st === "") {
            document.getElementById("st").focus()
            alert("Please enter a standard")
        } else if(this.state.pr === '' || isNaN(this.state.pr)) {
            document.getElementById("pr").focus()
            alert("Please enter a valid price")
        }else if(this.state.br === '') {
            document.getElementById("br").focus()
            alert("Please enter a brand")
        }else {
            const newData = {
                pc: this.state.pc,
                pn: this.state.pn,
                st: this.state.st,
                un: this.state.un,
                pr: this.state.pr,
                br: this.state.br,
                ac: this.state.ac,
                rm: this.state.rm
            }
            axios.post('/api/admin/updateProduct', { pc: newData.pc, newData})
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

    handleRowDelete = () => {
        axios.get("/api/admin/deleteProduct", { params: { pc: this.state.pc } })
            .then(res => {
                let index = 0
                let dataDelete = [...this.state.rows]
                for (let i = 0; i < dataDelete.length; i++) {
                    if (dataDelete[i].pc === this.state.pc) {
                        index = i
                        break
                    }
                }
                dataDelete.splice(index, 1)
                this.setState({ rows: [...dataDelete], open: false, open2: false })
            })
            .catch(error => {
                this.setState({ errorMessages: ["Delete failed! Server error"], isError: true })
            })
    }

    handleEdit = (event, rowData) => {
        setTimeout(() => document.getElementById("pn").focus(), 100)
        this.setState(rowData)
        this.setState({ open: true })
    }

    handleAdd = (event, rowData) => {
        setTimeout(() => document.getElementById("pn2").focus(), 100)
        this.setState({
            pc: '',
            pn: '',
            st: '',
            un: '',
            pr: 0,
            br: '',
            ac: '1',
            rm: '',
            open3: true
        })
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
            <div>
                <div className={"container-lg"} style={{ marginTop: "100px" }}>
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
                        columns={this.columns}
                        data={this.state.rows}
                        icons={tableIcons}
                        actions={[
                            {
                                icon: () => <Edit/>,
                                tooltip: 'Edit',
                                onClick: this.handleEdit
                            },
                            {
                                icon: () => <AddBox/>,
                                tooltip: 'Add new product',
                                isFreeAction: true,
                                onClick: this.handleAdd
                            }
                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            detailPanelType: "single"
                        }}
                    />
                    <div className={"form-inline justify-content-end "}>
                        <Link to={"/admin/main"}>
                            <input type={"button"} className={"btn btn-primary mt-3"} value={"Back"} />
                        </Link>
                    </div>
                </div>

                <Dialog open={this.state.open} onClose={() => this.setState({ open: false })} fullWidth maxWidth={"lg"}>
                    <DialogTitle>
                        Edit Product
                    </DialogTitle>

                    <form>
                        <DialogContent>
                            <div className={"row justify-content-center"}>
                                <aside><TextField className={"m-3"} value={this.state.pc} onKeyDown={this.handleEnter} label={"Product Code"} disabled autoFocus/></aside>
                                <aside><TextField className={"m-3"} value={this.state.pn} onKeyDown={this.handleEnter} id={"pn"}
                                                  label={"Product Name"} onChange={e => this.setState({ pn: e.target.value })} /></aside>
                                <aside><TextField className={"m-3"} value={this.state.st} onKeyDown={this.handleEnter} id={"st"}
                                                  label={"Standard"} onChange={e => this.setState({ st: e.target.value })}/></aside>
                                <aside><TextField className={"m-3"} value={this.state.unit} onKeyDown={this.handleEnter} id={"un"}
                                                  label={"Unit"} onChange={e => this.setState({ un: e.target.value })}/></aside>

                            </div>
                            <div className={"row justify-content-center"}>
                                <aside><TextField className={"m-3"} value={this.state.pr} onKeyDown={this.handleEnter} id={"pr"}
                                                  label={"Price"} onChange={e => this.setState({ pr: e.target.value })}/></aside>
                                <aside><TextField className={"m-3"} value={this.state.br} onKeyDown={this.handleEnter} id={"br"}
                                                  label={"Brand"} onChange={e => this.setState({ br: e.target.value })}/></aside>
                                <aside><TextField className={"m-3"} value={acc[this.state.ac]} onKeyDown={this.handleEnter} label={"Account Classification"} disabled /></aside>
                                <aside><TextField className={"m-3"} value={this.state.rm} onKeyDown={this.handleEnter}
                                                  label={"Remark"} onChange={e => this.setState({ rm: e.target.value })}/> </aside>
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
                            The product will be deleted.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button color={"secondary"} onClick={this.handleRowDelete}>Submit</Button>
                        <Button color={"primary"} onClick={() => { this.setState({ open2: false }) }}>Cancel</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.open3} onClose={() => this.setState({ open3: false })} fullWidth maxWidth={"lg"}>
                    <DialogTitle>
                        Add Product
                    </DialogTitle>

                    <form>
                        <DialogContent>
                            <div className={"row justify-content-center"}>
                                <aside><TextField className={"m-3"} value={this.state.pc} onKeyDown={this.handleEnter}
                                                  label={"Product Code"} disabled /></aside>
                                <aside><TextField className={"m-3"} value={this.state.pn} onKeyDown={this.handleEnter} id={"pn2"}
                                                  label={"Product Name"} onChange={e => this.setState({ pn: e.target.value })} /></aside>
                                <aside><TextField className={"m-3"} value={this.state.st} onKeyDown={this.handleEnter} id={"st2"}
                                                  label={"Standard"} onChange={e => this.setState({ st: e.target.value })}/></aside>
                                <aside><TextField className={"m-3"} value={this.state.un} onKeyDown={this.handleEnter} id={"un2"}
                                                  label={"Unit"} onChange={e => this.setState({ un: e.target.value })}/></aside>

                            </div>
                            <div className={"row justify-content-center"}>
                                <aside><TextField className={"m-3"} value={this.state.pr} onKeyDown={this.handleEnter} id={"pr2"}
                                                  label={"Price"} onChange={e => this.setState({ pr: e.target.value })}/></aside>
                                <aside><TextField className={"m-3"} value={this.state.br} onKeyDown={this.handleEnter} id={"br2"}
                                                  label={"Brand"} onChange={e => this.setState({ br: e.target.value })}/></aside>
                                <aside>
                                    <Select className={"mx-3 mt-4"} defaultValue={this.state.ac} onKeyDown={this.handleEnter} style={{width: "100%"}}
                                            label={"Account Classification"} onChange={e => {
                                        switch(e.target.value) {
                                            case '1':
                                                this.setState({ pc: 'PD' + zeroPad( this.state.highestNums['pd'] + 1, 6) })
                                                break
                                            case '2':
                                                this.setState({ pc: 'MT' + zeroPad( this.state.highestNums['mt'] + 1, 6) })
                                                break
                                            case '3':
                                                this.setState({ pc: 'GD' + zeroPad( this.state.highestNums['gd'] + 1, 6) })
                                        }
                                        this.setState({ ac: e.target.value })
                                    }}>
                                        <option value="1">Products</option>
                                        <option value="2">Materials</option>
                                        <option value="3">Goods</option>
                                    </Select>
                                </aside>
                                <aside className={"ml-4"}><TextField className={"m-3"} value={this.state.rm} onKeyDown={this.handleEnter}
                                                                     label={"Remark"} onChange={e => this.setState({ rm: e.target.value })}/> </aside>
                            </div>
                        </DialogContent>

                        <DialogActions>
                            <Button color={"primary"} onClick={this.handleRowAdd}>Submit</Button>
                            <Button color={"primary"} onClick={() => { this.setState({ open3: false }) }}>Cancel</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        )
    }
}

export default ProductManageForm