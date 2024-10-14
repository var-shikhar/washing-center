import { Button } from '@/components/custom/button';
import CustomDialog from '@/components/custom/customDialog';
import CustomTooltip from '@/components/custom/customTooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import usePublicServiceList from '@/hooks/public/use-service-list';
import commonFn from '@/lib/commonFn';
import { IconCircleCheckFilled, IconClock12, IconDeviceMobileFilled, IconMailFilled, IconMap2 } from '@tabler/icons-react';
import { Link, useParams } from 'react-router-dom';
import BookingForm from './component/bookingForm';
import Footer from './component/footer';
import Header from './component/header';

const { handleGMapURL, getTimeinAMPMfromTimeString } = commonFn;

const PublicServiceList = () => {
    const { id }  = useParams();
    const { centerData, filteredList, searchedText, dialogToggle, dialogData, formToggle, confirmationToggle, bookingID, setBookingID, setConfirmationToggle, setFormToggle, setDialogToggle, setSearchedText, handleBookingToggle, handleServiceSelection } = usePublicServiceList(id ?? '');

    const ServiceDetail = () => {
        return (
            <div className='text-slate-700 my-1'>
                {dialogData.isCustomizable && <div className='bg-red-100 text-red-700 rounded p-2 my-4'>Addons are customizable while booking.</div>}
                <div className='text-slate-700 mb-3'>{dialogData.serviceDescription}</div>
                <hr className='border-black' />
                <div className='text-black font-semibold'>Service Price</div>
                <hr className='border-black mb-2' />
                <div className='flex gap-1 flex-col'>
                    <div className='flex justify-between items-center'>
                        <div className=''>Base Price</div>
                        <div className='font-semibold text-green-500'>
                            <del className='text-destructive text-xs'>₹ {dialogData.price}/-</del> &nbsp; ₹ {dialogData.discPrice}/-
                        </div>
                    </div>
                    {dialogData.addons?.map(option => (
                        <div className='flex justify-between items-center' key={option.serviceID}>
                            <div className='truncate'>{option.serviceName}</div>
                            <div className='font-semibold text-green-500'>
                                <del className='text-destructive text-xs'>₹ {option.price}/-</del> &nbsp; ₹ {option.discPrice}/-
                            </div>
                        </div>
                    ))}                    
                </div>
                <hr className='border-black my-2' />
                <div className='flex justify-between items-center text-lg font-bold'>
                    <div className='text-black'>Total Price</div>
                    <div className='font-semibold text-green-500'>
                        <del className='text-destructive text-sm'>₹ {dialogData.totalPrice}/-</del> &nbsp; ₹ {dialogData.totalDiscountedPrice}/-
                    </div>
                </div>
                <Button className='mx-auto w-[100%] px-6 sm:w-auto block mt-5' type='button' onClick={handleBookingToggle}>Book Service</Button>
            </div>
        )
    }

    const BookingConfirmation = ({ bookingID = '' }: {bookingID: string}) => {
        return (
            <div className="bg-green-50 text-green-800 p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
                <div className="flex items-center justify-center mb-4">
                    <IconCircleCheckFilled className="text-green-500" size={80} />
                </div>
                <h2 className="text-2xl font-semibold">Booking has received successfully!</h2>
                <p className="mb-2">Thank you for your booking! Your booking ID is: <br /> <strong className='text-lg'>{bookingID}</strong></p>
                <p className="text-sm text-gray-600">
                    Please keep this ID for your records. If you have any questions, feel free to contact us.
                </p>
                <Link to='../dashboard/my-bookings'>
                    <Button type='button' className='my-2 sm:my-4 bg-green-600 hover:bg-green-800'>Continue</Button>
                </Link>
            </div>
        );
    };

    return (
        <>
            <Header activeHeader='' wrapperClass='relative' />
            <div className='w-[90%] sm:w-[80%] mx-auto'>
                <div className={`transition-all duration-300`}>
                    <div className='my-2'>
                        <div className='shadow-md rounded-xl border flex flex-col gap-2 p-4 items-center'>
                            <div className='text-4xl font-semibold ps-1 py-3 truncate text-wrap text-center'>{centerData.centerName}</div>
                            <div className='flex gap-2 flex-wrap items-center justify-center'>
                                <div className='flex items-center gap-2'>
                                    <span>
                                        <CustomTooltip
                                            content={'Call Washing Center'}
                                            trigger={<IconDeviceMobileFilled 
                                                size={25} 
                                                className='bg-green-200 p-1 rounded text-green-700 cursor-pointer' 
                                                onClick={() => window.location.href = `tel:+91 ${centerData.centerPhone}`}
                                            />}
                                            isTextOnly
                                        />
                                    </span>
                                    <div>+91 {centerData.centerPhone}</div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span>
                                        <CustomTooltip
                                            content={'Raise a Ticket'}
                                            trigger={<IconMailFilled 
                                                size={25} 
                                                className='bg-green-200 p-1 rounded text-green-700 cursor-pointer' 
                                                onClick={() => window.location.href = `mailTo:${centerData.centerEmail}`}
                                            />}
                                            isTextOnly
                                        />
                                    </span>
                                    <div>{centerData.centerEmail}</div>
                                </div>
                                {centerData.centerTiming && 
                                    <div className="flex items-center gap-2">
                                        <span>
                                            <CustomTooltip
                                                content={'Center Timing'}
                                                trigger={<IconClock12 
                                                    size={25} 
                                                    className='bg-green-200 p-1 rounded text-green-700' 
                                                />}
                                                isTextOnly
                                            />
                                        </span>
                                        <div>
                                            <span>{getTimeinAMPMfromTimeString(centerData.centerTiming?.stTime)}</span> - 
                                            <span>{getTimeinAMPMfromTimeString(centerData.centerTiming?.edTime)}</span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='flex items-center gap-2 max-w-[100%]'>
                                <span>
                                    <CustomTooltip 
                                        content={'Visit Location'}
                                        trigger={<IconMap2 
                                            size={25} 
                                            className='bg-green-200 p-1 rounded text-green-700 cursor-pointer' 
                                            onClick={() => handleGMapURL(centerData.centerGeoLocation?.lat ?? 0, centerData.centerGeoLocation?.long ?? 0)}
                                        />}
                                        isTextOnly
                                    />
                                </span>
                                <address className=''>{centerData.centerAddress}</address>
                            </div>
                            <small className='text-muted-foreground'>Current Count: <b>No. {centerData?.todaysCount ?? 0}</b></small>
                        </div>
                        <hr className='my-4 border-[2px] sm:mx-2' />
                        <Input
                            placeholder='Search to find service...'
                            className='h-9 w-[100%]'
                            value={searchedText}
                            onChange={(e) => setSearchedText(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-2 my-3 sm:my-8'>
                    {filteredList?.map(item => (
                        <div 
                            key={item.id} 
                            className='flex justify-between items-center border rounded p-3 py-5 cursor-pointer relative' 
                            onClick={() => handleServiceSelection(item)}
                        >
                            {item.isCustomizable && <div className='absolute text-sm top-0 left-0 rounded-e-md bg-green-800 px-3 text-white'>Customizable Addons</div>}
                            <div className=''>
                                <div className='text-xl mb-1'>
                                    {item.serviceName}
                                </div>
                                <div className='flex gap-2'>
                                    <Badge>{item.categoryName}</Badge>   
                                    <Badge>{item.vehicleName}</Badge>   
                                </div>
                            </div>
                            <div className='text-lg font-semibold text-green-500'>
                                <del className='text-destructive'>₹ {item.price}/-</del> &nbsp; ₹ {item.discPrice}/-
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            <CustomDialog 
                isOpen={dialogToggle} 
                setISOpen={setDialogToggle} 
                hasTrigger={false} 
                isPrevantEsc 
                isPreventOutsideClick 
                title={dialogData.serviceName} 
                contentNode={<ServiceDetail />} 
            />
            <CustomDialog 
                isOpen={formToggle} 
                setISOpen={setFormToggle} 
                hasTrigger={false} 
                isPrevantEsc 
                isPreventOutsideClick 
                customWidth='40vw' 
                title={dialogData.serviceName} 
                contentNode={
                    <BookingForm 
                        bookedService={dialogData} 
                        centerID={centerData.centerID} 
                        closingTime={centerData.centerTiming?.edTime ?? '19:00'} 
                        handleConfirmation={(bookingID: string) => {
                            setFormToggle(false)
                            setConfirmationToggle(true)
                            setBookingID(bookingID);
                         }} 
                    />
                }
            />
            <CustomDialog 
                isOpen={confirmationToggle} 
                setISOpen={setConfirmationToggle} 
                hasTrigger={false}  
                isPreventOutsideClick
                isPrevantEsc
                customWidth='30vw'
                title={'Booking Received'} 
                contentNode={<BookingConfirmation bookingID={bookingID} />} 
            />
        </>
    )
}

export default PublicServiceList