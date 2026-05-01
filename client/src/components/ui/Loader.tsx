import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="animate-spin text-white" size={32} />
    </div>
  );
};

export default Loader;