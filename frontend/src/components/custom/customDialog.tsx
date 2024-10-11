import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

type TCustomDialogProps = {
    isOpen: boolean;
    setISOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    hasTrigger: boolean;
    triggerNode?: React.ReactNode;
    contentNode: React.ReactNode;
    className?: string;
    customWidth?: string;
    isPrevantEsc?: boolean;
    isPreventOutsideClick?: boolean;
}

const CustomDialog = ({ isOpen, setISOpen, title, contentNode, hasTrigger = false, isPrevantEsc = false, isPreventOutsideClick = false, triggerNode, className = '', customWidth = '50vw' }: TCustomDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setISOpen} modal={true}>
        {hasTrigger && 
            <DialogTrigger asChild>
                {triggerNode}
            </DialogTrigger>
        }
        <DialogContent className={`sm:max-w-[${customWidth}] ${className}`} isPreventEsc={isPrevantEsc} isPreventOutsideClick={isPreventOutsideClick}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader> 
            {contentNode}
        </DialogContent>
    </Dialog>
  )
}

export default CustomDialog