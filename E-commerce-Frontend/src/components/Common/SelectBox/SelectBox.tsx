import { useState } from "react";
import { GoChevronDown } from "react-icons/go";

interface ObjectOption {
  [key: string]: any;
  name: string;
}

type PrimitiveOption = string | number;

interface SelectBoxProps {
  label: string;
  optionName?: string;
  optionValue?: string;
  options: ObjectOption[] | PrimitiveOption[];
  value: any;
  handleChange: (value: any) => void;
  hideLabel?: boolean;
}

const SelectBox = ({
  label,
  optionName,
  optionValue,
  options,
  value,
  handleChange,
  hideLabel = false,
}: SelectBoxProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const isObjectOptions = optionName && optionValue;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative flex flex-col items-start py-2 border border-gray-200 cursor-pointer ${
        isHovering ? "border-b-0" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4 px-3 ">
        <div className="flex gap-2">
          {!hideLabel && (
            <div className="text-sm text-gray-800 text-nowrap">{label} : </div>
          )}
          <div className="text-sm font-bold text-gray-800">
            {isObjectOptions ? value?.name : value}
          </div>
        </div>
        <GoChevronDown className="text-gray-400" />
      </div>

      {isHovering &&
        (isObjectOptions ? (
          <div className="absolute left-0 z-30 flex flex-col w-full py-4 bg-white border border-t-0 top-full">
            {(options as ObjectOption[]).map((option, index) => (
              <div
                key={index}
                onClick={() => handleChange(option)}
                className={`${
                  option[optionValue!] === value?.[optionValue!]
                    ? "font-bold bg-gray-100"
                    : "hover:bg-gray-100"
                } w-full px-3 py-2`}
              >
                {option?.[optionName!]}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-full py-4">
            {(options as PrimitiveOption[]).map((option, index) => (
              <div
                key={index}
                onClick={() => handleChange(option)}
                className={`${
                  option === value
                    ? "font-bold bg-gray-100"
                    : "hover:bg-gray-100"
                } w-full px-3 py-2`}
              >
                {option}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default SelectBox;