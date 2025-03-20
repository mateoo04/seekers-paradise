import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../header/Header';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/images`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch images');

        const json = await response.json();

        setImages(json.images);
      } catch {
        toast.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <main className='container d-flex flex-column justify-content-center align-items-center'>
        <div className='row'>
          {images.map((image) => {
            return (
              <div
                className='col-12 col-sm-6 col-md-4'
                onClick={() => navigate(`/game/${image.name}`)}
                key={image.name}
              >
                <div className='card'>
                  <img src={image.url} alt='' />
                  <div className='card-body'>
                    <h2>{image.title}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
