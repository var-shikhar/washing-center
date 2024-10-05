import { Button } from '@/components/custom/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type THeaderProps = {
    activeHeader: string
}

const Header = ({activeHeader}: THeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sticky, setSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => window.scrollY > 50 ? setSticky(true) : setSticky(false);
        window.addEventListener('scroll', handleScroll);
    
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`p-4 fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${sticky ? 'bg-opacity-20 backdrop-blur-md shadow-xl py-4' : 'py-6 bg-[--deep-purple] shadow-none'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className={`${sticky ? 'text-slate-900' : 'text-white'} text-xl font-bold`}>
                    <a href="#" className="font-semibold text-3xl">Washing Center</a>
                </div>
                <div className="hidden md:flex space-x-4">
                    <Link to={'../about'}>
                        <Button type="button" variant={'link'} className={`px-3 py-2 block my-auto text-lg rounded-md font-semibold font-sans ${activeHeader === 'About' ? 'text-white border-b-2 border-indigo-500' : sticky ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                            About Us
                        </Button>
                    </Link>
                    <Link to={'../center/list'}>
                        <Button type="button" variant={'link'} className={`px-3 py-2 block my-auto text-lg rounded-md font-semibold font-sans ${activeHeader === 'Center' ? 'text-white border-b-2 border-indigo-500' : sticky ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                            Find Centers
                        </Button>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to={'../auth/sign-in'}>
                            <Button type="button" className="bg-indigo-700 text-white px-6 py-3 font-semibold font-sans hover:bg-indigo-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" size={"lg"}>
                                Book your service
                            </Button>
                        </Link>
                        <Link to={'../auth/sign-up'}>
                            <Button type="button" className="bg-green-700 text-white px-6 py-3 font-semibold font-sans hover:bg-green-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" size={"lg"}>
                                Start Your Washing Center
                            </Button>
                        </Link>                        
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className={`${sticky ? 'text-slate-900 hover:text-slate-500' : 'text-white hover:text-gray-400'} text-xl font-bold focus:ring-2`}
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#" className={`px-3 py-2 block my-auto rounded-md font-semibold font-sans ${activeHeader === 'About' ? 'text-white border-b-2 border-indigo-500' : sticky ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                            About Us
                        </a>
                        <a href="#" className={`px-3 py-2 block my-auto rounded-md font-semibold font-sans ${activeHeader === 'Center' ? 'text-white border-b-2 border-indigo-500' : sticky ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                            Find Centers
                        </a>
                        
                        <a href="../auth/sign-in" className="block max-w-max my-4 bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold font-sans shadow-md hover:bg-indigo-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Book your service
                        </a>
                        
                        <a href="../auth/sign-up" className="block max-w-max my-4 bg-green-700 text-white px-6 py-3 rounded-full font-semibold font-sans shadow-md hover:bg-green-600 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Start Your Washing Center
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Header