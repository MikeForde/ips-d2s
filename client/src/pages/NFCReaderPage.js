import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import './Page.css';

export default function NFCReaderPage() {
  const [readData, setReadData] = useState('');
  const [rawPayload, setRawPayload] = useState('');
  const [cardInfo, setCardInfo] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Toast state
  const [showToast, setShowToast]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');
  const [toastVariant, setToastVariant] = useState('info');

  // Custom MIME type
  const BINARY_MIME = 'application/x.ips.gzip.aes256.v1-0';

  const handleReadFromNfc = async () => {
    if (!('NDEFReader' in window)) {
      setToastMsg('Web NFC is not supported on this device/browser.');
      setToastVariant('warning');
      setShowToast(true);
      return;
    }

    setIsReading(true);
    setReadData('');
    setRawPayload('');
    setCardInfo('');
    try {
      const reader = new window.NDEFReader();
      await reader.scan();

      reader.onreadingerror = () => {
        throw new Error('Cannot read data from the NFC tag.');
      };

      reader.onreading = async ({ serialNumber, message }) => {
        setCardInfo(
          `UID: ${serialNumber}\nRecords: ${message.records.length}` +
          (message.records[0]?.mediaType ? `\nMIME: ${message.records[0].mediaType}` : '')
        );

        let extracted = '';

        if (message.records.length > 0) {
          const record = message.records[0];

          if (record.recordType === 'mime' && record.mediaType === BINARY_MIME) {
            const buffer = record.data instanceof ArrayBuffer
              ? record.data
              : record.data.buffer;
            try {
              const resp = await axios.post(
                '/test',
                buffer,
                {
                  headers: { 'Content-Type': 'application/octet-stream' },
                  responseType: 'text'
                }
              );
              let bodyStr = typeof resp.data === 'object'
                ? JSON.stringify(resp.data, null, 2)
                : (() => {
                    try { return JSON.stringify(JSON.parse(resp.data), null, 2); }
                    catch { return resp.data; }
                  })();
              extracted = bodyStr;
            } catch (err) {
              extracted = `Error decoding binary: ${err.message}`;
            }
          }
          else if (record.recordType === 'text') {
            const decoder = new TextDecoder(record.encoding || 'utf-8');
            extracted = decoder.decode(record.data);
          }
          else if (record.recordType === 'url') {
            const decoder = new TextDecoder();
            extracted = `URL: ${decoder.decode(record.data)}`;
          }
          else {
            extracted = Array.from(new Uint8Array(record.data))
              .map(b => b.toString(16).padStart(2, '0')).join(' ');
          }
        }

        setRawPayload(extracted);
        setReadData(extracted);
        setToastMsg('NFC tag read successfully!');
        setToastVariant('success');
        setShowToast(true);
        setIsReading(false);
      };
    } catch (err) {
      console.error(err);
      setToastMsg(`Failed to read NFC: ${err.message}`);
      setToastVariant('danger');
      setShowToast(true);
      setIsReading(false);
    }
  };

  const handleImport = async () => {
    if (!rawPayload) return;
    setIsImporting(true);
    let endpoint;
    let payloadToSend;

    try {
      if (rawPayload.trim().startsWith('{') && rawPayload.includes('"resourceType"') && rawPayload.includes('Bundle')) {
        endpoint = '/ipsbundle';
        payloadToSend = JSON.parse(rawPayload);
      }
      else if (rawPayload.startsWith('MSH')) {
        endpoint = '/ipsfromhl72x';
        payloadToSend = rawPayload;
      }
      else if (rawPayload.startsWith('H9')) {
        endpoint = '/ipsfrombeer';
        payloadToSend = rawPayload;
      } else {
        throw new Error('Unrecognized IPS format');
      }

      const isJson = endpoint === '/ipsbundle';
      const contentType = isJson ? 'application/json' : 'text/plain';

      const resp = await axios.post(
        endpoint,
        payloadToSend,
        { headers: { 'Content-Type': contentType } }
      );
      setToastMsg(`Import success: ${resp.status} ${resp.statusText}`);
      setToastVariant('success');
    } catch (err) {
      setToastMsg(`Import failed: ${err.message}`);
      setToastVariant('danger');
    } finally {
      setShowToast(true);
      setIsImporting(false);
    }
  };

  const handleConvertOnly = async () => {
    if (!rawPayload) return;
    setIsConverting(true);
    let endpoint;
    let payloadToSend;

    try {
      if (rawPayload.trim().startsWith('{') && rawPayload.includes('"resourceType"') && rawPayload.includes('Bundle')) {
        endpoint = '/convertips2mongo';
        payloadToSend = JSON.parse(rawPayload);
      }
      else if (rawPayload.startsWith('MSH')) {
        endpoint = '/converthl72xtomongo';
        payloadToSend = rawPayload;
      }
      else if (rawPayload.startsWith('H9')) {
        endpoint = '/convertbeer2mongo';
        payloadToSend = rawPayload;
      } else {
        throw new Error('Unrecognized IPS format');
      }

      const isJson = endpoint === '/convertips2mongo';
      const contentType = isJson ? 'application/json' : 'text/plain';

      const resp = await axios.post(
        endpoint,
        payloadToSend,
        {
          headers: { 'Content-Type': contentType },
          responseType: 'json'
        }
      );
      const converted = typeof resp.data === 'object'
        ? JSON.stringify(resp.data, null, 2)
        : resp.data;
      setReadData(converted);
      setToastMsg('Conversion successful');
      setToastVariant('success');
    } catch (err) {
      setToastMsg(`Conversion failed: ${err.message}`);
      setToastVariant('danger');
    } finally {
      setShowToast(true);
      setIsConverting(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h3>NFC Reader</h3>

        <div className="button-container mb-3">
          <Button
            variant={isReading ? 'dark' : 'primary'}
            onClick={handleReadFromNfc}
            disabled={isReading}
          >
            {isReading ? 'Waiting...' : 'Read from NFC'}
          </Button>
          <Button
            variant="success"
            className="ml-2"
            onClick={handleImport}
            disabled={!rawPayload || isImporting}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            onClick={handleConvertOnly}
            disabled={!rawPayload || isConverting}
          >
            {isConverting ? 'Converting...' : 'Convert to NoSQL Only'}
          </Button>
        </div>

        <h5>Card Info</h5>
        <Form.Control
          as="textarea"
          rows={3}
          value={cardInfo}
          readOnly
          className="mb-3"
        />

        <h5>Payload</h5>
        <Form.Control
          as="textarea"
          rows={15}
          value={readData}
          readOnly
        />
      </div>

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={toastVariant}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">IPS SERN NFC</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant !== 'light' ? 'text-white' : ''}>
            {toastMsg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}