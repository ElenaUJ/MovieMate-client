import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ButtonSpinner } from '../button-spinner/button-spinner.jsx';

function UploadImage({ token }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleChange = function (event) {
    setFile(event.target.files[0]);
  };

  const handleSubmit = function () {
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    fetch(`http://localhost:8080/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(function (response) {
        setLoading(false);
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.ok) {
          toast.success(`You successfully uploaded "${file.name}".`);
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to upload the image. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };
  return (
    <>
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select an image to upload</Form.Label>
          <Form.Control onChange={handleChange} type="file" />
        </Form.Group>
      </Form>
      {loading ? (
        <Button className="spinner-button-wide" type="button">
          <ButtonSpinner />
        </Button>
      ) : (
        <Button
          className="spinner-button-wide"
          variant="primary"
          onClick={handleSubmit}
          type="button"
        >
          Upload image
        </Button>
      )}
    </>
  );
}

export { UploadImage };
