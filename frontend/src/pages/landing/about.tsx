import { Button } from "@/components/custom/button";
import { Link } from "react-router-dom";
import Footer from "./component/footer";
import Header from "./component/header";
import JoinNowCTA from "./component/joinNowCTA";

const AboutPage = () => {
  return (
    <>
      <Header activeHeader="About" />
      <section className="header relative text-center sm:text-left sm:pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12">
            <div className="">
              <h2 className="font-semibold text-5xl">
                Transform Your Washing Center Experience!
              </h2>
              <p className="mt-4 text-lg ">
                Join our innovative platform designed exclusively for washing centers! With our user-friendly interface, you can open a virtual branch, manage bookings, and enhance customer satisfaction like never before.
              </p>
              <Link to={'../auth/sign-up'}>
                <Button type="button" className="mt-5" size={"lg"}>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <img className="hidden md:block absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px"
          src="/img/pattern_nextjs.png"
          alt="..."
        />
      </section>
      <section>
        <div className="w-full border-0">
          <svg
            className="overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="fill-current" points="2560 0 2560 100 0 100" ></polygon>
          </svg>
        </div>
        <div className="bg-[--deep-purple] border-0 text-white py-10 text-3xl sm:text-5xl text-center -mt-1">Transform Your Washing Center with Our Digital Platform</div>
      </section>
      <section className="relative">
        <div className="container mx-auto my-10">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 lg:w-4/12 sm:px-12 md:px-4 mx-auto">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block bottom-0 h-36 rounded"
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="fill-current"
                    ></polygon>
                  </svg>
                  <h4 className="text-xl font-bold ">
                    Bring Your Washing Center Online with Ease
                  </h4>
                  <p className="text-md font-light mt-2 ">
                    Take your washing center digital with our all-in-one platform. From showcasing your services to managing customer bookings, our system simplifies every step. Customize your virtual center to reflect your brand, and start accepting bookings with just a few clicks!
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <DetailCard 
                  imageURL="/assets/onboarding.png"
                  title="Easy Setup"
                  description="Opening your virtual washing center is a breeze! Our intuitive onboarding process allows you to set up your center in minutes. No technical expertise is required!" 
                />
                <DetailCard 
                  imageURL="/assets/booking-2.png"
                  title="Streamlined Booking Management"
                  description="Say goodbye to missed appointments! Our portal enables you to accept, manage, and track bookings seamlessly, ensuring you never lose a customer again." 
                />
                <DetailCard 
                  imageURL="/assets/engagement.png"
                  title="Customer Engagement"
                  description="Engage with your customers through our platform. Send notifications, reminders, and promotional offers to keep them coming back!" 
                />
                <DetailCard 
                  imageURL="/assets/dashboard.png"
                  title="Comprehensive Dashboard"
                  description="Gain valuable insights into your center's performance with our analytics dashboard. Track bookings, revenue, and customer feedback, and make data-driven decisions to grow your business." 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full border-0">
          <svg
            className="overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="fill-current" points="2560 0 2560 100 0 100" ></polygon>
          </svg>
        </div>
        <div className="bg-[--deep-purple] border-0 text-white py-10 text-3xl sm:text-5xl text-center -mt-1">Book Your Wash, On Your Terms.</div>
      </section>
      <section className="relative">
        <div className="container mx-auto my-16">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <DetailCard 
                  imageURL="/assets/interface.png"
                  title="User-Friendly Interface"
                  description="Designed for ease of use, so you can focus on your customers, not the technology." 
                />
                <DetailCard 
                  imageURL="/assets/booking-1.png"
                  title="Flexible Booking Options"
                  description="Allow customers to choose from a variety of services at their convenience." 
                />
                <DetailCard 
                  imageURL="/assets/profile.png"
                  title="Customizable Profiles"
                  description="Showcase your washing center with images, descriptions, and services offered to attract more customers." 
                />
                <DetailCard 
                  imageURL="/assets/rating.png"
                  title="Customer Reviews & Ratings"
                  description="Build trust and improve your services with feedback from your valued customers." 
                />
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-4/12 sm:px-12 md:px-4 mx-auto">
              <div className="relative flex flex-col min-w-0 break-words  w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block bottom-0 h-36 rounded"
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="fill-current"
                    ></polygon>
                  </svg>
                  <h4 className="text-xl font-bold ">
                    Make Booking Easy for Your Customers
                  </h4>
                  <p className="text-md font-light mt-2 ">
                    Give your customers the convenience they expect with our easy-to-use online booking system. Maximize your center's potential by providing seamless service scheduling that keeps clients coming back for more.
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JoinNowCTA />
      <Footer />
      </>
  )
}

const DetailCard = ({imageURL, title, description}: {imageURL: string, title: string, description: string}) => {
  return (
    <div className="relative flex flex-col mt-4 text-center items-center sm:items-start sm:text-start px-4 py-5 flex-auto sm:w-[50%]">
      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
        <img src={imageURL} alt={title} className="w-[100%]" /> 
      </div>
      <h6 className="text-xl mb-1 font-semibold">{title}</h6>
      <p className="mb-4 ">{description}</p>
    </div>
  )
}

export default AboutPage