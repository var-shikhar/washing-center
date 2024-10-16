import { Button } from '@/components/custom/button'
import CustomTooltip from '@/components/custom/customTooltip'
import useBackendServiceBookingForm from '@/hooks/booking/use-booking-form.'
import { cn } from '@/lib/utils'
import { IconSquareRoundedPlusFilled, IconSquareRoundedXFilled } from '@tabler/icons-react'
import { HTMLAttributes } from 'react'

type TBookingFormProps = HTMLAttributes<HTMLDivElement> & {
    handleConfirmation: () => void;
}

const BackendBookingForm = ({ className, handleConfirmation, ...props }: TBookingFormProps) => {
  const { selectedPhase, servicePricing, serviceList, selectedService, setSelectedService, setSelectedPhase, setServicePricing, handleFormSubmission, handleCustomizableAddons } = useBackendServiceBookingForm();

  return (
    <div className={cn('grid gap-6', className)} {...props}>
        <div className="p-6 bg-white rounded-lg shadow-md">
            {selectedPhase === 0 ? <>
                <select 
                    className='form-control w-[100%] p-2 border my-5'
                    value={JSON.stringify(selectedService)} 
                    onChange={(e) => setSelectedService(JSON.parse(e.target.value))}
                >
                    <option value={''}>Select Service</option>
                    {serviceList.map((service) => (
                        <option key={service.id} value={JSON.stringify(service)}>
                            {service.serviceName}
                        </option>
                    ))}
                </select>
                {selectedService !== null && 
                    <div className='sm:px-2'>
                        <div className='text-black font-semibold'>Service Price</div>
                        <hr className='border-black mb-2' />
                        <div className='flex gap-1 flex-col'>
                            <div className='flex justify-between items-center'>
                                <div className=''>Base Price</div>
                                <div className='font-semibold text-green-500'>
                                    <del className='text-destructive text-xs'>₹ {selectedService.price}/-</del> &nbsp; ₹ {selectedService.discPrice}/-
                                </div>
                            </div>
                            {selectedService.addons?.map(option => (
                                <div className={`flex justify-between items-center rounded px-2 ${selectedService.isCustomizable && !servicePricing.serviceAddons?.some(item => item.addonID.toString() === option.serviceID.toString()) && 'line-through bg-red-200 text-red-500 hover:text-red-700 transition duration-300'} `} key={option.serviceID}>
                                    <div className='truncate'>{option.serviceName}</div>
                                    <div className='flex gap-2 items-center'>
                                        <div className='font-semibold text-green-500'>
                                            <del className='text-destructive text-xs'>₹ {option.price}/-</del> &nbsp; ₹ {option.discPrice}/-
                                        </div>
                                        {selectedService.isCustomizable && (
                                            <>
                                                {servicePricing.serviceAddons?.some(item => item.addonID.toString() === option.serviceID.toString()) ? (
                                                    <CustomTooltip 
                                                        isTextOnly
                                                        content={'Remove Addon Service'}
                                                        trigger={<IconSquareRoundedXFilled
                                                            className="cursor-pointer text-red-800" 
                                                            onClick={() => handleCustomizableAddons(option.serviceID, 'remove')}
                                                        />}
                                                    />
                                                ) : (
                                                    <CustomTooltip 
                                                        isTextOnly
                                                        content={'Add Addon Service'}
                                                        trigger={<IconSquareRoundedPlusFilled
                                                            className="cursor-pointer text-green-800" 
                                                            onClick={() => handleCustomizableAddons(option.serviceID, 'add')}
                                                        />}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}                    
                        </div>
                        <hr className='border-black my-2' />
                        <div className='flex justify-between items-center text-lg font-bold'>
                            <div className='text-black'>Total Price</div>
                            <div className='font-semibold text-green-500'>
                                <del className='text-destructive text-sm'>₹ {servicePricing.totalPrice}/-</del> &nbsp; ₹ {servicePricing.totalDiscountedPrice}/-
                            </div>
                        </div>     
                        <Button className='mt-2 w-full' type='button' onClick={() => setSelectedPhase(3)}>Next</Button>
                    </div>
                }
            </>
            :   <div>
                    <div className="mb-4">
                        <label className="mt-1 py-2 rounded-md w-full">Vehicle No.</label>
                        <input
                            type="text"
                            placeholder="UP21 ******"
                            required    
                            value={servicePricing.vehicleNo}
                            maxLength={20}
                            onChange={(e) => {
                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Convert to uppercase and remove non-alphanumeric characters
                                setServicePricing(prev => ({ ...prev, vehicleNo: value }));
                            }}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none w-full"
                        />
                    </div>
                    <Button className='mt-2 w-full' type='submit' disabled={servicePricing.vehicleNo === '' || servicePricing.vehicleNo === undefined} onClick={() => handleFormSubmission(handleConfirmation)}>Book Service</Button>
                </div>
            }
        </div>
    </div>
  );
}


export default BackendBookingForm;