import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { domain } from "../../utils/config";
import openSocket from "socket.io-client";
import { Container } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import { useAlert } from "react-alert";


const LOAD_ROOM = "loadRoom"; // Name of the event
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: 50,
    marginBottom: 50,
  },
  list: {
    height: 400,
    overflowY: "auto",
  },
}));

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [listRoom, setListRoom] = useState([]);

  const alert = useAlert();

  const [secondary] = React.useState(false);
  const classes = useStyles();

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    // Create connection
    const socket = openSocket(domain);
    socket.on(LOAD_ROOM, (data) => {
      setListRoom(data);
    });
    socket.emit(LOAD_ROOM, () => {});
  }, []);

  const history = useHistory();
  const showModal = (tmp, name) => {
    history.push(`/${name}`);
  };

  const goTheRoom = () => {
    if (roomName.trim() === "") {
      alert.show("Nhập tên phòng");
    } else {
      history.push(`/${roomName}`);
    }
  };

  return (
    <div className="container">
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid item xs={12} md={12}>
                <Typography variant="h3" className={classes.title}>
                  DANH SÁCH PHÒNG CHAT
                </Typography>
                <div className={classes.list}>
                  <List>
                    {listRoom.map((value, index) => {
                      return (
                        <ListItem key={index}>
                          <HomeIcon />
                          &nbsp;
                          <ListItemText
                            primary={value.name}
                            secondary={secondary ? "Secondary text" : null}
                          />
                          <ButtonGroup
                            size="small"
                            color="primary"
                            aria-label="outlined primary button group"
                          >
                            <Button
                              onClick={(e) =>
                                showModal(value.isLock, value.name)
                              }
                            >
                              Join
                            </Button>
                            {/* <Button variant="outlined" color="secondary">Xóa</Button> */}
                          </ButtonGroup>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <TextField
                id="outlined-full-width"
                label="Room"
                style={{ margin: 8 }}
                placeholder="Nhập tên phòng cần tạo hoặc muốn join"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={handleRoomNameChange}
              />
              <Button variant="contained" onClick={goTheRoom} color="secondary">
                Join Room
              </Button>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </div>
  );
};

export default Home;
