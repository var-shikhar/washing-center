import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div className="relative mt-16 bg-[--deep-purple]">
            <svg className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 " preserveAspectRatio="none" viewBox="0 0 1440 54">
                <path fill="currentColor" d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"></path>
            </svg>
            <div className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 text-slate-500">
                <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="sm:col-span-2">
                        <a href="/" aria-label="Go home" title="Company" className="inline-flex items-center">
                            <svg className="w-8" viewBox="0 0 24 24" strokeLinejoin="round" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" stroke="currentColor" fill="none">
                                <rect x="3" y="1" width="7" height="12"></rect>
                                <rect x="3" y="17" width="7" height="6"></rect>
                                <rect x="14" y="1" width="7" height="6"></rect>
                                <rect x="14" y="11" width="7" height="12"></rect>
                                </svg>
                            <span className="ml-2 text-xl font-bold tracking-wide text-slate-300 uppercase">Washing Center</span>
                        </a>
                        <div className="mt-6 lg:max-w-sm">
                            <p className="text-sm ">
                                Washing Center is a dedicated platform connecting car and bike owners with professional washing services. Our mission is to provide a seamless booking experience for users while helping washing centers manage their services efficiently. With a commitment to quality and customer satisfaction, we ensure that your vehicles receive the care they deserve.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="text-base font-bold tracking-wide text-slate-300">Links</p>
                        <Link to={`../track`}>
                            <div className="my-2 transition-colors hover:text-slate-300 duration-300  hover:text-deep-purple-800">Track Booking</div>
                        </Link>
                        <Link to={`../about`}>
                            <div className="my-2 transition-colors hover:text-slate-300 duration-300  hover:text-deep-purple-800">About Us</div>
                        </Link>
                        <Link to={`../auth/sign-in`}>
                            <div className="my-2 transition-colors hover:text-slate-300 duration-300  hover:text-deep-purple-800">Sign-In / Sign-Up</div>
                        </Link>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="text-base font-bold tracking-wide text-slate-300">Contacts</p>
                        <div className="flex">
                            <a href="tel:7500104052" aria-label="Our phone" title="Our phone" className="transition-colors hover:text-slate-300 duration-300  hover:text-deep-purple-800">7500104052</a>
                        </div>
                        <div className="flex">
                            <a href="mailto:hv17174@gmail.com" aria-label="Our email" title="Our email" className="transition-colors hover:text-slate-300 duration-300  hover:text-deep-purple-800">hv17174@gmail.com</a>
                        </div>
                        <div className="flex">
                            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" aria-label="Our address" title="Our address" className="transition-colors duration-300 hover:text-slate-300  hover:text-deep-purple-800">
                            Buddhi Vihar Moardabad
                            </a>
                        </div>
                    </div>
                    <div>
                        <span className="text-base font-bold tracking-wide text-slate-300">Social</span>
                        <div className="flex items-center mt-1 space-x-3">
                            <a href="/" className=" transition-colors duration-300 hover:text-slate-300">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                                <path
                                d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"
                                ></path>
                            </svg>
                            </a>
                            <a href="/" className=" transition-colors duration-300 hover:text-slate-300">
                            <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                                <circle cx="15" cy="15" r="4"></circle>
                                <path
                                d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
                                ></path>
                            </svg>
                            </a>
                            <a href="/" className=" transition-colors duration-300 hover:text-slate-300">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                                <path
                                d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"
                                ></path>
                            </svg>
                            </a>
                        </div>
                        <p className="mt-4 text-sm ">
                        Follow us on social media to stay updated on promotions, tips for vehicle care, and news about our services. Your feedback is important to us, and we love connecting with our community!
                        </p>
                    </div>
                </div>
                <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t lg:flex-row">
                    <p className="text-sm ">
                        © 2024 Washing Center. All rights reserved.
                    </p>
                    <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
                    <li>
                        <a href="/" className="text-sm  transition-colors duration-300 hover:text-slate-300">F.A.Q</a>
                    </li>
                    <li>
                        <a href="/" className="text-sm  transition-colors duration-300 hover:text-slate-300">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/" className="text-sm  transition-colors duration-300 hover:text-slate-300">Terms &amp; Conditions</a>
                    </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer