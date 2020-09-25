import React, { useState, useEffect } from "react";
import useChat from "../UseChat";
import { domain } from "../../utils/config";
import openSocket from "socket.io-client";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";

const LOAD_MESSAGE_FROM_ROOM = "loadMessageFromRoom"; // Name of the event

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: 300,
    overflowY: "auto",
  },
  title: {
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 15,
    color: "rgba(0, 0, 0, 0.54)",
  },
  contentSend: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: 5,
  },
  goHome: {
    color: "#439889",
  },
}));

const ChatRoom = (props) => {
  const { roomId } = props.match.params; // Gets roomId from URL
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent
  const [listMessageFromDB, setListMessageFromDB] = useState([]);
  const [name, setName] = useState("");
  const { messages, sendMessage } = useChat(roomId, name);

  const classes = useStyles();

  // Get list message in room;
  useEffect(() => {
    const socket = openSocket(domain);
    socket.on(LOAD_MESSAGE_FROM_ROOM, (data) => {
      setListMessageFromDB(data);
    });
    socket.emit(LOAD_MESSAGE_FROM_ROOM, roomId);
  }, [roomId]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  const changeName = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="container">
      <Container fixed>
        <Typography variant="h3" className={classes.title}>
          Room: {roomId}
          &nbsp;
          <Link className={classes.goHome} to="/">
            <KeyboardReturnIcon />
          </Link>
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className="messages-container">
                <ol className="messages-list">
                  {listMessageFromDB.map((message, i) => (
                    <Tooltip
                      key={i}
                      placement="right"
                      title={moment(message.createAt).format(
                        "hh:mm  - MM/DD/YYYY"
                      )}
                    >
                      <li className="message-item">{message.message}</li>
                    </Tooltip>
                  ))}
                  {messages.map((message, i) => (
                    <li
                      key={i}
                      className={`message-item ${
                        message.ownedByCurrentUser
                          ? "my-message"
                          : "received-message"
                      }`}
                    >
                      {message.body}
                    </li>
                  ))}
                </ol>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.contentSend}>
              <div>
                <TextField
                  id="outlined-basic"
                  className="full-width"
                  label="Tên"
                  variant="outlined"
                  value={name}
                  onChange={changeName}
                />
              </div>
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Nội dung"
                  multiline
                  className="full-width"
                  rows={4}
                  variant="outlined"
                  value={newMessage}
                  onChange={handleNewMessageChange}
                />
              </div>

              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<SendIcon>send</SendIcon>}
                onClick={handleSendMessage}
              >
                Gửi
              </Button>

              {/* <button
                onClick={handleSendMessage}
                className="send-message-button"
              >
                Send
              </button> */}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ChatRoom;
