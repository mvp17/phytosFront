import Link from 'next/link';
import SignInButton from './SignInButton';
import { AiOutlineHome, 
  AiOutlineStar, 
  AiOutlineContacts, 
  AiOutlineCalendar, 
  AiOutlineBug,
  AiOutlineFunnelPlot
} from "react-icons/ai";
import { SiOpenstreetmap } from "react-icons/si";

const links = [
  {
    label: 'Home',
    route: '/',
    icon: <AiOutlineHome />
  },
  {
      label: 'Clients',
      route: '/clients',
      icon: <AiOutlineStar />
  },
  {
    label: 'Persons',
    route: '/persons',
    icon: <AiOutlineContacts />
  },
  {
    label: 'Seasons',
    route: '/seasons',
    icon: <AiOutlineCalendar />
  },
  {
    label: 'Products',
    route: '/products',
    icon: <AiOutlineBug />
  },
  {
    label: 'Installations',
    route: '/installations',
    icon: <AiOutlineFunnelPlot />
  },
  {
    label: 'Map',
    route: '/map',
    icon: <SiOpenstreetmap />
  }
];

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center bg-stone-100'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          {links.map(({label, route, icon}) => (
                  <Link href={route}>
                    {icon}
                    {label}
                  </Link>
          ))}
          <li>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header