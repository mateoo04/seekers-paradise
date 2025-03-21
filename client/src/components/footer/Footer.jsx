import gitHubIcon from '../../assets/github-mark.svg';

export default function Footer() {
  return (
    <footer className='text-center p-2 position-fixed bottom-0'>
      <a
        className='text-black text-decoration-none'
        href='https://github.com/mateoo04'
      >
        <img src={gitHubIcon} className='me-2 ' alt='' />
        Made by Mateo
      </a>
    </footer>
  );
}
