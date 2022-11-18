import { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import NavBar from '../../components/navBar/navBar';
import { recordingService } from '../../services';
import './recordings.css';
const Recordings = ()=> {
    const [recordings, setRecordings] = useState([]);

    const getUserRecordings = async () => {
        try {
            const  data = await recordingService.getAllUserRecordings('{ "size": 1000 }');
            console.info(data?.data?.data);
            if(data?.data) {
                setRecordings(data.data?.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateUserRecording = async (id, action, prevFlag) => {
        const payload = {
            _id: id,
        }
        if (action === 'toggleSuspicious') {
            payload.isSuspicious = !prevFlag;
        } else if (action === 'markToggle') {
            payload.isChecked = !prevFlag;
        }
        setRecordings(prev => {
            return prev?.map(elem => { 
                if (elem._id == id) {
                    elem = { ...elem, ...payload}
                }
                return elem
            })
        })
        console.info({ payload });
        const  data = await recordingService.updateUserRecording(payload);

        console.info(data);
    }

    useEffect(()=> {
        getUserRecordings();
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className='center'>Recordings</h1>
                </Col>
            </Row>

            <Row>
            <Col>
                <NavBar/>
            </Col>

            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>User Id</th>
                                <th>User Name</th>
                                <th>Test Id</th>
                                <th>Test Name</th>
                                <th>Is Suspicious</th>
                                <th>Is Checked</th>
                                <th>Video</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                recordings?.length 
                                    ? recordings?.map((elem, idx) => (
                                        <tr>
                                            <td>{idx+1}</td>
                                            <td>{elem.userId?._id}</td>
                                            <td>{elem.userId?.userName}</td>
                                            <td>{elem.testId?._id}</td>
                                            <td>{elem.testId?.testName}</td>
                                            <td className={elem.isSuspicious ? 'active' : ''}>{elem.isSuspicious?.toString()}</td>
                                            <td className={elem.isChecked ? 'active' : ''}>{elem.isChecked?.toString()}</td>
                                            <td><a href={elem.videoUrl} target="_blank"><video src={elem.videoUrl} width="100"></video></a></td>
                                            <td>
                                                <button onClick={() => updateUserRecording(elem._id, 'toggleSuspicious', elem.isSuspicious)}>Toggle Suspicious</button>
                                                <button onClick={() => updateUserRecording(elem._id, 'markToggle', elem.isChecked)}>Toggle Checked</button>
                                            </td>
                                        </tr>
                                        ))
                                    : null
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Row>
        </Container>
    )
}

export default Recordings;