import { WorldVectorMap } from '@/components/VectorMap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col, ProgressBar, Row } from 'react-bootstrap';

const SessionsByCountry = () => {
  const options = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,

    markers: [
      {
        name: 'Aditya Engineering College',
        coords: [17.0896, 82.0657],
      },
    ],

    markerStyle: {
      initial: {
        fill: '#7f56da',
      },
      selected: {
        fill: '#22c55e',
      },
    },

    labels: {
      markers: {
        render: marker => marker.name,
      },
    },

    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-bottom border-dashed">
        <CardTitle>Sessions by Country</CardTitle>
      </CardHeader>

      <CardBody className="py-0">
        <Row className="align-items-center">
          {/* Map Section */}
          <Col lg={7}>
            <div id="world-map-markers" className="my-3">
              <WorldVectorMap height="300px" width="100%" options={options} />
            </div>
          </Col>

          {/* Organization Details Section */}
          <Col lg={5} dir="ltr">
            <div className="my-4">
              <h5 className="mb-3">Organization Details</h5>

              <div className="mb-3 d-flex align-items-center">
                <IconifyIcon icon="mdi:school" className="me-2 text-primary" />
                <span>
                  <strong>Name:</strong> Aditya Engineering College
                </span>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <IconifyIcon icon="mdi:map-marker" className="me-2 text-success" />
                <span>
                  <strong>Location:</strong> Surampalem, Andhra Pradesh, India
                </span>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <IconifyIcon icon="mdi:account-group" className="me-2 text-warning" />
                <span>
                  <strong>Type:</strong> Educational Institution
                </span>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <IconifyIcon icon="mdi:web" className="me-2 text-info" />
                <span>
                  <strong>Website:</strong>{' '}
                  <a
                    href="https://aec.edu.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aec.edu.in
                  </a>
                </span>
              </div>

              <div className="mt-4">
                <small className="text-muted">Session Activity</small>
                <ProgressBar now={75} label="75%" className="mt-2" />
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SessionsByCountry;
