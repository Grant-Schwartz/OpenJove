import { useState } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import Loader from "react-loader-spinner";
import { GlobalStyles}  from 'Styles/Global';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const styles = {
    wrapper: {
        border: `2px solid ${GlobalStyles.Colors.shade}`,
        borderRadius: 10,
        marginTop: '30px',
        padding: '20px'
    },
    audioControl: {
        width: '100%'
    },
    startRecording: {
        width: '100%',
        height: '45px',
        border: 'none',
        backgroundColor: GlobalStyles.Colors.danger,
        color: '#fff',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '10px'
    },
    stopRecording: {
        width: '100%',
        height: '45px',
        border: 'none',
        backgroundColor: GlobalStyles.Colors.secondary,
        color: '#fff',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '40px'
    },
    next: {
        width: '100%',
        height: '45px',
        border: 'none',
        backgroundColor: GlobalStyles.Colors.primary,
        color: '#fff',
        borderRadius: '10px',
        fontSize: '18px',
        fontWeight: '500',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center'
    }
}

export const Recording = (props) => {
    const [recordState, setRecordState] = useState(null);
    const [blob, setBlob] = useState();
    return (
        <div style={styles.wrapper}>
            <h1 style={GlobalStyles.Header}>Create A Recording</h1>
            <div>
            
            {recordState !== RecordState.START & !blob ? 
                <h1 style={GlobalStyles.SubTitle}>Click Start Recording To Record</h1>
            : (
                recordState === RecordState.START ?
                <h1 style={{...GlobalStyles.SubTitle, ...{color: GlobalStyles.Colors.danger}}}>Recording</h1>
                : <h1 style={GlobalStyles.SubTitle}>Recording Complete</h1>
            )
            }
            <div style={{display:'flex',alignItems:'center'}}>
            <AudioReactRecorder 
                state={recordState} 
                onStop={(blob) => setBlob(blob)}
                backgroundColor="#fff"
                canvasWidth={400}
            />
            </div>
            <button 
                style={{
                    ...styles.startRecording,
                    ...(recordState === RecordState.START | props.loading === true ? {backgroundColor: GlobalStyles.Colors.danger_75} : null),
                }} 
                onClick={() => {props.setStart(new Date());setRecordState(RecordState.START)}}
            >
                {!blob ? 'Start Recording' : 'Restart Recording'}
            </button>
            <button 
                style={{
                    ...styles.stopRecording,
                    ...(recordState !== RecordState.START | props.loading === true ? {backgroundColor: GlobalStyles.Colors.secondary_50} : null)
                }} 
                onClick={() => {setRecordState(RecordState.STOP);props.setFinish(new Date());}}
            >
                Stop Recording
            </button>
            <p style={{...GlobalStyles.Body, ...{margin:0, color: GlobalStyles.Colors.danger} }}>{props.error ? props.error : null}</p>
            {recordState === RecordState.STOP ? 
                <button style={styles.next}
                    onClick={() => {
                        props.complete(blob.blob)
                    }}
                >
                    {props.loading === false ? 
                        'Next'
                    :
                    <Loader
                        type="Oval"
                        color="#fff"
                        height={30}
                        width={30}
                    />
                    }
                </button>
            : null}
            </div>
        </div>
    );
}