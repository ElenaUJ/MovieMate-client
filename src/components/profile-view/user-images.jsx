import { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserImageModal } from './user-image-modal';

function UserImages({ showSpinner, token }) {
  const [loading, setLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  // const [modalShow, setModalShow] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState('');

  useEffect(
    function () {
      if (!token) {
        return;
      }
      setLoading(true);

      fetch(
        'http://MyVPCLoadBalancer-1116653646.us-east-1.elb.amazonaws.com/thumbnails',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then(function (response) {
          setLoading(false);
          if (response.status === 401) {
            throw new Error(
              "Sorry, you're not authorized to access this resource. "
            );
          } else if (response.ok) {
            return response.json();
          }
        })
        .then(function (thumbnails) {
          setThumbnails(thumbnails);
        })
        .catch(function (error) {
          setLoading(false);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error(
              'An error occurred while fetching images. Please try again later.'
            );
          }
          console.error('An error occurred:' + error);
        });
    },
    [token]
  );

  let printThumbnails;
  if (thumbnails.length === 0) {
    printThumbnails = (
      <Col className="mt-4">You have not added any images yet.</Col>
    );
  } else {
    printThumbnails = thumbnails.map(function (thumbnail, index) {
      const filename = thumbnail.substring(thumbnail.lastIndexOf('/') + 1);
      return (
        <Col className="mt-4" key={index} xs={6} md={4} lg={3} xl={2}>
          <Card onClick={() => setSelectedThumbnail(filename)}>
            <Card.Img src={thumbnail} alt={filename}></Card.Img>
          </Card>
        </Col>
      );
    });
  }

  return (
    <>
      {loading ? showSpinner() : printThumbnails}
      <UserImageModal
        imageName={selectedThumbnail ? selectedThumbnail : ''}
        onHide={() => setSelectedThumbnail('')}
        show={selectedThumbnail !== ''}
        showSpinner={showSpinner}
        token={token}
      />
    </>
  );
}

export { UserImages };
