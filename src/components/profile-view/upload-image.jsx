import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

function UploadImage() {
  const handleSelectedImage = function () {

  };

  const uploadImage = function () {
    fetch(`localhost:8080/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: 
    })
      .then(function (response) {
        setLoading(false);
        if (response.status === 401) {
          throw new Error(
            "Sorry, you're not authorized to access this resource. "
          );
        } else if (response.status === 400) {
          throw new Error('User was not found.');
        } else if (response.ok) {
          toast.success(
            `You successfully deleted the account with the username of "${user.Username}".`
          );
          onLoggedOut();
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            'An error occurred while trying to delete. Please try again later.'
          );
        }
        console.error('An error occurred:' + error);
      });
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select an image to upload</Form.Label>
          <Form.Control onChange={handleSelectedImage} type="file" />
        </Form.Group>
      </Form>
      <Button variant="primary" type="submit">
        Upload Image
      </Button>
    </>
  );
}

export { UploadImage };
