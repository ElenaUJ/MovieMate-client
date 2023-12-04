import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserImageModal({ imageName, onHide, show, showSpinner, token }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [expanded, setExpanded] = useState(true);

  useEffect(
    function () {
      if (!token || !imageName) {
        return;
      }
      setLoading(true);

      fetch(
        `http://MyVPCLoadBalancer-1116653646.us-east-1.elb.amazonaws.com/images/${imageName}`
      )
        .then(function (response) {
          setLoading(false);
          if (response.status === 401) {
            throw new Error(
              "Sorry, you're not authorized to access this resource. "
            );
          } else if (response.ok) {
            return response.url;
          }
        })
        .then(function (imageUrl) {
          setImage(imageUrl);
        })
        .catch(function (error) {
          setLoading(false);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error(
              'An error occurred while fetching image. Please try again later.'
            );
          }
          console.error('An error occurred:' + error);
        });
    },
    [token, imageName]
  );

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <Modal onHide={onHide} show={show} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {imageName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          showSpinner()
        ) : (
          <img
            src={image}
            alt={imageName}
            style={{ width: expanded ? '100%' : 'auto' }}
            onClick={toggleExpanded}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

export { UserImageModal };
