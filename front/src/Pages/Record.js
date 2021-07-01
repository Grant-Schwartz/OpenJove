import { useState } from 'react';
import { GlobalStyles}  from 'Styles/Global';
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";
import { RecordForm } from 'Components/RecordForm';
import { RecordLocation } from 'Components/RecordLocation';
import { Recording } from 'Components/Recording';
import { uploadRecording } from 'api/Recordings';
import { v4 as uuidv4 } from 'uuid';

function Record(props) {
    const [currentScreen,setCurrentScreen] = useState('details');
    const [recordingName, setRecordingName] = useState('');
    const [author, setAuthor] = useState('');
    const [observing, setObserving] = useState('');
    const [recieverDetails, setRecieverDetails] = useState('');
    const [recieverLocation, setRecieverLocation] = useState('');
    const [calibrated, setCalibrated] = useState('');
    const [recordingNotes, setRecordingNotes] = useState('');
    const [location, setLocation] = useState();
    const [start, setStart] = useState();
    const [finish, setFinish] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const complete = (mediaBlob) => {
        setLoading(true);
        var data = new FormData();
        data.append('recording_name',recordingName);
        data.append('author',author)
        data.append('observing',observing);
        data.append('receiver_details',recieverDetails);
        data.append('receiver_location',recieverLocation);
        data.append('calibrated',calibrated);
        data.append('recording_notes',recordingNotes);
        data.append('long',location.long);
        data.append('lat',location.lat);
        data.append('start',start.toISOString());
        data.append('finish',finish.toISOString());
        data.append("audio_data",mediaBlob, `${uuidv4()}.wav`);
        uploadRecording(data).then(resp => {
            setLoading(false);
            if (!resp.hasOwnProperty('rid')) {
                setError('A Network or Server Error Has Occured')
            } else {
                setError('')
                props.history.push(`/view/${resp.rid}`);
            }
        });
    }
    return (
        <div style={GlobalStyles.PageWrapper}>
            <Row>
                <Col xs={{span:12,offset:0}} sm={{span:6,offset:3}}>
                {currentScreen === 'details' ?
                    <RecordForm 
                        setCurrentScreen={setCurrentScreen}
                        setRecordingName={setRecordingName}
                        setAuthor={setAuthor}
                        setObserving={setObserving}
                        setRecieverDetails={setRecieverDetails}
                        setRecieverLocation={setRecieverLocation}
                        setCalibrated={setCalibrated}
                        setRecordingNotes={setRecordingNotes}
                    />
                : ( currentScreen === 'location' ?
                    <RecordLocation setCurrentScreen={setCurrentScreen} setLocation={setLocation} />
                : <Recording loading={loading} setLoading={setLoading} setStart={setStart} setFinish={setFinish} complete={complete} error={error}/>
                ) }
                </Col>
            </Row>
        </div>
    );
}

export default Record;