import React, { useEffect } from "react";
import { Tabs, Tab, RadioGroup, Spacer, Avatar, Radio } from "@nextui-org/react";
import { preferenceOptions, genders } from "../constants/preference-types";

interface SelectPreferencesProps {
  onNext: () => void;
  selectedPreference: boolean;
  setSelectedPreference: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
  selectedGender: string;
  selectedOption: string | null;
}

const SelectPreferences: React.FC<SelectPreferencesProps> = ({
  onNext,
  selectedPreference,
  setSelectedPreference,
  setSelectedGender,
  setSelectedOption,
  selectedGender,
  selectedOption,
}) => {

  useEffect(() => {
    // Reset selected option and disable the button when gender changes
    setSelectedOption(null);
    setSelectedPreference(false);
  }, [selectedGender,setSelectedOption, setSelectedPreference]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setSelectedPreference(true);
    console.log("Option Selected: ", value);
    console.log("Preference Selected: ", true);
  };

  const handleGenderChange = (key: string) => {
    setSelectedGender(key);
  };

  const radioClassNames = {
    base: "inline-flex m-0 bg-default-100/70 items-center justify-between flex-row-reverse w-full max-w-full cursor-pointer rounded-lg p-4 border-medium border-transparent data-[selected=true]:border-primary transform transition-transform duration-300 hover:scale-105",
    control: "bg-primary text-primary-foreground",
    wrapper: "group-data-[selected=true]:border-primary",
    label: "text-small text-default-500 font-medium",
    labelWrapper: "m-0",
  };

  return (
    <div className="flex max-w-4xl flex-col items-center py-2">
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-primary">Settings</h2>
        <h1 className="text-4xl text-neutral-300 font-medium tracking-tight">Select Your Style</h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Choose Your Preferences for your professional headshot.
        </h2>
        <Spacer y={8} />
      </div>
      {/* Tabs for gender selection */}
      <Tabs
        classNames={{
          tab: "data-[hover-unselected=true]:opacity-90 px-4",  
        }}
        radius="full"
        size="lg"
        color="primary"
        selectedKey={selectedGender}
        onSelectionChange={handleGenderChange}
      >
        {genders.map((gender) => (
          <Tab
            key={gender.key}
            aria-label={gender.label}
            title={gender.label}
          />
        ))}
      </Tabs>
      <Spacer y={8} />

      {/* RadioGroup for preference options */}
      <div className="w-full mb-8">
        <RadioGroup
          className="col-span-12"
          classNames={{
            wrapper: "gap-4",
          }}
          value={selectedOption}
          onValueChange={handleOptionChange}
        >
          {preferenceOptions
            .filter((option) => option.gender === selectedGender)
            .map((option) => (
              <Radio key={option.key} classNames={radioClassNames} value={option.key}>
                <div className="flex gap-4 items-center">
                  <Avatar
                    alt={option.title}
                    className="max-w-[280px] rounded-lg"
                    size="lg"
                    src={option.imageUrl}
                  />
                  <div className="flex flex-col items-start text-left"> {/* Added text-left class here */}
                    <span className="text-medium">{option.title.replace('studio', '').replace('environmental', '')}</span>
                    <span className="text-small text-default-400">{option.description}</span>
                  </div>
                </div>
              </Radio>
            ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SelectPreferences;
