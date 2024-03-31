import { bottombarLinks } from '@/constants';
import { Link, useLocation } from 'react-router-dom'
import { Dialog, DialogTrigger } from '../ui/dialog';
import UpdateStatus from './UpdateStatus';

const Bottombar = () => {

  const { pathname } = useLocation();
  
  return (
    <section className='bottom-bar'>
       {bottombarLinks.map((link) => {
                    const isActive = pathname === link.route;
                    return (
                          <Link to={link.route} key={link.label} className= {`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                                <img src={link.imgURL} alt={link.label} width={16} height={16} className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                                <p className='tiny-medium text-light-2'>{link.label}</p>
                          </Link>
                    )
                })}
                <Dialog >
                    <DialogTrigger>
                    <li key="Status">
                    <div className="flex-center flex-col gap-1 p-2 transition">
                        <img src="/assets/icons/bookmark.svg" width={16} height={16} alt="Status" className={`group-hover:invert-white`} />
                        <p className='tiny-medium text-light-2'>Status</p>
                    </div>  
                    </li>
                    </DialogTrigger>
                    <UpdateStatus />
                </Dialog>
    </section>
  )
}

export default Bottombar