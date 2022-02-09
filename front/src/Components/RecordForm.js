import { GlobalStyles}  from 'Styles/Global';
import { TextInput } from 'Components/TextInput';
import { Dropdown } from 'Components/Dropdown';
import { TextArea } from 'Components/TextArea';
import { useState } from 'react';

const styles = {
    recordForm: {
        border: `2px solid ${GlobalStyles.Colors.shade}`,
        borderRadius: 10,
        marginTop: '30px',
        padding: '20px'
    },
    nextBtn: {
        height:'45px',
        width:'100%',
        marginTop:'30px',
        border: 'none',
        backgroundColor: GlobalStyles.Colors.primary,
        color: '#fff',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: '500',
        transition: 'background-color .2s ease'
    }
}

export const RecordForm = ({setCurrentScreen, setRecordingName, setAuthor, setObserving, setRecieverDetails, setRecieverLocation, setCalibrated, setRecordingNotes}) => {
    const [nextHover, setNextHover] = useState(false);
    const [error, setError] = useState('');
    const validate_form = () => {
        const recording_name = document.getElementById('recording-name').value;
        const author = document.getElementById('author-name').value;
        const author_name = document.getElementById('author-name').value;
        const observing = document.getElementById('celestial-body').value;
        const reciever_details = document.getElementById('reciever-details').value;
        const reciever_location = document.getElementById('reciever-location').value;
        const calibrated = document.getElementById('calibrated').value;
        const recording_notes = document.getElementById('notes').value;
        if (recording_name.trim() === '' | author.trim() === '' | author_name.trim() === '' | reciever_details.trim() === '' | reciever_location.trim() === '') {
            setError('Please fill in the highlighted fields.')
        } else {
            setRecordingName(recording_name);
            setAuthor(author)
            setObserving(observing);
            setRecieverDetails(reciever_details);
            setRecieverLocation(reciever_location);
            setCalibrated(calibrated);
            setRecordingNotes(recording_notes)
            setCurrentScreen('location');
        }
    }
    return (
        <div style={styles.recordForm}>
            <h1 style={GlobalStyles.Header}>Record</h1>
            <h1 style={GlobalStyles.SubTitle}>Create A New Recording</h1>
            <TextInput id="recording-name" formError={error} required={true} placeholder="Recording Name" type="text" label="Name" />
            <TextInput id="author-name" formError={error} required={true} placeholder="Author Name" type="text" label="Author Name" />

            <Dropdown id="celestial-body" options={{'Sun':'The Sun','Galactic Backround':'Galactic Background','Interference':'Interference','Solar Eclipse':'A Solar Eclipse','Jupiter':'Jupiter'}} label="Observing"/>
            <TextInput id="reciever-details" formError={error} required={true} placeholder="Receiver Details" type="text" label="Receiver System" />
            <TextInput id="reciever-location" formError={error} required={true}  placeholder="Address" type="text" label="Receiver Location" />
            <Dropdown id="calibrated" options={{'yes':'Yes','no':'No'}} label="Calibrated"/>
            <TextArea id="notes" formError={error} required={false}  label="Recording Notes" />
            <button
                style={{...styles.nextBtn,...(nextHover ? {backgroundColor: GlobalStyles.Colors.primary_75} : null)}}
                onMouseEnter={() => setNextHover(true)}
                onMouseLeave={() => setNextHover(false)}
                onClick={() => {validate_form()}}
            >
                Next
            </button>
        </div>
    );
}