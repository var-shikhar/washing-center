import { Button } from "@/components/custom/button";
import { Link } from "react-router-dom";
import Footer from "./component/footer";
import Header from "./component/header";
import { startTransition, useEffect, useState } from "react";
import ROUTES from "@/lib/routes";
import useAxioRequests from "@/lib/axioRequest";
import { TCenter } from "@/lib/commonTypes";
import { IconListDetails } from "@tabler/icons-react";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [centerList, setCenterList] = useState<TCenter[]>([] as TCenter[])
  const { HandleGetRequest } = useAxioRequests();

  useEffect(() => {
    loading && handleGetQueryRequest(ROUTES.publicCenterRoute)
  })

  // Handle Get Requests
  async function handleGetQueryRequest(route: string){
    const response = await HandleGetRequest({ route: route });
    if(response?.status === 200){
      startTransition(() => {
        setCenterList(response.data);
      })
    }
    setLoading(false);
  }

  return (
    <>
      <Header activeHeader="Home" />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
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
        <div className="bg-[--deep-purple] border-0 text-white py-10 text-5xl text-center -mt-1">Transform Your Washing Center with Our Digital Platform</div>
      </section>
      <section className="relative">
        <div className="container mx-auto my-10">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
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
                      className="text-blueGray-700 fill-current"
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
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/onboarding.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                        Easy Setup
                      </h6>
                      <p className="mb-4 ">
                        Opening your virtual washing center is a breeze! Our intuitive onboarding process allows you to set up your center in minutes. No technical expertise is required!
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto"> 
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/booking-2.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                        Streamlined Booking Management
                      </h6>
                      <p className="mb-4 ">
                        Say goodbye to missed appointments! Our portal enables you to accept, manage, and track bookings seamlessly, ensuring you never lose a customer again.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col min-w-0 mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/engagement.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Customer Engagement</h6>
                      <p className="mb-4 ">
                        Engage with your customers through our platform. Send notifications, reminders, and promotional offers to keep them coming back!
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/dashboard.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Comprehensive Dashboard</h6>
                      <p className="mb-4 ">
                        Gain valuable insights into your center's performance with our analytics dashboard. Track bookings, revenue, and customer feedback, and make data-driven decisions to grow your business.
                      </p>
                    </div>
                  </div>
                </div>
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
        <div className="bg-[--deep-purple] border-0 text-white py-10 text-5xl text-center -mt-1">Book Your Wash, On Your Terms.</div>
      </section>
      <section className="relative">
        <div className="container mx-auto my-16">
          <div className="flex flex-wrap items-center">
          <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/interface.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                        User-Friendly Interface
                      </h6>
                      <p className="mb-4 ">
                        Designed for ease of use, so you can focus on your customers, not the technology.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/booking-1.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                        Flexible Booking Options
                      </h6>
                      <p className="mb-4 ">
                        Allow customers to choose from a variety of services at their convenience.
                      </p>
                    </div>
                  </div>
                </div> 
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col min-w-0 mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/profile.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Customizable Profiles</h6>
                      <p className="mb-4 ">
                        Showcase your washing center with images, descriptions, and services offered to attract more customers.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className=" p-1 text-center inline-flex items-center justify-center w-20 h-20 mb-5 shadow-lg rounded-full bg-white">
                        <img src="/assets/rating.png" alt="user-friendly-interface" className="w-[100%]" /> 
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">Customer Reviews & Ratings</h6>
                      <p className="mb-4 ">
                        Build trust and improve your services with feedback from your valued customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-blueGray-700">
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
                      className="text-blueGray-700 fill-current"
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
      <section className="relative bg-[--deep-purple] p-16">
        <div className="container mx-auto sm:px-28">
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

export default AboutPage