import { useState } from 'react';  
import { GlobalStyles}  from 'Styles/Global';
import { Row, Col } from 'react-simple-flex-grid';
import { StyledDropZone } from 'react-drop-zone'
import { uploadSPD } from 'api/Recordings';
import 'react-drop-zone/dist/styles.css'

function Upload(props) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState();
    const upload = (file) => {
        setUploading(true)
        uploadSPD(file).then(resp => {
            setUploading(false);
            if (!resp.hasOwnProperty('rid')) {
                setError('A Network or Server Error Has Occured')
            } else {
                setError('')
                props.history.push(`/view/${resp.rid}`);
            }
        })
    }
    return (
        <div style={GlobalStyles.PageWrapper}>
            <Row>
                <Col xs={{span:12,offset:0}} sm={{span:6,offset:3}}>
                    <div style={GlobalStyles.CardWrapper}>
                        <h1 style={GlobalStyles.Header}>Upload An SPD</h1>
                        <h1 style={GlobalStyles.SubTitle}>Select or Drag a File</h1>
                        {!uploading ? 
                        <StyledDropZone
                            id="upload"
                            style={{
                                border: `2px solid ${GlobalStyles.Colors.primary}`,
                                marginTop: 20
                            }}
                            multiple={false}
                            accept=".spd"
                            onDrop={(file) => upload(file)}
                        />
                        : <h1 style={{...GlobalStyles.SubHeader,...{marginTop:20, color: GlobalStyles.Colors.primary}}}>Uploading & Converting your SPD...</h1>}
                        {error ? 
                            <h1 style={{...GlobalStyles.SubHeader,...{marginTop:20, color: GlobalStyles.Colors.danger}}}>{error}</h1>
                        : null}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Upload;