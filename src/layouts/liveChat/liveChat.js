import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';
import { APP_COLORS, BACKEND_URL } from '../../constant/constant';
import NavBar from '../../components/navBar/navBar';
import { historyState } from '../../constant/global';
import { userService } from '../../services';
import './liveChat.css';
import io from 'socket.io-client';
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';

const LiveChat = () => {
    let socketRef = useRef(null);
    let scrollDiv = useRef(null);
    const [state, setState] = useState({
      supportUserName: '',
      isSupportOnline: false,
      msg: ""
    });
    const [activeUsers, setActiveUsers] = useState([
    ]);

    const [messages, setmessages] = useState([
    ]);

    const [selectedUser, setSelectedUser] = useState(null)

    const addActiveUser = (userId, userName) => {
      console.info(activeUsers, { userId, userName });
      const isUser = activeUsers.filter(elem => {
        console.info({ elem, userId })
        return elem.userId == userId
      });

      console.info({ isUser});

      //user is new then add to activeUSer list
      if (!isUser.length) {
        setActiveUsers(prev => {
          return [ { userId, userName, newMsgCount: 1 }, ...prev]
        });
      } else {
        // make old user online
        setActiveUsers(prev => {
          const latestUser = prev?.filter(elem => elem.userId === userId)[0];
          const arr = [
            { ...latestUser, newMsgCount: latestUser.newMsgCount + 1 || 1}, 
            ...prev?.filter(elem => elem.userId !== userId)
          ]
          return arr;
        });
      }
    }

    const setSelectedUserUser = (userId) => {
      setSelectedUser(userId);

      setActiveUsers(prev => {
        const arr = [...prev].map(elem => {
          if (elem.userId === userId){
            elem.newMsgCount = null;
          }

          return elem;
        })
        return arr;
      });
    }

    const getUser = async () => {
      try {
          const user = await userService.getUser();

          if (!user) {
              return;
          }

          setState((prev) => {
              return { ...prev, supportUserId: user._id, supportUserName: user.userName, roleKey: user.roleId?.roleKey }
          })
      } catch (err){
          console.error(`errror in getUser: ${err}`);
      }
    }

    const sendNotifiToNewUser = async (userId, userName, message) => {
      try {
        const newUserFound = activeUsers.filter(usr => usr.userId === userId);

        let data = {}
        if (!newUserFound?.length) {
          data = {
            title: `${userName} Joined Chat`,
            subtitle: 'A new user has joined chat',
            message: 'A new user has joined',
            native:true
          };
        } else {
          data = {
            title: `New Message from ${userName}`,
            subtitle: message,
            message: message,
            native:true
          }
        }

        addNotification(data);
      } catch (err){
          console.error(`errror in getUser: ${err}`);
      }
    }

    useEffect(() => {
      getUser();
      socketRef.current = io(BACKEND_URL);

      socketRef.current.on('newUserConnected', () => {
        socketRef.current.emit('supportConnectedFromLiveChat', { supportUserName: state.supportUserName, supportUserId: state.supportUserId, roleKey: state.roleKey });
        
        //callBack("a newUserConnected");
      });

      socketRef.current.on('offlineAppUser', ({ userId }) => {
        setActiveUsers(prev => {
          return prev.map((user)=> {
            if(userId === user?.userId){
              user.offline = true;
            }

            return user;
          })
        });

        // setActiveUsers(prev => {
        //   return prev.filter((user)=> {
        //     return user?.userId !== userId;
        //   })
        // });        
      });

      socketRef.current.emit('supportConnectedFromLiveChat', { supportUserName: state.supportUserName, supportUserId: state.supportUserId });

      socketRef.current.on('supportMessage' + state.supportUserId, ({ userId, userName, message, time, rid}, callBack) => {
          console.info(`message recieced`, message, userId, userName);
          let data = {msg: message, user: "app", userId: userId, supportUserId: selectedUser};

          // sends the notification for users
          sendNotifiToNewUser(userId, userName, message);
          
          addActiveUser(userId, userName);

          setmessages((prev) => {
              return [...prev, data]
          })
          callBack('Message recieved by user');
      });


      const user = userService.getUser();

      if (!user) {
        historyState.history.push('/admin');
      }

      return () => {
        console.info(`-------------> clearning function disconnect`);
        socketRef.current.disconnect();
      }
    }, [activeUsers, state.supportUserId]);

    function storeMsg(e){
      const {name, value} = e.target;
      setState({...state, [name]:value});
    }

    function handleMessages(e) {
      //console.log(" ****************** ");
      let msg = state.msg;
      let data = {msg:msg, user: "support", userId: selectedUser}
      setmessages([...messages, data]);

      socketRef.current.emit('supportMessageBackend', { message: state.msg, userId: selectedUser, supportUserId: state.supportUserId })
      setState({...state, msg:""});
    }

    const activeUsersList = activeUsers.map(user => {
      return (
        <Card className={`card-style ${selectedUser === user.userId? 'selected': ''}`} key={user.userId} onClick={() => setSelectedUserUser(user.userId)}>
          <Card.Body>
            <span className={`status + ${user.offline ? 'status-offline': 'status-online'}`}></span>
            <Card.Title>
              {user.userName}
              {
                user.newMsgCount 
                  ? <span className='newMsgCount'>{user.newMsgCount}</span>
                  : null
              }
            </Card.Title>
          </Card.Body>
        </Card>
      )
    });

    const scrollTo = ()=>{
      console.log(scrollDiv.current);
      if(!scrollDiv.current){
        return;
      }
      scrollDiv.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }
    const renderMessage = (selectedUserId, _messages) => {
      return _messages.filter(msg => msg.userId === selectedUserId).map(msg => {
        let classname = "alignLeft";
        if(msg.user == "support"){
          classname = "alignRight"
        }
        scrollTo();
        return (
          <div className='msgCont' ref={scrollDiv}>
            <Col className={classname}>
              {msg.msg}
            </Col>
          </div>
        )
      });
    }   

    return (
      <Container fluid>
        <Notifications />
        <Row>
            <Col className='text-center'>
                <h1>Live Chat</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <NavBar/>
            </Col>
        </Row>

        <Row>
          <Col sm={3}>
            <div className='left-users-panel'>
              {activeUsersList}
            </div>
          </Col>

          <Col sm={9} className="chat-section">
            <div className='right-chat-window'>
              {renderMessage(selectedUser, messages)}
            </div>
            <Row>
              <InputGroup className="">
                <Form.Control name="msg" value={state.msg} onChange={storeMsg} onKeyDown={(e) => {if(e.key === 'Enter' && state.msg && selectedUser){handleMessages(e)}}}
                  placeholder="Type your message"
                  aria-label="Message"
                />
                <Button variant="primary" disabled={!state.msg || !selectedUser} id="button-addon2" onClick={(e) =>handleMessages(e)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi send-icon bi-send-fill" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                  </svg>
                </Button>
            </InputGroup>
            </Row>
          </Col>
        </Row>

    </Container>
    )
}

export default LiveChat;