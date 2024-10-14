import { Button } from "@/components/custom/button";
import { Link } from "react-router-dom";
import Header from "./component/header";
import PublicCenterList from "@/components/centerList";
import Footer from "./component/footer";

const LandingPage = () => {
  return (
    <>
      <Header activeHeader="Home" />
      <section className="bg-[--deep-purple] py-24 pt-36">
        <div className="container">
          <div className="border-0 text-white text-4xl text-center">Book your next Car/Bike Washing Service Online</div>
        </div>
      </section>
      <PublicCenterList />
      <section className="bg-[--deep-purple] p-3 sm:p-16">
        <div className="sm:container mx-auto sm:px-28">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg py-16 px-12 relative z-10">
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
      <Footer />
      </>
  )
}

export default LandingPage