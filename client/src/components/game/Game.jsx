import { useRef, useState } from 'react';
import vikingsImg from '../../assets/vikings.webp';

export default function Game() {
  const [boxPosition, setBoxPosition] = useState({});
  const [selectBoxSize, setSelectBoxSize] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [isSelectionActive, setIsSelectionActive] = useState(false);

  const handleImageClick = (e) => {
    const boxSize = e.target.width / 16;

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

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

  return (
    <>
      <main
        className='d-flex flex-column justify-content-center align-items-center'
        onClick={handleOutsideClick}
      >
        <div className='imgContainer position-relative'>
          <img src={vikingsImg} alt='' onClick={handleImageClick} />
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
            className='list-group position-absolute selection-element'
            style={{
              ...dropdownPosition,
              display: isSelectionActive ? 'unset' : 'none',
            }}
          >
            <a href='#' className='list-group-item list-group-item-action'>
              The current link item
            </a>
            <a href='#' className='list-group-item list-group-item-action'>
              A second link item
            </a>
            <a href='#' className='list-group-item list-group-item-action'>
              A third link item
            </a>
          </div>
        </div>{' '}
      </main>
    </>
  );
}
