import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='position-fixed fixed-top header'>
      <div className='container text-center'>
        <h1>
          <Link
            to={{
              pathname: '/',
            }}
            className='text-decoration-none sleek-letters'
          >
            Seekers' Paradise
          </Link>
        </h1>
      </div>
    </header>
  );
}
