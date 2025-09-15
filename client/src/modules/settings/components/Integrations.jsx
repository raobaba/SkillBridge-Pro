import React from "react";
import { Github } from "lucide-react";
import { Badge } from "../../../components";

export default function Integrations({ integrations, toggleIntegration }) {
  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Github className='w-5 h-5 text-gray-200' /> Integrations
      </h2>
      <div className='flex flex-col space-y-2'>
        {Object.keys(integrations).map((type) => (
          <div key={type} className='flex items-center justify-between'>
            <span className='capitalize'>{type}</span>
            <Badge
              variant={integrations[type] ? "success" : "error"}
              onClick={() => toggleIntegration(type)}
              className='cursor-pointer'
            >
              {integrations[type] ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
