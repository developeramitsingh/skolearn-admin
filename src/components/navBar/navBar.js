import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { historyState } from '../../constant/global';
import { userService } from '../../services';

const NavBar = () => {
  const handleLogout = () => {
    userService.dologout();
    historyState.history.push('/admin');
  }
  return (
    <>
      <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav activeKey="/admin/home" className="me-auto">
            <Nav.Item className='m-3'>
              <NavLink to='/admin/home'>Home</NavLink>
            </Nav.Item>

            <Nav.Item className='m-3'>
              <NavLink to='/admin/liveChat'>Live Chat</NavLink>
            </Nav.Item>

            <Nav.Item className='m-3'>
              <Button onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default NavBar;