import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../header/Header';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [rankingTabs, setRankingTabs] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [tabClicked, setTabClicked] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/images`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch images');

        const json = await response.json();

        setImages(json.images);
        setRankingTabs(
          json.images.map((image) => ({ title: image.title, name: image.name }))
        );
        updateRanking(json.images.at(0).name);
        setTabClicked(0);
      } catch {
        toast.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  const updateRanking = (imageName) => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ranking/${imageName}`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch ranking');

        const json = await response.json();

        setRanking(json.ranking);
      } catch {
        toast.error('Failed to fetch ranking');
      }
    };

    fetchRanking();
  };

  return (
    <>
      <Header />
      <main className='container d-flex flex-column justify-content-center align-items-center'>
        <div className='row g-3'>
          {images.map((image) => {
            return (
              <div
                className='col-12 col-sm-6 col-md-4'
                onClick={() => navigate(`/game/${image.name}`)}
                key={image.name}
              >
                <div className='card frosted'>
                  <img src={image.url} alt='' />
                  <div className='card-body'>
                    <h2 className='sleek-letters user-select-none'>
                      {image.title}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='ranking mb-5 border border-1 rounded-3 frosted'>
          <h2 className='sleek-letters text-center pt-2 pb-1'>Ranking</h2>
          <ul
            class='nav nav-tabs justify-content-around sleek-letters bg-white mb-2'
            id='myTab'
            role='tablist'
          >
            {rankingTabs &&
              rankingTabs.map((tab, index) => {
                return (
                  <li class='nav-item'>
                    <button
                      class={`nav-link border-0 ${
                        tabClicked == index ? 'fw-bold' : ''
                      }`}
                      id='profile-tab'
                      type='button'
                      role='tab'
                      onClick={() => {
                        updateRanking(tab.name);
                        setTabClicked(index);
                      }}
                    >
                      {tab.title}
                    </button>
                  </li>
                );
              })}
          </ul>
          <table className='sleek-letters table-responsive bg-transparent'>
            <thead>
              <tr>
                <th>Ranking</th>
                <th>Name</th>
                <th>Time (seconds)</th>
              </tr>
            </thead>
            <tbody>
              {ranking &&
                ranking.map((record, index) => {
                  return (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{record.playerName}</td>
                      <td>{record.gameDurationSeconds}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
