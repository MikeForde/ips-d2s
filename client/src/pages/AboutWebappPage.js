import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function AboutWebAppPage() {
    const isHostedOnD2S = window.location.href.includes("d2s");
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h2>About This Web Application</h2>
                    <p>
                        Built using the <a href="https://medium.com/@ksekwamote/how-to-build-a-sern-application-dc358b48defe" target="_blank" rel="noopener noreferrer">SERN Stack</a>. SERN stands for SQL, Express.js, React, and Node.js.
                    </p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Development Pipeline</h3>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                The development pipeline involves the following steps:
                                <ol>
                                    <li>Development Environment Until 0_18: Linux ubuntu-like distribution (<a href="https://www.bodhilinux.com" target="_blank" rel="noopener noreferrer">Bodhi</a>) running on a virtual machine (VM).</li>
                                    <li>Development Environment 0_19 and Beyond: Docker - Node 22 Bookworm</li>
                                    <li>Version Control: <a href="https://github.com/MikeForde/mern-azure" target="_blank" rel="noopener noreferrer">GitHub</a>.</li>
                                    <li>Continuous Deployment: GitHub Actions, which automates the deployment process to a cloud instance whenever changes are pushed to the <a href="https://github.com/MikeForde/mern-azure" target="_blank" rel="noopener noreferrer">GitHub Repository</a>.</li>
                                </ol>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Hosting Options</h3>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                {isHostedOnD2S ? (
                                    <>
                                        This web application is currently being hosted on a cloud service.<br />
                                        It can be hosted easily on a closed network, and stood-up via standalone Linux, virtual machine (VM), or a container e.g. Docker.
                                    </>
                                ) : (
                                    <>
                                        This web application is currently being hosted on a closed network.<br />
                                        It can be hosted easily on a cloud service, for example OpenShift (incl. D2S), Microsoft Azure etc.
                                    </>
                                )}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <h3>Future Development and Experimentation</h3>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                Many features of this prototype web application are designed for demonstration and experimentation. Certain aspects would therefore either not be included or implemented in the same manner in a production-ready version. Feedback and ideas are always welcome.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default AboutWebAppPage;
