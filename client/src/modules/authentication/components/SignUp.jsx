
import React, { useState } from 'react'
import RoleCard from './RoleCard';
import { Button, LinkButton } from '../../../ui-controls/index';
import { useNavigate } from 'react-router-dom';
const roles = [
  {
    icon: '👤',
    title: 'Patient',
    description: 'Book appointments, consult doctors, manage health records',
  },
  {
    icon: '👨‍⚕️',
    title: 'Doctor',
    description: 'Manage patients, conduct consultations, share prescriptions',
  },
  {
    icon: '👨‍💼',
    title: 'Admin/Clinic Staff',
    description: 'Manage users, oversee operations, analytics',
  },
];

const SignUp = ({ currentStep }) => {
  const steps = [1, 2, 3];
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate()

  return (
    <div className='grid place-items-center h-screen bg-gray-300'>
      <div className='rounded-lg bg-white p-4 w-[70%] text-center'>
        <div>
          <div className='grid justify-center '>
            <div className='rounded-full w-fit text-txt-18 text-white p-2 font-semibold' style={{ background: 'linear-gradient(135deg, #4CAF50, #2196F3)' }}>M+</div>
          </div>
          <div className='mt-2 font-semibold text-txt-18'>MedLink360</div>
          <span className='text-links text-txt-md-12'>Join Our Healthcare Community</span>
        </div>

        {/* optional */}
        <div className='mt-4'>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4 dark:bg-gray-200">
            <div className="h-1 rounded-full dark:bg-green-500" style={{ width: "45%" }}></div>
          </div>

          {/* <div className='flex justify-center gap-4 mt-4'>
            {steps.map((step, index) => {
              const isCompleted = index < currentStep; // 100% fill
              const isCurrent = index === currentStep;  // current step

              const width = isCompleted || isCurrent ? '100%' : '0%';

              return (
                <div key={index}>
                  <div className="w-8 bg-gray-200 rounded-full h-1 mb-4">
                    <div
                      className="h-1 rounded-full bg-green-500 transition-all duration-300"
                      style={{ width }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div> */}
        </div>

        <div className='mt-4'>
          <h1 className='font-semibold text-txt-16 text-left mb-2'>Choose Your Role</h1>
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              icon={role.icon}
              title={role.title}
              description={role.description}
              isSelected={selectedRole === role.title}
              onSelect={() => setSelectedRole(role.title)}
              onDeselect={() => {
                if (selectedRole === role.title) {
                  setSelectedRole(null);
                }
              }}
            />
          ))}

          <div className='grid grid-cols-2 gap-4 mt-4'>
            <Button
              name={"Back"}
              isDisabled={false}
              isActive={true}
              btnStyle={
                "items-center rounded-sm-4 !border-gray-200 !text-gray-500 !text-semibold  hover:bg-gray-100 cursor-pointer"
              }
            />
            <Button
              name={"Create Account"}
              isDisabled={false}
              isActive={true}
              btnStyle={
                "items-center rounded-sm-4 !text-white !bg-green-500 !border-none !text-semibold  hover:bg-green-800 cursor-pointer"
              }
            />
          </div>

          <div className='mt-2 text-links text-txt-md-13'>Already have an account?
            <LinkButton
              // isDisabled={isDisabled}
              isActive={true}
              label={` Sign in here`}
              btnStyle={"btn-style ml-1 !text-green-500 font-semibold"}
              onClick={() => navigate('/sign-in')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp