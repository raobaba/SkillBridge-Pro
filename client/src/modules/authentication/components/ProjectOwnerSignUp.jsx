import React from "react";
import { Input, Button } from "../../../components";

const ProjectOwnerSignUp = ({ formData, errors, handleChange, showPassword, setShowPassword, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label='Full Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your full name'
          error={errors.name}
          required
        />
        <Input
          type='email'
          label='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email'
          error={errors.email}
          required
        />
        <Input
          label='Company Name'
          name='company'
          value={formData.company || ''}
          onChange={handleChange}
          placeholder='Your company or organization'
          error={errors.company}
        />
        <Input
          label='Location'
          name='location'
          value={formData.location || ''}
          onChange={handleChange}
          placeholder='City, Country'
          error={errors.location}
        />
        <Input
          label='Website (Optional)'
          name='website'
          type='url'
          value={formData.website || ''}
          onChange={handleChange}
          placeholder='https://yourcompany.com'
          error={errors.website}
        />
        <Input
          label='Business Type'
          name='businessType'
          type='select'
          value={formData.businessType || ''}
          onChange={handleChange}
          error={errors.businessType}
          options={[
            { value: "", label: "Select Business Type" },
            { value: "startup", label: "Startup" },
            { value: "smb", label: "Small/Medium Business" },
            { value: "enterprise", label: "Enterprise" },
            { value: "agency", label: "Agency" },
            { value: "freelancer", label: "Freelancer" },
            { value: "other", label: "Other" },
          ]}
        />
      </div>

      <Input
        type='password'
        label='Password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='Create a strong password'
        error={errors.password}
        showToggle={true}
        isVisible={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        required
      />

      <Button
        type='submit'
        disabled={loading}
        className='w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg transition-all font-medium text-sm'
      >
        {loading ? "Creating Account..." : "Create Project Owner Account"}
      </Button>
    </form>
  );
};

export default ProjectOwnerSignUp;

