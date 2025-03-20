import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='position-fixed fixed-top  bg-white'>
      <h1>
        <Link
          to={{
            pathname: '/',
          }}
          className='text-decoration-none text-black'
        >
          Seekers' Paradise
        </Link>
      </h1>
    </header>
  );
}
