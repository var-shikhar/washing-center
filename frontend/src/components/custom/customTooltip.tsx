import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type TCustomTooltip = {
    content: React.ReactNode;
    trigger: React.ReactNode;
    isTextOnly?: boolean
} 

const CustomTooltip = ({ content, trigger, isTextOnly = true }: TCustomTooltip) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent>{isTextOnly ? <p>{content}</p> : content}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default CustomTooltip