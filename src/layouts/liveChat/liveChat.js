import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../../components/navBar/navBar';
import { historyState } from '../../constant/global';
import { userService } from '../../services';

const LiveChat = () => {
    useEffect(() => {
      const user = userService.getUser();

      if (!user) {
        historyState.history.push('/admin');
      }
    });
    return (
      <Container>
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
    </Container>
    )
}

export default LiveChat;