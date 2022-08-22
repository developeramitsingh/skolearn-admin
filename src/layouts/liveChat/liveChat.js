import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';
import { APP_COLORS, BACKEND_URL } from '../../constant/constant';
import NavBar from '../../components/navBar/navBar';
import { historyState } from '../../constant/global';
import { userService } from '../../services';
import './liveChat.css';
import io from 'socket.io-client';

const LiveChat = () => {
    let socketRef = useRef(null);
    const [state, setState] = useState({
      supportUserName: '',
      isSupportOnline: false,
      msg:""
    });
    const [activeUsers, setActiveUsers] = useState([
      {
        userId: '1',
        userName: 'Amit',
      }
    ]);

    const [messages, setmessages] = useState([
    ]);

    useEffect(() => {
      socketRef.current = io("https://65b4-43-239-207-152.in.ngrok.io");

      socketRef.current.emit('supportConnectedFromLiveChat', { supportUserName: "Nityanand",supportUserId: 123 });

      socketRef.current.on('supportMessage', ({ sid, userId, message, time, rid}, callBack) => {
          console.info(`message recieced`, message, userId);
          let data = {msg: message, user: "app"};
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
        socketRef.current.disconnect();
      }
    }, []);

    function storeMsg(e){
      const {name, value} = e.target;
      setState({...state, [name]:value});
    }

    function handleMessages(e) {
      //console.log(" ****************** ");
      let msg = state.msg;
      let data = {msg:msg, user: "support"}
      setmessages([...messages, data]);

      socketRef.current.emit('supportMessageBackend', { message: state.msg, supportUserId: 123 })
      setState({...state, msg:""});
    }

    const activeUsersList = activeUsers.map(user => {
      return (
        <Card>
          <Card.Body>
            
            <Card.Title>{user.userName}</Card.Title>
          </Card.Body>
        </Card>
      )
    });

    const renderMessage = messages.map(msg => {
      let classname = "alignLeft";
      if(msg.user == "support"){
        classname = "alignRight"
      }
      return (
        <div className='msgCont'>
          <Col className={classname}>
            {msg.msg}
          </Col>
        </div>
      )
    });

    return (
      <Container fluid>
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
              {renderMessage}
            </div>
            <Row>
              <InputGroup className="">
                <Form.Control name="msg" value={state.msg} onChange={storeMsg} onKeyDown={(e) => {if(e.key === 'Enter'){handleMessages(e)}}}
                  placeholder="Type your message"
                  aria-label="Message"
                />
                <Button variant="primary" disabled={!state.msg} id="button-addon2" onClick={(e) =>handleMessages(e)}>
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