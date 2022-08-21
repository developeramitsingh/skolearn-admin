import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { historyState } from '../../constant/global';
import { userService } from '../../services/index';
import './login.css';


const Login = (props) => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpToken, setOtpToken] = useState('');

    useEffect(() => {
        const user = userService.getUser();
        console.info({user});
        if (user) {
            console.info(`user already logged in`);
            historyState.history.push('/admin/home')
        }
    }, []);

    const handleChange = (e, key) => {
        console.info(e.target.value)

        if (key === 'mobile') {
            setMobile(e.target.value);
        } else if (key === 'otp') {
            setOtp(e.target.value);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const data  = {
            mobile,
        }

        console.info('handle login', { data });

        try {
            const res = await userService.login(data);
            console.info({ token: res.data.otpToken});
            if (res.data) {
                setOtpToken(res.data.otpToken);
                setMobile('');
            }
        }  catch (err) {
            console.error(err);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        
        const data  = {
            otp,
        }

        console.info('handle verify otp', { data });

        try {
            const res = await userService.verifyOtp(data, otpToken);

            if(res) {
                userService.doAfterLogin(res.data.token);
                historyState.history.push('/admin/liveChat')

            }
        }  catch (err) {
            console.error(err);
        }
    }

    return (
        <Container fluid className="loginCont d-flex justify-content-center align-items-center">
            <Form className='loginForm text-center d-flex flex-column justify-content-between'>
                <h1>Skolearn Admin</h1>
                <h2>Login</h2>
                {
                    
                    otpToken ?
                    <>
                        <Form.Group className="mb-3" controlId="formBasic">
                            <Form.Control className='text-center' type="text" id='otpInput' onChange={(e)=> handleChange(e, 'otp')} placeholder="Enter OTP" value = { otp }/>
                        </Form.Group>
                        <Button onClick={(e) => verifyOtp(e)} variant="primary" type="submit">
                            Verify OTP
                        </Button>
                        <p>OTP sent</p>
                    </>
                    : <>
                        <Form.Group className="mb-3" controlId="formBasic">
                            <Form.Control className='text-center' type="text" id='mobileInput' onChange={(e)=> handleChange(e, 'mobile')} placeholder="Enter mobile" value = { mobile } />
                        </Form.Group>

                        <Button onClick={(e) => handleLogin(e)} variant="primary" type="submit">
                            Submit
                        </Button>
                    </>   
                }
                
            </Form>
        </Container>
    )
}

export default Login;