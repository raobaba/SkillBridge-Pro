import React from "react";
import { Input, Button } from "../../../components";

const DeveloperSignUp = ({ formData, errors, handleChange, showPassword, setShowPassword, onSubmit, loading }) => {
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
          type='number'
          label='Experience (years)'
          name='experience'
          value={formData.experience}
          onChange={handleChange}
          min={0}
          placeholder='0'
          error={errors.experience}
          required
        />
        <Input
          label='Preferred Domains'
          name='domains'
          value={formData.domains}
          onChange={handleChange}
          placeholder='Web Dev, AI/ML, Mobile...'
          error={errors.domains}
          required
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
          label='Availability'
          name='availability'
          type='select'
          value={formData.availability}
          onChange={handleChange}
          error={errors.availability}
          options={[
            { value: "full-time", label: "Full-time" },
            { value: "part-time", label: "Part-time" },
            { value: "freelance", label: "Freelance" },
          ]}
          required
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
        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {loading ? "Creating Account..." : "Create Developer Account"}
      </Button>
    </form>
  );
};

export default DeveloperSignUp;

