import { GlobalStyles}  from 'Styles/Global';
import { Row, Col } from 'react-simple-flex-grid';
import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{...GlobalStyles.PageWrapper, ...{marginTop:30}}}>
            <h1 style={GlobalStyles.Header}>Home</h1>
            <h1 style={{...GlobalStyles.SubTitle, ...{color: 'rgba(0,0,0,0.6)'}}}>Welcome To OpenJove</h1>
            <hr style={{marginTop:30,backgroundColor:'rgba(0,0,0,0.4)'}}/>
            <Row>
                <Col xs={{span:12,offset:0}} sm={{span:8,offset:2}}>
                    <div style={GlobalStyles.CardWrapper}>
                        <h1 style={GlobalStyles.Header}>Getting Started <span style={{color: GlobalStyles.Colors.secondary}}>Viewing</span></h1>
                        <ol type="1" style={GlobalStyles.Body}>
                            <li >
                                Start by navigating to the Radio Jove Archive <a target="_blank" href="http://radiojove.org/query/inventory.php" style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}}>Here</a>
                            </li>
                            <li>
                                Download your desired recording. Make sure it's an SPD!
                            </li>
                            <li>
                                Upload the SPD <Link style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}} to="/upload">Here</Link>
                            </li>
                        </ol>
                    </div>
                    <div style={GlobalStyles.CardWrapper}>
                        <h1 style={GlobalStyles.Header}>Getting Started <span style={{color: GlobalStyles.Colors.primary}}>Recording</span></h1>
                        <ol type="1" style={GlobalStyles.Body}>
                            <li>Plug in your receiver to your microphone port. We found <a target="_blank" href="https://www.amazon.com/gp/product/B00IRVQ0F8/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1" style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}}>this</a> connector works well for modern devices.</li>
                            <li>
                                Make sure you've selected the receiver as your input device.
                                <ul>
                                    <li>For Mac Users: <a target="_blank" href="https://support.apple.com/guide/mac-help/change-the-sound-input-settings-mchlp2567/mac" style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}}>This</a> article will help</li>
                                    <li>For Windows Users: <a target="_blank" href="https://support.microsoft.com/en-us/windows/how-to-set-up-and-test-microphones-in-windows-ba9a4aab-35d1-12ee-5835-cccac7ee87a4" style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}}>This</a> article will help</li>
                                </ul>
                            </li>
                            <li>
                                Go to the <Link to="/record" style={{textDecoration:'none',color:GlobalStyles.Colors.primary,fontWeight:600}}>Record</Link> page and follow the prompts.
                            </li>
                        </ol>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Home;