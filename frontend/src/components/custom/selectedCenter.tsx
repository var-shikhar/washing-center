
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { TContextCenterList } from "@/context/userContext";


type TSelectedCenter = {
    value: string;
    list: TContextCenterList[];
    handleRemove: () => void;
    handleSelect: (centerID: string, hasTransition: boolean) => void;
}

export default function SelectedCenter({handleRemove, handleSelect, list, value} : TSelectedCenter) {
  return (
    <div className="p-2 absolute bottom-0 w-[100%] sm:mb-2">
        <div className="ps-1 my-1">Selected Center</div>
        <Select 
            value={value}
            onValueChange={(value) => {
                if(value === 'delete'){
                    handleRemove(); 
                } else {
                    handleSelect(value, false)
                }
            }}
        >
            <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Change Center" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                {list?.map(option => (
                    <SelectItem key={option.centerID} value={option.centerID}>{option.centerName}</SelectItem>
                ))}
                <SelectItem value={'delete'}>Remove Center</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}
