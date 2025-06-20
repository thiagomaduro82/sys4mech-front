import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, Typography } from "@mui/material";
import { blue, green, orange, red } from "@mui/material/colors";

interface IModalDialogProps {
    open: boolean;
    type?: 'info' | 'warning' | 'error' | 'success' | 'confirmation';
    title?: string;
    message?: string;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
};

const typeConfig = {
    info: { icon: "info", color: blue[700] },
    warning: { icon: "warning", color: orange[700] },
    error: { icon: "error", color: red[700] },
    success: { icon: "check_circle", color: green[700] },
    confirmation: { icon: "help", color: red[700] },
};

export const ModalDialog: React.FC<IModalDialogProps> = ({
    open = false,
    type = 'info',
    title = 'Information',
    message = 'This is a message.',
    onClose,
    onConfirm,
    onCancel
}) => {

    const { icon, color } = typeConfig[type] || typeConfig.info;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="modal-dialog-title"
                aria-describedby="modal-dialog-description"
            >
                <DialogTitle id="modal-dialog-title">
                    <Typography variant="h5" sx={{ color: color, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Icon>{icon}</Icon>
                        {title}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="modal-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {(type === 'confirmation') && (
                        <Button onClick={onCancel} variant={'contained'} color={'info'}>
                            Cancel
                        </Button>
                    )}
                    {(type !== 'confirmation') && (
                        <Button onClick={onClose} color="primary" variant="contained">
                            Close
                        </Button>
                    )}
                    {(type === 'confirmation') && (
                        <Button onClick={onConfirm} color={'error'} variant="contained">
                            Yes
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};