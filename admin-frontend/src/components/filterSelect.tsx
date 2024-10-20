import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type TFilterSelectProps<T extends Record<string, string>> = {
    list: T[];
    slug: {
        label: keyof T;
        value: keyof T;
    };
    selectedValue: string;
    onChange: (value: string) => void;
};

const FilterSelect = <T extends Record<string, string>>({
    list,
    slug,
    selectedValue,
    onChange
}: TFilterSelectProps<T>) => {

    const value = list.find(item => item[slug.value] === selectedValue) ?? null;
    return (
        <div>
            <Select value={selectedValue} onValueChange={onChange}>
                <SelectTrigger className="w-auto">
                    <SelectValue>
                        <div className="flex gap-2 items-center">
                            {value !== null 
                                ? value[slug.label] 
                                : <IconAdjustmentsHorizontal size={18} />
                            }
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                    {Array.isArray(list) && list.length > 0 && list.map((option, index) => (
                        <SelectItem key={index} value={option[slug.value]}>
                            <div>{option[slug.label]}</div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FilterSelect;
