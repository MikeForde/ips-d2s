import { useMemo, useState } from 'react';
import axios from 'axios';
import {
  Form,
  Button,
  DropdownButton,
  Dropdown
} from 'react-bootstrap';
import { useLoading } from '../contexts/LoadingContext';

const UnifiedIPSGetPage = () => {
  const [name, setName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [ipsData, setIpsData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const { startLoading, stopLoading } = useLoading();

  const isLocalhost = useMemo(() => {
    const host = window.location.hostname;

    return host === 'localhost' || host === '127.0.0.1';
  }, []);

  /*
   * The frontend contains only target IDs and display labels.
   *
   * It does NOT contain the actual URLs used by /fetchips.
   * The backend converts these IDs into approved URLs.
   */
  const targets = useMemo(() => {
    const targetList = [
      {
        key: 'ips-mern',
        label: 'IPS MERN Azure',
      },
      {
        key: 'vitalsiq',
        label: 'VitalsIQ',
      },
    ];

    /*
     * Preserve the existing behaviour where the SERN D2S
     * target is only offered when running the frontend locally.
     */
    if (isLocalhost) {
      targetList.push({
        key: 'ips-sern-d2s',
        label: 'IPS SERN D2S',
      });
    }

    return targetList;
  }, [isLocalhost]);

  const [target, setTarget] = useState('ips-mern');

  const selectedTargetLabel =
    targets.find((item) => item.key === target)?.label || target;

  const handleTargetChange = (selectedTarget) => {
    setTarget(selectedTarget);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading();

    try {
      const response = await axios.get('/fetchips', {
        params: {
          target,
          name,
          givenName,
        },
      });

      setIpsData(response.data);
      setError(null);
      setMessage('');
    } catch (err) {
      console.error('Error fetching IPS record:', err);

      setError('Failed to fetch IPS data');
      setIpsData(null);
    } finally {
      stopLoading();
    }
  };

  const handleTransform = async () => {
    try {
      await axios.post('/ipsbundle', ipsData);

      setMessage(
        'IPS record successfully transformed and saved to MongoDB'
      );

      setError(null);
    } catch (err) {
      console.error('Error transforming IPS record:', err);

      setMessage(err.message);
      setError('Failed to transform IPS record');
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h3>External IPS API - GET (Pull)</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              type="text"
              placeholder="Family/Surname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="givenName">
            <Form.Control
              type="text"
              placeholder="First/Given Name"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              required
            />
          </Form.Group>

          <div className="dropdown-container mb-2">
            <DropdownButton
              id="dropdown-target-get"
              title={`Target Endpoint: ${selectedTargetLabel}`}
              onSelect={handleTargetChange}
              className="dropdown-button"
            >
              {targets.map((item) => (
                <Dropdown.Item
                  key={item.key}
                  eventKey={item.key}
                  active={target === item.key}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>

          <Button
            variant="primary"
            type="submit"
          >
            Submit GET Request
          </Button>
        </Form>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {ipsData && (
          <div>
            <h4>IPS Data</h4>

            <div className="text-area">
              <Form.Control
                as="textarea"
                rows={10}
                value={JSON.stringify(ipsData, null, 2)}
                readOnly
              />
            </div>

            <Button
              variant="success"
              onClick={handleTransform}
            >
              Transform to IPS MERN Record
            </Button>
          </div>
        )}

        {message && (
          <p style={{ color: 'green' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UnifiedIPSGetPage;