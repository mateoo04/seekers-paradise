import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CompletionModal({ onClose, gameDuration, token }) {
  const modalRef = useRef(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const modalInstance = new Modal(modalRef.current);
    modalInstance.show();

    const handleHidden = () => {
      document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
        backdrop.remove();
      });
    };

    modalRef.current.addEventListener('hidden.bs.modal', handleHidden);

    const current = modalRef.current;

    return () => {
      modalInstance.hide();
      handleHidden();
      current.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  const handleChange = (event) => {
    if (event.target.name == 'username') setUsername(event.target.value);
  };

  const handleUsernamePost = async (event) => {
    event.preventDefault();

    if (username?.length >= 3)
      try {
        const response = await fetch(`${BASE_URL}/game/saveResults`, {
          method: 'POST',
          headers: {
            Authorization: token.token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) throw new Error('Error saving username.');

        onClose();
      } catch {
        toast.error('Error saving the username.');
      }
    else toast.error('Name has to be at least 3 characters long');
  };

  return (
    <div
      className='modal fade'
      ref={modalRef}
      id='staticBackdrop'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='staticBackdropLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h3 className='modal-title h5'>
              Congrats on finding everyone in
              {gameDuration / 1000 >= 60
                ? ` ${Math.round((gameDuration / 1000) * 100) / 100} minutes`
                : ` ${Math.round(gameDuration / 1000)} seconds`}
              !
            </h3>{' '}
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={onClose}
            ></button>
          </div>
          <div className='modal-body'>
            <form id='usernameForm' onSubmit={handleUsernamePost}>
              <label htmlFor='username' className='mb-2'>
                Enter you name to save the result!
              </label>
              <input
                type='text'
                id='username'
                name='username'
                className='form-control mb-3'
                value={username}
                onChange={handleChange}
              />
            </form>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
              form='usernameForm'
            >
              Skip
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              form='usernameForm'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
