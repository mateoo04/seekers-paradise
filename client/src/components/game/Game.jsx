import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CompletionModal from '../completionModal/completionModal';
import Header from '../header/Header';
import checkSvg from '../../assets/check.svg';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Game() {
  const [imageUrl, setImageUrl] = useState('');
  const [token, setToken] = useState('');
  const [targets, setTargets] = useState([]);

  const [boxPosition, setBoxPosition] = useState({});
  const [selectBoxSize, setSelectBoxSize] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [gameDuration, setGameDuration] = useState(null);

  const clickPercentages = useRef({});

  const { name } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/game/${name}`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch images');

        const json = await response.json();

        setImageUrl(json.image.url);
        setToken(json.token);
        setTargets(json.targets);
      } catch {
        toast.error('Error fetching game data');
      }
    };

    fetchPosts();
  }, [name]);

  const handleImageClick = (e) => {
    const boxSize = e.target.width / 16;

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    clickPercentages.x = (clickX / e.target.width) * 100;
    clickPercentages.y = (clickY / e.target.height) * 100;

    console.log(
      `X: ${clickX / e.target.width}, Y: ${clickY / e.target.height}`
    );

    const boxPositionObj = {};
    const dropdownPositionObj = {};

    if (clickX + boxSize / 2 > rect.right - rect.left) {
      boxPositionObj.right = 0 + '%';
      boxPositionObj.left = 'unset';
    } else if (clickX - boxSize / 2 < 0) {
      boxPositionObj.left = 0 + '%';
    } else {
      boxPositionObj.left = `${
        ((clickX - boxSize / 2) / e.target.width) * 100
      }%`;
    }

    if (clickY + boxSize / 2 > rect.bottom - rect.top) {
      boxPositionObj.bottom = 0 + '%';
      boxPositionObj.top = 'unset';
    } else if (clickY - boxSize / 2 < 0) {
      boxPositionObj.top = 0 + '%';
    } else {
      boxPositionObj.top =
        ((clickY - boxSize / 2) / e.target.height) * 100 + '%';
      dropdownPositionObj.top = `${
        ((clickY + boxSize / 2) / e.target.height) * 100
      }%`;
    }

    if (clickX / e.target.width < 0.3) {
      dropdownPositionObj.left = `${
        ((clickX + boxSize / 2) / e.target.width) * 100
      }%`;
      dropdownPositionObj.right = 'unset';
    } else if (clickX / e.target.width > 0.7) {
      dropdownPositionObj.right = `${
        ((e.target.width - clickX + boxSize / 2) / e.target.width) * 100
      }%`;
      dropdownPositionObj.left = 'unset';
    } else {
      dropdownPositionObj.left = `${
        ((clickX - boxSize / 2) / e.target.width) * 100
      }%`;
      dropdownPositionObj.right = 'unset';
    }

    if (clickY / e.target.height < 0.3) {
      dropdownPositionObj.top = `${
        ((clickY + boxSize / 2) / e.target.height) * 100
      }%`;
      dropdownPositionObj.bottom = 'unset';
    } else if (clickY / e.target.height > 0.7) {
      dropdownPositionObj.bottom = `${
        ((e.target.height - clickY + boxSize / 2) / e.target.height) * 100
      }%`;
      dropdownPositionObj.top = 'unset';
    } else {
      dropdownPositionObj.top = `${
        ((clickY + boxSize / 2) / e.target.height) * 100
      }%`;
      dropdownPositionObj.bottom = 'unset';
    }

    setIsSelectionActive(true);
    setBoxPosition(boxPositionObj);
    setSelectBoxSize(boxSize);
    setDropdownPosition(dropdownPositionObj);
  };

  const handleOutsideClick = (event) => {
    if (
      isSelectionActive &&
      !event.target.classList.contains('selection-element')
    )
      setIsSelectionActive(false);
  };

  const handleCharacterClick = async (selectedTarget) => {
    try {
      const response = await fetch(`${BASE_URL}/game/target`, {
        method: 'POST',
        headers: {
          Authorization: token.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clickX: clickPercentages.x,
          clickY: clickPercentages.y,
          targetId: selectedTarget.id,
        }),
      });

      if (!response.ok) throw new Error('Error handling the target guess');

      const json = await response.json();

      if (json.isFound) {
        toast.info(`Congrats, you found ${selectedTarget.character.name}!`);
        const updatedTargets = targets.map((target) => {
          if (target.id == selectedTarget.id)
            return { ...target, isFound: true, x: json.x, y: json.y };
          else return target;
        });

        setTargets(updatedTargets);
        if (json.gameSessionStatus?.isCompleted) {
          setGameDuration(json.gameSessionStatus.gameDuration);
        }
      } else {
        toast.info(`That was not ${selectedTarget.character.name}`);
      }
    } catch {
      toast.error('Error handling the target guess');
    }
  };

  return (
    <>
      <Header />
      <main
        className='d-flex flex-column justify-content-center align-items-center'
        onClick={handleOutsideClick}
      >
        {imageUrl ? (
          <>
            <div className='bg-black text-white shadow-lg border-0 rounded-4 pt-2 pb-2 ps-3 pe-3 mb-3'>
              <ul className='d-flex ps-0 align-items-center mb-0 gap-4'>
                {targets.map((target) => {
                  return (
                    <li
                      className={`list-group-item ${
                        target.isFound ? 'opacity-50' : ''
                      }`}
                      key={'list-item-' + target.id}
                    >
                      <img
                        src={target.character.iconUrl}
                        className='characterIcon me-2'
                        alt=''
                      />
                      {target.character.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className='img-container position-relative mb-5'>
              <img
                src={imageUrl}
                alt=''
                onClick={handleImageClick}
                className='game-image'
              />
              {targets
                .filter((target) => target.isFound)
                .map((target) => (
                  <img
                    key={`check-${target.id}`}
                    src={checkSvg}
                    className='position-absolute target-check'
                    style={{ top: `${target.y}%`, left: `${target.x}%` }}
                  />
                ))}
              <div
                className='select-box position-absolute selection-element'
                style={
                  boxPosition
                    ? {
                        ...boxPosition,
                        width: selectBoxSize,
                        height: selectBoxSize,
                        display: isSelectionActive ? 'unset' : 'none',
                      }
                    : ''
                }
              ></div>
              <div
                className='list-group position-absolute selection-element bg-black'
                style={{
                  ...dropdownPosition,
                  display: isSelectionActive ? 'unset' : 'none',
                }}
              >
                {targets.map((target) => {
                  if (!target.isFound)
                    return (
                      <button
                        onClick={() => handleCharacterClick(target)}
                        className='list-group-item list-group-item-action bg-black text-white'
                        key={target.id}
                      >
                        <img
                          src={target.character.iconUrl}
                          className='characterIcon me-2'
                          alt=''
                        />
                        {target.character.name}
                      </button>
                    );
                })}
              </div>
            </div>
          </>
        ) : (
          ' '
        )}
      </main>
      {gameDuration &&
        createPortal(
          <CompletionModal
            onClose={() => setGameDuration(null)}
            gameDuration={gameDuration}
            token={token}
          />,
          document.body
        )}
    </>
  );
}
