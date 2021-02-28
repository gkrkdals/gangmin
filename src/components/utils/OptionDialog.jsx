import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'

class OptionDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this);
    }



    handleClickOpen() {
        this.setState({ open: true });
    }


    handleClose() {
        this.setState({ open: false })
    }

    render() {
        return (
            <div>
                <input type="button" className={this.props.styles} value={this.props.name} onClick={this.handleClickOpen} />

                <Dialog onClose={this.handleClose} open={this.state.open}>

                    <DialogTitle onClose={this.handleClose}>
                        {this.props.title}
                    </DialogTitle>

                    <DialogContent>
                        <Typography gutterBottom>
                            {this.props.content}
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={() => {
                            this.handleClose()
                            return this.props.onCheck()
                        }}>
                            {this.props.btn1}
                        </Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>{this.props.btn2}</Button>
                    </DialogActions>

                </Dialog>
            </div>
        )
    }
}

OptionDialog.propTypes = {
    styles: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    btn1: PropTypes.string,
    btn2: PropTypes.string,
    onCheck: PropTypes.func
}

export default OptionDialog;