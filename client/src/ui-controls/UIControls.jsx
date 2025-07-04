import classNames from "classnames";
import React, { useState } from "react";
import {
  Dropdown,
  Card,
  LinkButton,
  Avatar,
  TextInput,
  Checkbox,
  Radio,
  Label,
  IconButton,
  Icon,
  MultiDropdown,
  CheckboxDropdown,
  RangeInput,
  FlatButton,
  SearchInput,
  Tooltip,
  Toggle,
  Button,
  DataButton,
  Datepicker,
  Dialog,
  Text,
  PopOverDialog,
  AvatarButton,
  TextArea,
  Drawer,
  ScrollBar,
  Scrollbar,
} from "../ui-controls";
import { IcPerson, IcEye } from "../assets";
import _ from "lodash";
import { positionEnum } from "../services/constants";

export const CardControl = ({ isHoverEnable }) => {
  return (
    <Card
      isHoverEnable={isHoverEnable}
      isDisabled={false}
      cardStyle={"card-style"}
    >
      <h3 className="text-color-text pb-4 text-lg leading-6 font-medium">
        Title
      </h3>
    </Card>
  );
};

export const DropdownControl = ({ isDisabled }) => {
  const [value, setValue] = useState({});
  const onChange = (value) => {
    setValue(value);
  };
  const options = [
    {
      clientId: "X12",
      name: "UHC",
    },
    {
      clientId: "X13",
      name: "UHC123",
    },
    {
      clientId: "X14",
      name: "UHC678",
    },
    {
      clientId: "X15",
      name: "UHC672",
    },
  ];

  return (
    <Dropdown
      id="dropdown"
      placeholder="Client"
      options={options}
      optionLabel="name"
      optionValue="clientId"
      onChange={onChange}
      isDisabled={isDisabled}
      value={value}
      dropdownStyle="dropdown w-full"
      menuStyle="menu"
    />
  );
};

export const MultiDropdownControl = () => {
  const [value, setValue] = useState({});
  const onChange = (value) => {
    setValue(value);
  };
  const options = [
    {
      id: "X12",
      name: "UHC",
    },
    {
      id: "X13",
      name: "UHC123",
    },
    {
      id: "X14",
      name: "UHC678",
    },
    {
      id: "X15",
      name: "UHC672",
    },
    {
      name: "Lorem ipsum",
      id: "level1",
      items: [
        {
          name: "Dolor",
          id: "level21",
        },
        {
          name: "Sit amet",
          id: "level31",
        },
      ],
    },
  ];

  return (
    <MultiDropdown
      id="dropdown"
      placeholder="Client"
      options={options}
      optionLabel="name"
      optionValue="id"
      optionItems="items"
      onChange={onChange}
      isDisabled={false}
      value={value}
      dropdownStyle="dropdown multi-dd"
      menuStyle="menu"
    />
  );

  // return null;
};

export const CheckboxDropdownControl = () => {
  const [value, setValue] = useState([]);
  const onChange = (value) => {
    setValue(value);
  };
  const options = [
    {
      id: "X12",
      name: "LabCorp",
    },
    {
      id: "X13",
      name: "Quest Diagnostics",
    },
    {
      id: "X14",
      name: "Tenet Health",
    },
    {
      id: "X15",
      name: "UHC672",
    },
  ];

  return (
    <CheckboxDropdown
      id="dropdown"
      placeholder="Client"
      options={options}
      optionLabel="name"
      optionValue="id"
      onChange={onChange}
      isDisabled={false}
      value={value}
      dropdownStyle="dropdown checkbox-dd"
      menuStyle="menu"
    />
  );
  // return null;
};

export const TextInputControl = ({
  id,
  label,
  isDisabled,
  image,
  placeholder,
  type,
}) => {
  const [value, setValue] = useState("");
  const onChange = (value) => {
    setValue(value.target.value);
  };

  return (
    <TextInput
      id={id}
      type={type}
      placeholder={placeholder}
      label={label}
      onChange={onChange}
      value={value}
      inputStyle="input-field text-sm"
      image={image}
      imageStyle="image"
      isDisabled={isDisabled}
    />
  );
};

export const TextAreaControl = ({ id, label, isDisabled, placeholder }) => {
  const [value, setValue] = useState("");
  const onChange = (value) => {
    setValue(value);
  };

  return (
    <TextArea
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      placeholder={placeholder}
      labelStyle={"text-sm text-secondary-theme mb-2"}
      textAreaStyle="text-sm text-gray-400 placeholder-gray-300 h-hp-90 outline-none focus:ring-transparent focus:border-gray-300"
    ></TextArea>
  );
};

export const RangeInputCotrol = () => {
  const onChange = ({ min, max }) => {};

  return (
    <RangeInput
      min={0}
      max={20000}
      selectedMin={0}
      selectedMax={20000}
      minLabel="$0"
      maxLabel="$2M"
      sliderStyle="w-80"
      thumbStyle="w-80"
      onChange={onChange}
    />
  );
};

export const DatepickerControl = () => {
  const onChange = (value) => {
    alert(value);
  };

  const years = [
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
  ];
  return (
    <Datepicker isDropdownVisible={true} years={years} onChange={onChange} />
  );
  // return null;
};

export const LinkButtonControl = ({ isDisabled }) => {
  const onAtributeClick = (data) => {
    alert(data);
  };
  return (
    <LinkButton
      isDisabled={isDisabled}
      isActive={true}
      label={`Click here`}
      btnStyle={"btn-style"}
      onClick={() => onAtributeClick("I am here...")}
    />
  );
};

export const CheckboxControl = ({
  size,
  isDisabled,
  label,
  description,
  isChecked,
  isRounded,
}) => {
  const [checked, setChecked] = useState(isChecked);
  const onCheckClick = (value) => {
    setChecked(value);
  };

  return (
    <Checkbox
      id={"checkbox1"}
      name={"label"}
      size={size}
      isDisabled={isDisabled}
      label={label}
      description={description}
      inputStyle={"input-style"}
      lblClass={"lblClass text-sm pl-1"}
      onChange={onCheckClick}
      isChecked={checked}
      isRounded={isRounded}
    />
  );
};

const AvatarControl = ({
  icon,
  src,
  data,
  isClickable,
  isDisabled,
  iconStyle,
  btnStyle,
  valueStyle,
  notification,
}) => {
  const [count, setCount] = useState(data);
  const onAvatarClick = (data) => {
    setCount(data + 1);
    alert("Avatar is clicked");
  };

  return (
    <Avatar
      size="md"
      title="MM"
      isRounded={true}
      isDisabled={isDisabled}
      src={src}
      icon={icon}
      data={count}
      iconStyle={iconStyle}
      imgStyle={"img-style"}
      btnStyle={btnStyle}
      valueStyle={valueStyle}
      notifyStyle={"notify-style"}
      notification={notification}
      onClick={
        isClickable && !isDisabled ? (data) => onAvatarClick(data) : () => {}
      }
    />
  );
};

export const LabelControl = ({ size, label }) => {
  return <Label size={size} label={label} lblStyle={"label-style"} />;
};

export const RadioControl = ({ isDisabled, label, isChecked }) => {
  const [checked, setChecked] = useState(isChecked);
  const onRadioClick = (value) => {
    alert(value);
    setChecked(value);
  };

  return (
    <>
      <Radio
        id={"radio-1"}
        name={"radio-buttons"}
        size="md"
        isDisabled={isDisabled}
        label={"H (Facility)"}
        value={"H"}
        inputStyle={"inputStyle mb-1"}
        lblClass={"lblClass text-sm mb-2"}
        onChange={onRadioClick}
        isChecked={checked === "H"}
      />

      <Radio
        id={"radio-2"}
        name={"radio-buttons"}
        size="md"
        isDisabled={isDisabled}
        label={"M (Professional)"}
        value={"M"}
        inputStyle={"inputStyle"}
        lblClass={"lblClass text-sm"}
        onChange={onRadioClick}
        isChecked={checked === "M"}
      />
    </>
  );
};

const IconButtonControl = ({
  icon,
  data,
  icsize,
  isDisabled,
  isRounded,
  isHoverEnable,
  btnStyle,
  iconStyle,
  valueStyle,
}) => {
  const onClick = () => {
    alert("Button is clicked");
  };

  return (
    <IconButton
      icSize={icsize}
      icon={icon}
      data={data}
      isDisabled={isDisabled}
      isRounded={isRounded}
      btnStyle={btnStyle}
      iconStyle={iconStyle}
      valueStyle={valueStyle}
      title={"filterIcon"}
      isHoverEnable={isHoverEnable}
      onClick={!isDisabled ? () => onClick() : () => {}}
    />
  );
};

export const IconControl = ({ size, icon }) => {
  return <Icon size={size} icon={icon} imgStyle={"text-gray-300"} />;
};

const FlatButtonControl = ({
  icon,
  label,
  isDisabled,
  isHoverEnable,
  icPosition,
}) => {
  const onClick = () => {
    alert("Flat Button is clicked");
  };

  return (
    <FlatButton
      icSize={"md"}
      icon={icon}
      label={label}
      isDisabled={isDisabled}
      isHoverEnable={isHoverEnable}
      icPosition={icPosition}
      btnStyle={"btn-style"}
      iconStyle={"text-gray-300"}
      lblStyle={"text-base"}
      onClick={!isDisabled ? () => onClick() : () => {}}
    />
  );
};

export const SearchInputControl = ({ id, label, isDisabled, placeholder }) => {
  const [value, setValue] = useState("");
  const onChange = (value) => {
    setValue(value);
  };

  const onClick = (value) => {
    alert("search :" + value);
  };

  return (
    <SearchInput
      id={id}
      placeholder={placeholder}
      label={label}
      onChange={onChange}
      onClick={onClick}
      value={value}
      inputStyle="input-field text-sm"
      iconStyle="image"
      isDisabled={isDisabled}
    />
  );
};

export const ToggleControl = ({
  id,
  size,
  label,
  value,
  isDisabled,
  isToggle,
}) => {
  const [toggle, setToggle] = useState(isToggle);
  const onToggle = (value, name) => {
    alert(`${name} : ${value}`);
    setToggle(value);
  };

  return (
    <>
      <Toggle
        id={id}
        size={size}
        label={""}
        value={toggle}
        isToggle={toggle}
        isDisabled={isDisabled}
        inputStyle={"inputStyle"}
        borderStyle={"borderStyle"}
        roundStyle={"roundStyle"}
        onClick={onToggle}
      />
    </>
  );
};

const ButtonControl = ({
  size,
  name,
  isDisabled,
  isHoverEnable,
  isActive,
  isSecondary,
  btnStyle,
}) => {
  const [active, setActive] = useState(isActive);
  const onClick = () => {
    alert("Button is clicked");
    setActive(!active);
  };

  return (
    <Button
      size={size}
      name={name}
      isDisabled={isDisabled}
      isHoverEnable={isHoverEnable}
      isSecondary={isSecondary}
      isActive={active}
      btnStyle={btnStyle}
      onClick={!isDisabled ? () => onClick() : () => {}}
    />
  );
};

const DataButtonControl = ({
  size,
  name,
  data,
  icon,
  icPosition,
  icSize,
  isGrayed,
  isDisabled,
  isHoverEnable,
  isActive,
  btnStyle,
}) => {
  const [active, setActive] = useState(isActive);
  const onClick = () => {
    alert("Button is clicked");
    setActive(!active);
  };

  return (
    <DataButton
      size={size}
      name={name}
      data={data}
      icon={icon}
      isGrayed={isGrayed}
      icPosition={icPosition}
      icSize={icSize}
      isDisabled={isDisabled}
      isHoverEnable={isHoverEnable}
      isActive={active}
      btnStyle={btnStyle}
      onClick={!isDisabled ? () => onClick() : () => {}}
    />
  );
};

export const DialogControl = ({ visible, closeModal, children }) => {
  return (
    <>
      <Dialog
        id={"dialog"}
        label={""}
        visible={visible}
        closeModal={closeModal}
      >
        {children}
      </Dialog>
    </>
  );
};

const AvatarButtonControl = ({ src, isDisabled, notification, isHover }) => {
  const onAvatarClick = (value) => {};

  const options = [
    {
      key: "X11",
      name: "Robert F",
    },
    {
      key: "X12",
      name: "Josef Jhon",
    },
  ];

  const avatarBtn =
    options &&
    options.map((data, index) => {
      return (
        <AvatarButton
          key={index}
          size="md"
          title="MM"
          isRounded={true}
          isDisabled={isDisabled}
          isHover={isHover}
          src={src}
          tooltip={data.name}
          value={data}
          btnStyle={"mx-2"}
          notification={notification}
          onClick={onAvatarClick}
        />
      );
    });

  return avatarBtn;
};

const UIControls = () => {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [isOpenPop, setPopOver] = useState(false);
  const [isOpenDrawer, setDrawer] = useState(false);

  const [isOpenLeftDrawer] = useState(false);

  const handleClick = () => {
    setDrawer(!isOpenDrawer);
  };

  // const handleClickLeftDrawer = () => {
  //   setLeftDrawer(!isOpenLeftDrawer);
  // };

  const closeDrawer = () => {
    setDrawer(false);
  };

  const onDialogClick = () => {
    setOpenDialog(true);
  };

  const closeModal = () => {
    setOpenDialog(false);
  };

  const onOpenPopOver = () => {
    setPopOver(true);
  };

  const onClosePopOver = () => {
    setPopOver(false);
  };

  var transferIC = classNames({
    "trans-ease-in": true,
    "text-gray-500": isOpenPop,
    "text-gray-300": !isOpenPop,
  });

  const list = [
    {
      id: "1",
      name: "UHC",
    },
    {
      id: "2",
      name: "UHC",
    },
    {
      id: "3",
      name: "UHC",
    },
    {
      id: "4",
      name: "UHC",
    },
    {
      id: "5",
      name: "dataAvataar",
      data: 2,
      icon: "icon-add-icon",
    },
  ];

  const onTransferClick = (value) => {};

  const transferList = _.map(list, ({ id }) => {
    if (id !== "5") {
      return (
        <div key={id}>
          <AvatarButton
            key={id}
            size="sm"
            title="MM"
            isRounded={true}
            isDisabled={false}
            isHover={true}
            src={IcPerson}
            tooltip={id}
            btnStyle={
              "mx-0 relative avatar-popup h-hp-34 w-wp-34 cursor-pointer"
            }
            onClick={onTransferClick}
          />
        </div>
      );
    } else {
      return (
        <div key={id}>
          <Avatar
            size="sm"
            title="MM"
            isRounded={true}
            isDisabled={false}
            imgStyle={"img-style"}
            icon={"icon-add-icon text-ic-lg w-wp-18 h-hp-21 -ml-mtp-7"}
            iconStyle={"text-orange-300 text-base font-medium"}
            valueStyle={"text-orange-300"}
            isClickable={true}
            data={2}
            btnStyle={"bg-orange-100 w-wp-34 h-hp-34 pb-0.5"}
          />
        </div>
      );
    }
  });

  return (
    <>
      <ScrollBar>
        <div className="container m-2 mx-auto px-20">
          <div className="my-5 grid text-center text-lg">UI Controls</div>

          <div className="grid md:grid-cols-2">
            <div className="text-secondary-theme m-3 border-b py-2 text-sm">
              COLOR PALETTE
            </div>
            <div className="text-secondary-theme m-3 border-b py-2 text-sm">
              TYPOGRAPHY
            </div>
          </div>

          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="mb-4 grid grid-cols-4">
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-B"} />
                  <div className="text-sm font-medium uppercase">#133857</div>
                  <div className="text-sm">Root -primary</div>
                </div>
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-G"} />
                  <div className="text-sm font-medium uppercase">#939393</div>
                  <div className="text-sm">Root -secondary</div>
                </div>
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-BG"} />
                  <div className="text-sm font-medium uppercase">#F6F6F6</div>
                  <div className="text-sm">Root -bodyBg</div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-4">
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-acent"} />
                  <div className="text-sm font-medium uppercase">#14A8C5</div>
                  <div className="text-sm">Root --primary-accent</div>
                </div>
                <div className="pr-4">
                  <Card
                    isDisabled={false}
                    cardStyle={"card-color-secondary-ascent-1"}
                  />
                  <div className="text-sm font-medium uppercase">#DCE6ED</div>
                  <div className="text-sm">Root --secondary-accent-1</div>
                </div>
                <div className="pr-4">
                  <Card
                    isDisabled={false}
                    cardStyle={"card-color-secondary-ascent-2"}
                  />
                  <div className="text-sm font-medium uppercase">#FFEFDE</div>
                  <div className="text-sm">Root --secondary-accent-2</div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-4">
                <div className="pr-4">
                  <Card
                    isDisabled={false}
                    cardStyle={"card-color-secondary-ascent-3"}
                  />
                  <div className="text-sm font-medium uppercase">#FFE5E5</div>
                  <div className="text-sm">Root --secondary-accent-3</div>
                </div>
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-text"} />
                  <div className="text-sm font-medium uppercase">#313131</div>
                  <div className="text-sm">Root --color-text</div>
                </div>
                {/* <div className="pr-4">
                  <Card
                    isDisabled={false}
                    cardStyle={"card-color-O-light-trans"}
                  />
                  <div className="text-sm font-medium uppercase">#f4dcbb</div>
                  <div className="text-sm">Root --orange-300</div>
                </div> */}
                <div className="pr-4"></div>
              </div>

              {/* <div className="grid grid-cols-4">
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-G-dark"} />
                  <div className="text-sm font-medium uppercase">#059669</div>
                  <div className="text-sm">Root --green-500</div>
                </div>
                <div className="pr-4">
                  <Card isDisabled={false} cardStyle={"card-color-G-light"} />
                  <div className="text-sm font-medium uppercase">#d1fae5</div>
                  <div className="text-sm">Root --green-100</div>
                </div>

                <div className="pr-4"></div>
                <div className="pr-4"></div>
              </div> */}
            </div>

            <div className="m-3">
              <div className="mb-4 grid grid-cols-2">
                <>
                  <div className="grid grid-cols-2">
                    <div className="pr-4">
                      <div className="text-txt-16 font-thin">Aa</div>
                      <div className="text-txt-16">Light</div>
                    </div>
                    <div className="pr-4">
                      <div className="text-txt-16 font-light">Aa</div>
                      <div className="text-txt-16">Regular</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="pr-4">
                      <div className="text-txt-16 font-medium">Aa</div>
                      <div className="text-txt-16 font-medium">Medium</div>
                    </div>
                    <div className="pr-4">
                      <div className="text-txt-16 font-semibold">Aa</div>
                      <div className="text-txt-16 font-bold">Bold</div>
                    </div>
                  </div>
                </>

                <>
                  <div className="mb-4 grid grid-cols-1">
                    <div className="my-2 text-sm">
                      Instrument Sans (Regular)
                    </div>
                    <div className="text-txt-16 font-regular my-2">
                      Body Font - 16PX - The quick brown fox jumps over the lazy
                      dog
                    </div>

                    <div className="text-txt-16 font-regular my-2 uppercase">
                      Section Subtitle - 16PX
                    </div>
                    <div className="text-txt-16 my-2 font-semibold">
                      Instrument Sans (Semibold)
                    </div>
                    <div className="text-txt-16 my-2 font-bold">
                      Instrument Sans (Bold)
                    </div>

                    <div className="text-txt-16 font-playfair my-2 font-medium">
                      Playfair (Medium)
                    </div>

                    <div className="text-txt-16 font-playfair font-regular my-2">
                      Playfair (Regular) 16PX
                    </div>
                    <div className="text-txt-19 font-playfair font-regular my-2">
                      Playfair 19PX
                    </div>
                    <div className="text-txt-29 font-playfair font-regular my-2">
                      Playfair 29PX
                    </div>
                    <div className="text-txt-40 font-playfair font-regular my-2">
                      Playfair 40PX
                    </div>
                    <div className="text-txt-59 font-playfair font-regular my-2">
                      Playfair 59PX
                    </div>
                    <div className="text-txt-94 font-playfair font-regular my-2">
                      Playfair 94PX
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">INPUT</div>
            <div className="m-3 border-b py-2 text-sm">DROPDOWN</div>
          </div>

          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid md:grid-cols-2">
                <div className="pr-4">
                  <TextInputControl
                    id={"UserName-active"}
                    label={"Active"}
                    image={""}
                    placeholder={"User Name"}
                    type={"text"}
                  />
                </div>
                <div className="pr-4">
                  <TextInputControl
                    id={"UserName-disable"}
                    label={"Disable"}
                    isDisabled={true}
                    image={""}
                    placeholder={"User"}
                    type={"text"}
                  />
                </div>

                <div className="pr-4">
                  <TextInputControl
                    id={"Password-disable"}
                    label={"Password"}
                    isDisabled={false}
                    image={IcEye}
                    placeholder={"Password"}
                    type={"password"}
                  />
                </div>
              </div>
            </div>

            <div className="m-3">
              <div className="dropdownwrp grid md:grid-cols-2">
                <div className="w-full pr-4">
                  <label className="label-sm text-color-text block text-sm">
                    Active
                  </label>
                  <DropdownControl />
                </div>
                <div className="pr-4">
                  <label className="label-sm text-color-text block text-sm">
                    Disable
                  </label>
                  <DropdownControl isDisabled={true} />
                </div>
                <div className="relative mt-2 pr-6">
                  <label className="label-sm text-color-text mt-0 -mr-2 block text-right text-sm">
                    Multi Dropdown
                  </label>
                  <div className="absolute w-full pt-2 pr-4">
                    <MultiDropdownControl />
                  </div>
                </div>

                <div className="relative mt-2 pr-6">
                  <label className="label-sm text-color-text mt-0 -mr-2 block text-sm">
                    Checkbox Dropdown
                  </label>
                  <div className="absolute w-full">
                    <CheckboxDropdownControl />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">TEXTAREA</div>
            <div className="m-3 border-b py-2 text-sm"></div>
          </div>

          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="">
                <TextAreaControl
                  id={"text-area"}
                  label={"Description"}
                  placeholder={"Enter your text here"}
                  isDisabled={false}
                ></TextAreaControl>
              </div>
            </div>

            <div className="m-3"></div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">CARD</div>

            <div className="m-3 border-b py-2 text-sm">ICONS</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid md:grid-cols-2">
                <div className="pr-4">
                  <label className="label-sm text-color-text block text-sm">
                    Normal
                  </label>
                  <CardControl isHoverEnable={false} />
                </div>
                <div className="pr-4">
                  <label className="label-sm text-color-text block text-sm">
                    On Mouse Hover
                  </label>
                  <CardControl isHoverEnable={true} />
                </div>
              </div>
            </div>

            <div className="m-3">
              <div className="grid grid-cols-6 pt-5">
                {/* <IconControl size={'md'} icon={'icon-angle-down'} />
              <IconControl size={'md'} icon={'icon-angle-down2'} /> */}
                <IconControl size={"md"} icon={"icon- -left mb-4"} />
                {/* <IconControl size={'md'} icon={'icon-attach'} /> */}
                <IconControl size={"md"} icon={"icon-Audit text-ic-lg mb-4"} />
                <IconControl
                  size={"md"}
                  icon={"icon-Audit-date text-ic-lgmb-4 mb-4"}
                />
                <IconControl size={"md"} icon={"icon-Claim text-ic-lg"} />
                <IconControl
                  size={"md"}
                  icon={"icon-Claim-htmlForm-Type text-ic-lg"}
                />
                <IconControl size={"md"} icon={"icon-close text-ic-lg"} />
                <IconControl size={"md"} icon={"icon-Code text-ic-lg"} />
                <IconControl size={"md"} icon={"icon-settings text-ic-lg"} />
                <IconControl size={"md"} icon={"icon-downloads text-ic-lg"} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">LINK BUTTONS</div>
            <div className="m-3 border-b py-2 text-sm">RADIO</div>
          </div>
          <div className="grid grid-cols-2 pb-6">
            <div className="m-3">
              <div className="grid md:grid-cols-2">
                <div className="pr-4">
                  <LinkButtonControl />
                </div>
                <div className="pr-4">
                  <LinkButtonControl isDisabled={true} />
                </div>
              </div>
            </div>

            <div className="m-3">
              <div className="grid md:grid-cols-1">
                <div className="pr-4">
                  <RadioControl isDisabled={false} label={"Male"} value="" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 !text-sm">AVATAR</div>
            <div className="m-3 border-b py-2 !text-sm">ICON-BUTTON</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="mb-5 grid md:grid-cols-1">
                <div className="flex pr-4">
                  <AvatarControl
                    src={IcPerson}
                    isClickable={true}
                    btnStyle={"mx-2"}
                  />
                  <AvatarControl
                    src={IcPerson}
                    notification={"active"}
                    btnStyle={"mx-2"}
                  />
                  <AvatarControl
                    src={IcPerson}
                    notification={"inactive"}
                    btnStyle={"mx-2"}
                  />
                  <AvatarControl
                    src={IcPerson}
                    isDisabled={true}
                    isClickable={true}
                  />
                </div>
              </div>
              <div className="mb-5 grid md:grid-cols-1">
                <div className="flex pr-4">
                  <AvatarControl
                    icon={"icon-add-icon"}
                    iconStyle={"text-primary-accent !text-xl"}
                    isClickable={true}
                    btnStyle={"bg-orange-100 mx-2"}
                  />
                  <AvatarControl
                    icon={"icon-add-icon"}
                    iconStyle={"text-primary-accent text-base font-medium"}
                    valueStyle={"text-primary-accent"}
                    isClickable={true}
                    data={"2"}
                    btnStyle={"bg-orange-100 mx-2"}
                  />

                  <AvatarButtonControl
                    src={IcPerson}
                    isHover={true}
                    isDisabled={false}
                  />
                </div>
              </div>
              <div className="mb-5 grid md:grid-cols-1">
                <div className="flex pr-4"></div>
              </div>
            </div>
            <div className="m-3">
              <div className="mb-5 grid grid-cols-7">
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    btnStyle={"bg-primary-theme"}
                    icon={"icon-add-icon text-ic-lg"}
                    isDisabled={false}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    icon={"icon-check"}
                    isDisabled={true}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    icon={"icon-filter-icon"}
                    isDisabled={true}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    icon={"icon-Share"}
                    isDisabled={false}
                    isHoverEnable={true}
                  />
                </div>
              </div>
              <div className="mb-5 grid grid-cols-7">
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    btnStyle={"bg-primary-theme"}
                    icon={"icon-add-icon"}
                    isDisabled={false}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    icon={"icon-check"}
                    isDisabled={true}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    icon={"icon-filter-icon"}
                    isDisabled={true}
                  />
                </div>

                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    icon={"icon-Share"}
                    isDisabled={false}
                    isHoverEnable={true}
                  />
                </div>
              </div>
              <div className="mb-5 grid grid-cols-7">
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    btnStyle={"bg-orange-100"}
                    valueStyle={"text-primary-accent"}
                    data={"Dx"}
                    isDisabled={false}
                    isRounded={false}
                  />
                </div>
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    btnStyle={"bg-white"}
                    valueStyle={"text-color-text"}
                    data={"H"}
                    isDisabled={false}
                    isRounded={true}
                  />
                </div>
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"sm"}
                    btnStyle={"bg-white"}
                    valueStyle={"text-color-text"}
                    data={"02"}
                    isDisabled={false}
                    isRounded={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-7">
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    btnStyle={"bg-orange-100"}
                    valueStyle={"text-primary-accent"}
                    data={"Dx"}
                    isDisabled={false}
                    isRounded={false}
                  />
                </div>
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    btnStyle={"bg-white"}
                    valueStyle={"text-color-text"}
                    data={"H"}
                    isDisabled={false}
                    isRounded={true}
                  />
                </div>
                <div className="pr-4">
                  <IconButtonControl
                    icsize={"md"}
                    btnStyle={"bg-white"}
                    valueStyle={"text-color-text"}
                    data={"02"}
                    isDisabled={false}
                    isRounded={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">CHECKBOX</div>
            <div className="m-3 border-b py-2 text-sm">LABEL</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid grid-cols-1">
                <div className="mb-5 grid md:grid-cols-4">
                  <>
                    <CheckboxControl
                      size={"sm"}
                      isDisabled={false}
                      label={"Small"}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"Medium"}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"Medium Box"}
                      isRounded={true}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"lg"}
                      isDisabled={false}
                      label={"Large"}
                      isChecked={true}
                    />
                  </>
                </div>

                <div className="grid md:grid-cols-4">
                  <>
                    <CheckboxControl
                      size={"sm"}
                      isDisabled={true}
                      label={"Disabled"}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"All Claim"}
                      description={""}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"Medium Box"}
                    />
                  </>
                  <>
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"Medium Box"}
                      isRounded={true}
                    />
                  </>
                </div>
                <div className="mt-5 grid md:grid-cols-1">
                  <>
                    <CheckboxControl
                      size={"lg"}
                      isDisabled={false}
                      label={"Default Check"}
                      description={""}
                      isChecked={true}
                    />
                  </>
                </div>
              </div>
            </div>

            <div className="m-3">
              <div className="grid grid-cols-1">
                <div className="pr-4">
                  <LabelControl size={"xs"} label={"Label- extra small"} />
                </div>
                <div className="pr-4">
                  <LabelControl size={"sm"} label={"Label- small "} />
                </div>
                <div className="pr-4">
                  <LabelControl size={"md"} label={"Label- medium"} />
                </div>
                <div className="pr-4">
                  <LabelControl size={"lg"} label={"Label- large"} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">FLAT-BUTTON</div>
            <div className="m-3 border-b py-2 text-sm">TOGGLE</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid md:grid-cols-1">
                <div className="pr-4">
                  <FlatButtonControl
                    label={"Support"}
                    icSize={"md"}
                    icon={"icon-settings"}
                    isDisabled={true}
                    icPosition={"left"}
                  />
                </div>
                <div className="pr-4">
                  <FlatButtonControl
                    label={"Help"}
                    icSize={"md"}
                    icon={"icon-info"}
                    isDisabled={false}
                    icPosition={"right"}
                  />
                </div>
              </div>
            </div>
            <>
              <div className="m-3">
                <div className="grid grid-cols-1">
                  <div className="pb-4">
                    <ToggleControl
                      id={"toggle"}
                      size={"sm"}
                      label={"H Facility"}
                      value={"H-fasility"}
                      isDisabled={false}
                    />
                  </div>
                  <div className="pr-4">
                    <ToggleControl
                      id={"toggle"}
                      size={"sm"}
                      label={"M Professional"}
                      value={"M-Professional"}
                      isDisabled={false}
                    />
                  </div>
                </div>
              </div>
            </>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">SEARCH INPUT</div>
            <div className="m-3 border-b py-2 text-sm">TOOLTIP</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid md:grid-cols-2">
                <div className="pr-4">
                  <SearchInputControl
                    id={"Search"}
                    label={"Search Input"}
                    placeholder={"Search"}
                    isDisabled={false}
                  />
                </div>
                <div className="pr-4">
                  <SearchInputControl
                    id={"Search-disable"}
                    label={"Search Disable"}
                    placeholder={"Search here"}
                    isDisabled={true}
                  />
                </div>
              </div>
            </div>
            <div className="m-3">
              <div className="grid grid-cols-3">
                <>
                  <Tooltip
                    label={"Tooltip here"}
                    tooltipStyle={"tooltip-style"}
                    lblStyle={"labelClass"}
                  >
                    <button className="my-2 text-sm">on Hover</button>   
                  </Tooltip>
                </>
                <>
                  <Tooltip
                    label={"Checkbox here"}
                    tooltipStyle={"tooltip-style"}
                    lblStyle={"labelClass"}
                  >
                    <CheckboxControl
                      size={"md"}
                      isDisabled={false}
                      label={"Medium Box"}
                      isRounded={true}
                    />
                  </Tooltip>
                </>
                <>
                  <Tooltip
                    label={"Avatar here"}
                    tooltipStyle={"tooltip-style"}
                    lblStyle={"labelClass"}
                  >
                    <AvatarControl
                      src={IcPerson}
                      isClickable={true}
                      btnStyle={"mx-2"}
                    />
                  </Tooltip>
                </>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">RANGE INPUT</div>
            <div className="m-3 border-b py-2 text-sm"></div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="grid grid-cols-1">
                <RangeInputCotrol />
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">
              BUTTON (Default , Hover)
            </div>
            <div className="m-3 border-b py-2 !text-sm">
              BUTTON (Icon, Data)
            </div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-3">
              <div className="mb-5 grid grid-cols-4">
                <>
                  <ButtonControl
                    size={"md"}
                    name={"All"}
                    isDisabled={false}
                    isActive={true}
                    btnStyle={
                      "w-wp-92 disabled:opacity-40 items-center flex justify-center rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in text-sm h-hp-32 pb-0.5 cursor-pointer"
                    }
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"Top 10"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"Top 20"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
              </div>
              <div className="mb-5 grid grid-cols-4">
                <>
                  <ButtonControl
                    size={"md"}
                    name={"All"}
                    isDisabled={true}
                    isActive={false}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"All"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={"text-primary-accent rounded-sm-4 w-wp-92"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"All"}
                    isDisabled={false}
                    isHoverEnable={true}
                    isActive={false}
                    btnStyle={"!text-primary-accent rounded-sm-4 w-wp-92"}
                  />
                </>
              </div>
              <div className="mb-5 grid grid-cols-4">
                <>
                  <ButtonControl
                    size={"md"}
                    name={"Reject"}
                    isDisabled={false}
                    isActive={false}
                    isSecondary={true}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"Pend"}
                    isDisabled={false}
                    isActive={false}
                    isSecondary={true}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"md"}
                    name={"Accept"}
                    isDisabled={false}
                    isHoverEnable={false}
                    isActive={false}
                    isSecondary={true}
                    btnStyle={"rounded-sm-4 w-wp-92"}
                  />
                </>
              </div>
              <div className="mb-5 grid w-40 grid-cols-1">
                <div className="btn-grps fix w-44">
                  <ButtonControl
                    size={"custom"}
                    name={"CPT"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center mr-2 mb-2"
                    }
                  />

                  <ButtonControl
                    size={"custom"}
                    name={"Diagnosis"}
                    isDisabled={false}
                    isActive={true}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center mr-2 mb-2"
                    }
                  />
                  <ButtonControl
                    size={"custom"}
                    name={"Revenue"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 text-xs rounded-xs-3 h-5 flex items-center mr-2 mb-2"
                    }
                  />
                  <ButtonControl
                    size={"custom"}
                    name={"Revenue"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center mr-2 mb-2"
                    }
                  />
                  <ButtonControl
                    size={"custom"}
                    name={"Bill Type"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center mr-2 mb-2"
                    }
                  />
                  <ButtonControl
                    size={"custom"}
                    name={"EX"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center"
                    }
                  />
                  <ButtonControl
                    size={"custom"}
                    name={"Place of service"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={
                      "px-1 mr-0 text-xs rounded-xs-3 h-5 flex items-center"
                    }
                  />
                </div>
              </div>
              <div className="mb-5 grid grid-cols-4">
                <>
                  <ButtonControl
                    size={"custom"}
                    name={"CPT"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={"px-8 py-1 w-full h-8 text-sm rounded-sm-4 mr-2"}
                  />
                </>
                <>
                  <ButtonControl
                    size={"custom"}
                    name={"All"}
                    isDisabled={false}
                    isActive={false}
                    btnStyle={"px-8 py-1 w-full h-8 text-sm rounded-sm-4"}
                  />
                </>
              </div>
            </div>

            <div className="m-3">
              <div className="mb-5 grid grid-cols-4">
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Open"}
                    data={12}
                    isDisabled={false}
                    isHoverEnable={false}
                    isActive={true}
                    btnStyle={"w-wp-92"}
                  />
                </>
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Pend"}
                    data={13}
                    isDisabled={false}
                    isHoverEnable={false}
                    isActive={false}
                    btnStyle={"w-wp-92"}
                  />
                </>
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Closed"}
                    data={14}
                    isDisabled={false}
                    isHoverEnable={false}
                    isActive={false}
                    btnStyle={"w-wp-92"}
                  />
                </>
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Waiting"}
                    data={15}
                    isDisabled={false}
                    isHoverEnable={false}
                    isActive={false}
                    btnStyle={"w-wp-92"}
                  />
                </>
                <></>
              </div>

              <div className="mb-5 grid grid-cols-3 bg-white p-5">
                <div className="mr-1">
                  <DataButtonControl
                    size={"md"}
                    name={"Download"}
                    icon={"icon-downloads"}
                    icSize={"md"}
                    icPosition={"left"}
                    isGrayed={true}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full"}
                  />
                </div>
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Download"}
                    icon={"icon-downloads"}
                    icSize={"md"}
                    icPosition={"left"}
                    isGrayed={true}
                    isActive={true}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full"}
                  />
                </>
              </div>
              <div className="mb-2 grid grid-cols-2 bg-white p-5">
                <div className="mr-1">
                  <DataButtonControl
                    size={"md"}
                    name={"Create New Playlist"}
                    icon={"icon-add-icon"}
                    icSize={"md"}
                    icPosition={"left"}
                    isGrayed={true}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full"}
                  />
                </div>
                <>
                  <DataButtonControl
                    size={"md"}
                    name={"Create New Playlist"}
                    icon={"icon-add-icon"}
                    icSize={"md"}
                    icPosition={"left"}
                    isGrayed={true}
                    isActive={true}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full"}
                  />
                </>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">DATE PICKER</div>
            <div className="m-3 border-b py-2 text-sm">Dialog</div>
          </div>
          <div className="grid pb-6 md:grid-cols-2">
            <div className="m-0 w-44">
              <DatepickerControl />
            </div>

            <div className="relative m-3 h-80">
              <div onClick={() => onDialogClick()} className="cursor-pointer">
                Click here...
              </div>
              <DialogControl visible={isOpenDialog} closeModal={closeModal}>
                <div className="mb-28 flex h-10 items-center justify-start">
                  <AvatarControl
                    size={"sm"}
                    icon={"icon-Claim-htmlForm-Type"}
                    iconStyle={"text-orange-300 text-ic-xl"}
                    isClickable={false}
                    btnStyle={"bg-dialog-circle mr-3.5"}
                  />

                  <label className="label-lg text-color-text block text-sm">
                    Create New Playlist
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <DataButton
                    size={"md"}
                    name={"Cancel"}
                    icPosition={"left"}
                    isGrayed={false}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full border border-gray-300 mr-1"}
                    onClick={() => closeModal()}
                  />
                  <DataButton
                    size={"md"}
                    name={"Add"}
                    icPosition={"left"}
                    isGrayed={true}
                    isActive={true}
                    isDisabled={false}
                    isHoverEnable={false}
                    btnStyle={"w-full ml-1"}
                    onClick={() => closeModal()}
                  />
                </div>
              </DialogControl>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 border-b py-2 text-sm">Text Hover</div>
            <div className="m-3 border-b py-2 text-sm">PopOver Dialog </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="m-3 text-sm">
              <Text
                isHoverEnable={true}
                inlineBlock={true}
                value={"Text 1"}
                txtStyle={"text-sm mr-2"}
              />
              <Text
                isHoverEnable={true}
                inlineBlock={true}
                value={"Text 2"}
                txtStyle={"text-sm mr-2"}
              />
              <Text
                isHoverEnable={true}
                inlineBlock={true}
                value={"Text 3"}
                txtStyle={"text-sm"}
              />
            </div>

            <div className="m-3 h-96">
              <PopOverDialog
                visible={isOpenPop}
                onCloseModel={() => setPopOver(false)}
                icon={
                  <Icon
                    size={"lg"}
                    imgStyle={transferIC}
                    onClick={() => onOpenPopOver()}
                    icon={"mx-1 icon-transfer-workflow"}
                  />
                }
              >
                <div className="w-wp-243">
                  <div className="bg-gray-50 p-3.5">
                    <div className="mb-3 flex justify-start">
                      <>
                        <SearchInput
                          id={"Search"}
                          placeholder={"Search"}
                          isDisabled={false}
                          onChange={() => {}}
                          inputStyle={"search-field"}
                        />
                      </>
                      <>
                        <IconButton
                          icsize={"custom"}
                          btnStyle={"h-hp-30 w-wp-30"}
                          icon={"icon-Share"}
                          iconStyle={"text-ic-lg"}
                          isDisabled={false}
                          isHoverEnable={true}
                          onClick={() => onClosePopOver()}
                        />
                      </>
                    </div>

                    <div className="mb-1.5">
                      <Label
                        lblStyle={"text-gray-500 font-medium"}
                        size={"xs"}
                        label={"Recently Added"}
                      />
                    </div>

                    <div className="tooltip-wrp h-hp-34 flex justify-between">
                      {transferList}
                    </div>
                  </div>
                </div>
              </PopOverDialog>
            </div>
          </div>

          <div className="grid md:grid-cols-1">
            <div className="m-3 border-b py-2 text-sm">DRAWER</div>
          </div>

          <div className="mx-auto">
            <div className="my-8 grid md:grid-cols-8">
              <DataButton
                size={"md"}
                name={!isOpenDrawer ? "Open Drawer" : "Close Drawer"}
                icSize={"md"}
                isGrayed={true}
                isDisabled={false}
                isHoverEnable={true}
                btnStyle={"w-full"}
                onClick={handleClick}
              />

              {/* <DataButton
                size={'md'}
                name={!isOpenDrawer ? 'Open Left Drawer' : 'Close Left Drawer'}
                icSize={'md'}
                isGrayed={true}
                isDisabled={false}
                isHoverEnable={true}
                btnStyle={'w-full'}
                onClick={handleClickLeftDrawer}
              /> */}
            </div>
          </div>

          <div className="mb-20 grid h-96 md:grid-cols-1">
            <Drawer
              id="my-drawer-4"
              isOpenDrawer={isOpenDrawer || isOpenLeftDrawer}
              closeDrawer={closeDrawer}
              position={
                !isOpenLeftDrawer ? positionEnum.right : positionEnum.left
              }
            >
              <div className="drawer-content">
                <>
                  <Text
                    isHoverEnable={false}
                    inlineBlock={true}
                    value={"Drawer"}
                    txtStyle={"text-xl mr-2"}
                  />
                </>
              </div>

              <div className="drawer-side">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <div className="bg-base-200 px-20 py-5">
                  <Text
                    isHoverEnable={false}
                    inlineBlock={true}
                    value={"Drawer Left-Side"}
                    txtStyle={"text-lg mr-2"}
                  />
                </div>
              </div>
              <h1>ScrollBar</h1>
              <Scrollbar
                maxHeight="80vh"
                maxWidth="100%"
                horizontal="hidden"
                vertical="scroll"
                autoHide={true}
              >
                <div style={{ height: "150vh", padding: "20px" }}>
                  <h2>Scrollable Content</h2>
                  <p>Put your long content here...</p>
                </div>
              </Scrollbar>
            </Drawer>
          </div>
        </div>
      </ScrollBar>
      {/* </ScrollBar> */}
    </>
  );
};
export default UIControls;
