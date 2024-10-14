import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TFilterTypes } from '@/hooks/public/use-center-list';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

interface MultiSelectProps {
  title: string;
  type: TFilterTypes;
  options: {
    [key: string]: string;
  }[];
  optionIDSlug: string; 
  optionNameSlug: string; 
  selectedValues: Set<string>; 
  onChange: (type: TFilterTypes, value: string) => void; 
}

export function MultiSelect({
  title,
  options,
  optionIDSlug,
  optionNameSlug,
  selectedValues,
  onChange,
  type,
}: MultiSelectProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedValues.size} selected
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedValues.size > 0 ? selectedValues?.has(option[optionIDSlug]) : false;
                return (
                  <CommandItem
                    key={option[optionIDSlug]}
                    onSelect={() => {
                      onChange(type, option[optionIDSlug]);
                    }}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4" />}
                    </div>
                    <span>{option[optionNameSlug]}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
