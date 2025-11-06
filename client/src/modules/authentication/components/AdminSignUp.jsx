import React, { useState } from "react";
import { Input, Button } from "../../../components";

const AdminSignUp = ({ formData, errors, handleChange, showPassword, setShowPassword, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4'>
        <p className='text-yellow-400 text-sm'>
          ⚠️ Admin registration requires an admin key. Please contact the system administrator to obtain one.
        </p>
      </div>

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
        <div className='md:col-span-2'>
          <Input
            label='Admin Key'
            name='adminKey'
            type='password'
            value={formData.adminKey || ''}
            onChange={handleChange}
            placeholder='Enter admin registration key'
            error={errors.adminKey}
            required
          />
        </div>
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
        className='w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {loading ? "Creating Account..." : "Create Admin Account"}
      </Button>
    </form>
  );
};

export default AdminSignUp;

