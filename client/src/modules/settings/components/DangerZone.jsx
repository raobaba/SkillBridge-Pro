import React from "react";
import { Button } from "../../../components";

export default function DangerZone() {
  return (
    <section className='bg-red-600/20 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 space-y-2 text-white'>
      <h2 className='text-xl font-semibold'>Danger Zone</h2>
      <p className='text-gray-200 text-sm'>
        Delete your account permanently. This action cannot be undone.
      </p>
      <Button variant='destructive'>Delete Account</Button>
    </section>
  );
}
