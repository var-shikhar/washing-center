import { Button } from '@/components/custom/button';
import { useTheme } from '@/context/theme-provider'
import { Link } from 'react-router-dom'

const JoinNowCTA = () => {
    const { theme } = useTheme();
    return (
        <section className={`${theme === 'dark' ? 'bg-[white]' : 'bg-[--deep-purple]'} p-3 sm:p-16`}>
            <div className="sm:container mx-auto sm:px-28">
            <div className={`${theme !== 'dark' ? 'bg-[white]' : 'bg-[--deep-purple]'} flex flex-wrap justify-center shadow-xl rounded-lg py-16 px-12 relative z-10`}>
                <div className="w-full text-center lg:w-8/12">
                <p className="text-4xl text-center">
                    <span role="img" aria-label="love">
                    😍
                    </span>
                </p>
                <h3 className="font-semibold text-3xl">
                    Join Our Platform Today!
                </h3>
                <p className=" text-lg mt-4 mb-4">
                    Ready to take your washing center to the next level? Sign up now and become part of our growing community of successful washing centers. Together, we can redefine the washing experience for your customers!
                </p>
                <Link to={'../auth/sign-up'}>
                    <Button type="button" size={"lg"}>
                    Start Your Washing Center
                    </Button>
                </Link>
                </div>
            </div>
            </div>
        </section>
    )
}

export default JoinNowCTA