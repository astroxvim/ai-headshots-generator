import React, { useEffect } from "react";
import { Tabs, Tab, RadioGroup, Spacer } from "@nextui-org/react";
import PreferenceRadioItem from "./preference-radio-item";
import { preferenceOptions, genders } from "./preference-types";

interface SelectPreferencesProps {
  onNext: () => void;
  selectedPreference: boolean;
  setSelectedPreference: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectPreferences: React.FC<SelectPreferencesProps> = ({
  onNext,
  selectedPreference,
  setSelectedPreference,
}) => {
  const [selectedGender, setSelectedGender] = React.useState(genders[0].key);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  useEffect(() => {
    // Reset selected option and disable the button when gender changes
    setSelectedOption(null);
    setSelectedPreference(false);
  }, [selectedGender, setSelectedPreference]);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    setSelectedPreference(true);
  };

  const handleGenderChange = (key: string) => {
    setSelectedGender(key);
  };

  return (
    <div className="flex max-w-4xl flex-col items-center py-12">
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-primary">Settings</h2>
        <h1 className="text-4xl font-medium tracking-tight">Select Your Style</h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Choose Your Preferences for your professional headshot.
        </h2>
      </div>
      <Spacer y={8} />
      <Tabs
        classNames={{
          tab: "data-[hover-unselected=true]:opacity-90 px-4",
        }}
        radius="full"
        size="lg"
        color="primary"
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
      <Spacer y={12} />
      <RadioGroup
        aria-label="Style Option"
        value={selectedOption}
        onValueChange={handleOptionChange}
        classNames={{
          wrapper: "grid grid-cols-1 gap-6 md:gap-4 sm:grid-cols-2 lg:grid-cols-2",
        }}
      >
        {preferenceOptions
          .filter((option) => option.gender === selectedGender)
          .map((option) => (
            <div key={option.key} className="flex flex-col items-center">
              <PreferenceRadioItem
                value={option.key}
                title={option.title.replace(' Male', '').replace(' Female', '')}
                description={
                  <img
                    src={option.imageUrl}
                    alt={option.title}
                    className="w-3/4 max-w-[280px] rounded-lg transform transition-transform duration-300 hover:scale-105"
                  />
                }
              />
              <Spacer y={2} />
              <p className="text-sm text-default-500">{option.title.replace(' Male', '').replace(' Female', '')}</p>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
};

export default SelectPreferences;
