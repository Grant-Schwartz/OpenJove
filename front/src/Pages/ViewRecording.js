import { useState, useEffect, useMemo } from 'react';
import { GlobalStyles}  from 'Styles/Global';
import { Row, Col } from 'react-simple-flex-grid';
import {
  useParams
} from "react-router-dom";
import Loader from "react-loader-spinner";
import { getRecording } from 'api/Recordings';
import { Accordion, AccordionItem } from 'Components/Accordion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import CanvasJSReact from 'canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const styles = {
    loadingSpinnerWrapper: {
        position: "fixed", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)"
    }
}

const ChannelGraph = ({ recordingData }) => {
    var ch1 = [];
    var ch2 = []
    for (var i = 0; i < recordingData.ch1.length; i++) {
        ch1.push({ x: new Date(recordingData.timestamps[i]), y: recordingData.ch1[i] })
        if (recordingData.ch2) {
            ch2.push({ x: new Date(recordingData.timestamps[i]), y: recordingData.ch2[i] })
        }
    }
    const options = {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
            text: recordingData.generated ? recordingData.header.recording_name : `${recordingData.header.author} in ${recordingData.header.location}`
        },
        axisY: {
            title: "SPU",
            
        },
        data: [
            {
                type: "spline",
                dataPoints: ch1,
                name: 'Ch1',
                showInLegend: true,
                markerType: 'none',
                legendMarkerType: 'none',
                color: '#ae0700',
            },
            {
                type: "spline",
                dataPoints: ch2,
                name: 'Ch2',
                showInLegend: true,
                markerType: 'none',
                legendMarkerType: 'none',
                color: '#0000F5',
            }  
        ]
    }
    
    return (
        <div>
        <CanvasJSChart options = {options}
            /* onRef = {ref => this.chart = ref} */
        />
        </div>
    );
}

const RecordingDetails = ({ header, generated }) => {
    return (
        <div>
            {generated ? <p>Observing: {header.observing}</p> : null}
            <p>Start: {formatDate(header.start)} UTC</p>
            <p>Finish: {formatDate(header.finish)} UTC</p>
            <p>Location: {header.location}</p>
            <p>Latitude: {header.lat}</p>
            <p>Longitude: {header.lng}</p>
            {generated ? <p>Receiver System: {header.receiverDetails}</p> : null}
            {generated ? <p>Calibrated: {header.calibrated}</p> : null}
        </div>
    );
}

const RecordingMap = ({ lat, lng, name }) => {
    return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
    >
    <ZoomableGroup zoom={1}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies
            .map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
        }
      </Geographies>

        <Marker key={name} coordinates={[lat,lng]}>
          <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
        </ZoomableGroup>
    </ComposableMap>
    );
}

const formatDate = (dateStr) => {
    var date = new Date(dateStr);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return `${(date.getMonth()+1)}/${date.getDate()}/${date.getFullYear()} ${strTime}`

}

function NewlineText(props) {
  const text = props.text;
  const newText = text.split('\n').map(str => <p>{str}</p>);
  
  return newText;
}

function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}

function ViewRecording(props) {
    const { rid } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    console.log(data)
    useEffect(() => {
        setLoading(true);
        getRecording(rid).then(resp => {
            setData(resp);
            setLoading(false)

        });

    }, []);
    return (
        <div style={GlobalStyles.PageWrapper}>
            {data ?
                <Row>
                    <Col xs={{span:12,offset:0}} sm={{span:8,offset:2}}>
                        <div style={GlobalStyles.CardWrapper}>
                            <ChannelGraph recordingData={data} />
                            <Accordion defaultIndex="1" style={{marginTop:'20px'}}>
                                <AccordionItem label="Details" index="1">
                                    <RecordingDetails header={data.header} generated={data.generated}/>
                                </AccordionItem>
                                <AccordionItem label="Note" index="2">
                                    <pre><p style={{whiteSpace: 'pre-wrap'}}>{data.generated ? data.note : data.note}</p></pre>
                                </AccordionItem>
                                {/* <AccordionItem label="Location" index="3">
                                    <RecordingMap lat={data.header.lat} lng={data.header.lng} name={data.generated ? data.header.recording_name : data.header.author} />
                                </AccordionItem> */}
                            </Accordion>
                        </div>
                        
                    </Col>
                </Row>
            : 
            <div style={styles.loadingSpinnerWrapper}>
                <Loader
                    type="Oval"
                    color={GlobalStyles.Colors.secondary}
                    height={50}
                    width={40}
                />
            </div>
            }
        </div>
    );
}

export default ViewRecording;