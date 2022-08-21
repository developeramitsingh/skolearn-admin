import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavBar from '../../components/navBar/navBar';
import { historyState } from '../../constant/global';
import { userService } from '../../services';
import './liveChat.css';

const LiveChat = () => {
    const [state, setState] = useState({

    });
    const [activeUsers, setActiveUsers] = useState([
      {
        userId: '1',
        userName: 'Amit',
      }
    ]);

    useEffect(() => {
      const user = userService.getUser();

      if (!user) {
        historyState.history.push('/admin');
      }
    });

    const activeUsersList = activeUsers.map(user => {
      return (
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            
            <Card.Title>{user.userName}</Card.Title>
          </Card.Body>
        </Card>
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
          <Col lg={4}>
            <div className='left-users-panel'>
              {activeUsersList}
            </div>
          </Col>

          <Col lg={8}>
            <div className='right-chat-window'>
            </div>
          </Col>
        </Row>
    </Container>
    )
}

export default LiveChat;