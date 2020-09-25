import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ModalConfirm(props) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setRoomName("");
    props.changeData();
  };

  const myHandleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    console.log(roomName, open)
    console.log(props.roomName, password);
  };

  return (
    <div>
      <Dialog
        open={props.isLock}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.roomName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Đây là phòng chát riêng tư, vui lòng nhập mật khẩu để tham gia.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="pasword"
            label="Mật khẩu"
            type="password"
            fullWidth
            onChange={(e) => myHandleChangePassword(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Tham gia
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
