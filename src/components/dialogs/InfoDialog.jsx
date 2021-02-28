import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const InfoDialog = (props) => {

    const { open, title, content, button, onOpen, onExit } = props

    return (
            <Dialog open={open} onExit={() => onExit}>

                <DialogTitle>
                    {title}
                </DialogTitle>

                <DialogContent>
                    <Typography gutterBottom>
                        {content}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" color="primary" onClick={e => onOpen(false)}>
                        {button}
                    </Button>
                </DialogActions>

            </Dialog>
    )
}

InfoDialog.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    button: PropTypes.string,
    onOpen: PropTypes.func,
    onExit: PropTypes.func
}

export default InfoDialog;